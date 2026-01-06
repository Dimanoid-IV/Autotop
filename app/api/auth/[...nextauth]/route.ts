import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Ленивая инициализация NextAuth handler
let handler: any = null

async function getHandler() {
  if (handler) {
    return handler
  }

  // Проверяем обязательные переменные перед инициализацией
  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error('NEXTAUTH_SECRET is not set')
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }

  const NextAuth = (await import('next-auth')).default
  const { getAuthOptions } = await import('@/lib/auth')
  const authOptions = await getAuthOptions()
  
  // NextAuth v4 в App Router - создаем handler
  handler = NextAuth(authOptions)
  
  return handler
}

// Обработчик ошибок для возврата валидного ответа
function errorResponse(message: string) {
  return new Response(
    JSON.stringify({ 
      error: 'Authentication service unavailable',
      message 
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

// Адаптер для преобразования NextRequest в формат, который понимает NextAuth v4
// NextAuth v4 ожидает объекты req и res в формате Pages Router
async function adaptRequestForNextAuth(
  req: NextRequest, 
  params: { nextauth?: string[] } | Promise<{ nextauth?: string[] }>
): Promise<{ req: any; res: any }> {
  const url = new URL(req.url)
  
  // Параметры могут быть промисом в новых версиях Next.js
  const resolvedParams = await Promise.resolve(params)
  
  // Извлекаем параметры nextauth из URL, если они не переданы через params
  let nextauthParams: string[] = resolvedParams?.nextauth || []
  
  // Если параметры не переданы, извлекаем их из URL
  if (!nextauthParams || nextauthParams.length === 0) {
    const pathParts = url.pathname.split('/')
    const authIndex = pathParts.indexOf('auth')
    if (authIndex !== -1 && authIndex < pathParts.length - 1) {
      nextauthParams = pathParts.slice(authIndex + 1)
    }
  }
  
  // Создаем объект ответа, который ожидает NextAuth v4
  let statusCode = 200
  const headers: Record<string, string> = {}
  let responseBody: any = null
  let redirectUrl: string | null = null
  
  const res: any = {
    status: (code: number) => {
      statusCode = code
      return res
    },
    json: (data: any) => {
      // Убеждаемся, что данные правильно сериализуются в JSON
      if (data !== null && data !== undefined) {
        try {
          responseBody = typeof data === 'string' ? data : JSON.stringify(data)
        } catch (e) {
          console.error('Error stringifying JSON:', e)
          responseBody = JSON.stringify({ error: 'Failed to serialize response' })
        }
      } else {
        responseBody = 'null'
      }
      headers['Content-Type'] = 'application/json'
      return res
    },
    send: (data: any) => {
      // Если данные - объект, сериализуем в JSON
      if (typeof data === 'object' && data !== null) {
        try {
          responseBody = JSON.stringify(data)
          headers['Content-Type'] = 'application/json'
        } catch (e) {
          responseBody = String(data)
        }
      } else {
        responseBody = data !== null && data !== undefined ? String(data) : ''
      }
      return res
    },
    redirect: (url: string) => {
      redirectUrl = url
      statusCode = 302
      return res
    },
    setHeader: (name: string, value: string) => {
      headers[name] = value
      return res
    },
    getHeader: (name: string) => {
      return headers[name]
    },
    // Сохраняем функцию для получения финального ответа
    __getResponse: () => {
      if (redirectUrl) {
        return Response.redirect(redirectUrl, statusCode)
      }
      // Если responseBody не установлен, возвращаем пустой ответ
      const body = responseBody !== null && responseBody !== undefined 
        ? responseBody 
        : ''
      return new Response(body, {
        status: statusCode,
        headers,
      })
    },
  }
  
  // Создаем объект запроса в формате, который ожидает NextAuth v4
  // NextAuth v4 может ожидать body как строку или как поток
  const adaptedReq: any = {
    method: req.method,
    headers: Object.fromEntries(req.headers.entries()),
    query: {
      nextauth: nextauthParams
    },
    url: url.toString(),
    body: undefined, // Будет установлен позже для POST запросов
    // Добавляем методы для чтения body, которые может использовать NextAuth
    on: (event: string, callback: Function) => {
      // Поддержка событий для stream
      if (event === 'data' && adaptedReq.body) {
        callback(Buffer.from(adaptedReq.body))
      } else if (event === 'end') {
        callback()
      }
      return adaptedReq
    },
  }
  
  return { req: adaptedReq, res }
}

export async function GET(
  req: NextRequest,
  context: { params: { nextauth?: string[] } | Promise<{ nextauth?: string[] }> }
) {
  try {
    // Проверяем переменные окружения
    if (!process.env.NEXTAUTH_SECRET || !process.env.DATABASE_URL) {
      console.error('NextAuth: Missing environment variables')
      return errorResponse('Required environment variables are not set')
    }

    if (!handler) {
      try {
        handler = await getHandler()
      } catch (handlerError) {
        console.error('NextAuth: Failed to initialize handler:', handlerError)
        return errorResponse(
          handlerError instanceof Error ? handlerError.message : 'Failed to initialize NextAuth handler'
        )
      }
    }
    
    // Адаптируем запрос для NextAuth v4
    let adaptedReq: any
    let res: any
    try {
      const adapted = await adaptRequestForNextAuth(req, context.params)
      adaptedReq = adapted.req
      res = adapted.res
    } catch (adaptError) {
      console.error('NextAuth: Failed to adapt request:', adaptError)
      return errorResponse(
        adaptError instanceof Error ? adaptError.message : 'Failed to adapt request'
      )
    }
    
    // NextAuth v4 handler вызывается как функция с адаптированными req и res
    let result: any
    try {
      result = await handler(adaptedReq, res)
    } catch (handlerError) {
      console.error('NextAuth: Handler execution error:', handlerError)
      return errorResponse(
        handlerError instanceof Error ? handlerError.message : 'Handler execution failed'
      )
    }
    
    // Если handler вернул Response напрямую, используем его
    if (result instanceof Response) {
      return result
    }
    
    // Иначе возвращаем ответ, созданный NextAuth через методы res
    try {
      const response = (res as any).__getResponse()
      
      // Проверяем, что ответ был создан
      if (!response) {
        console.error('NextAuth: Handler did not create a response')
        return errorResponse('NextAuth handler did not return a response')
      }
      
      return response
    } catch (responseError) {
      console.error('NextAuth: Failed to get response:', responseError)
      return errorResponse(
        responseError instanceof Error ? responseError.message : 'Failed to get response'
      )
    }
  } catch (error) {
    console.error('NextAuth GET error:', error)
    if (error instanceof Error) {
      console.error('Error stack:', error.stack)
    }
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}

export async function POST(
  req: NextRequest,
  context: { params: { nextauth?: string[] } | Promise<{ nextauth?: string[] }> }
) {
  try {
    // Проверяем переменные окружения
    if (!process.env.NEXTAUTH_SECRET || !process.env.DATABASE_URL) {
      console.error('NextAuth: Missing environment variables')
      return errorResponse('Required environment variables are not set')
    }

    if (!handler) {
      try {
        handler = await getHandler()
      } catch (handlerError) {
        console.error('NextAuth: Failed to initialize handler:', handlerError)
        return errorResponse(
          handlerError instanceof Error ? handlerError.message : 'Failed to initialize NextAuth handler'
        )
      }
    }
    
    // Адаптируем запрос для NextAuth v4 (до чтения body)
    let adaptedReq: any
    let res: any
    try {
      const adapted = await adaptRequestForNextAuth(req, context.params)
      adaptedReq = adapted.req
      res = adapted.res
    } catch (adaptError) {
      console.error('NextAuth: Failed to adapt request:', adaptError)
      return errorResponse(
        adaptError instanceof Error ? adaptError.message : 'Failed to adapt request'
      )
    }
    
    // Читаем body для POST запросов
    let body: string
    try {
      body = await req.text()
      // Устанавливаем body в адаптированный запрос
      adaptedReq.body = body
      
      // Также добавляем body как Buffer для совместимости
      if (body) {
        adaptedReq.bodyBuffer = Buffer.from(body)
      }
      
      // Логируем для отладки (только первые 100 символов)
      console.log('NextAuth POST body length:', body.length)
      if (body.length > 0) {
        console.log('NextAuth POST body preview:', body.substring(0, 100))
      }
    } catch (adaptError) {
      console.error('NextAuth: Failed to adapt request:', adaptError)
      return errorResponse(
        adaptError instanceof Error ? adaptError.message : 'Failed to adapt request'
      )
    }
    
    // NextAuth v4 handler вызывается как функция с адаптированными req и res
    let result: any
    try {
      result = await handler(adaptedReq, res)
    } catch (handlerError) {
      console.error('NextAuth: Handler execution error:', handlerError)
      return errorResponse(
        handlerError instanceof Error ? handlerError.message : 'Handler execution failed'
      )
    }
    
    // Если handler вернул Response напрямую, используем его
    if (result instanceof Response) {
      return result
    }
    
    // Иначе возвращаем ответ, созданный NextAuth через методы res
    try {
      const response = (res as any).__getResponse()
      
      // Проверяем, что ответ был создан
      if (!response) {
        console.error('NextAuth: Handler did not create a response')
        return errorResponse('NextAuth handler did not return a response')
      }
      
      return response
    } catch (responseError) {
      console.error('NextAuth: Failed to get response:', responseError)
      return errorResponse(
        responseError instanceof Error ? responseError.message : 'Failed to get response'
      )
    }
  } catch (error) {
    console.error('NextAuth POST error:', error)
    if (error instanceof Error) {
      console.error('Error stack:', error.stack)
    }
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}

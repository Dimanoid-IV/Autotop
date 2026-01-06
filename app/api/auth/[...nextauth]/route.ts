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
  const adaptedReq: any = {
    method: req.method,
    headers: Object.fromEntries(req.headers.entries()),
    query: {
      nextauth: nextauthParams
    },
    url: url.toString(),
    body: undefined,
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
      return errorResponse('Required environment variables are not set')
    }

    if (!handler) {
      handler = await getHandler()
    }
    
    // Адаптируем запрос для NextAuth v4
    const { req: adaptedReq, res } = await adaptRequestForNextAuth(req, context.params)
    
    // NextAuth v4 handler вызывается как функция с адаптированными req и res
    const result = await handler(adaptedReq, res)
    
    // Если handler вернул Response напрямую, используем его
    if (result instanceof Response) {
      return result
    }
    
    // Иначе возвращаем ответ, созданный NextAuth через методы res
    const response = (res as any).__getResponse()
    
    // Проверяем, что ответ был создан
    if (!response) {
      // Если ответ не был создан, возвращаем ошибку
      return errorResponse('NextAuth handler did not return a response')
    }
    
    return response
  } catch (error) {
    console.error('NextAuth GET error:', error)
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
      return errorResponse('Required environment variables are not set')
    }

    if (!handler) {
      handler = await getHandler()
    }
    
    // Читаем body для POST запросов
    const body = await req.text()
    
    // Адаптируем запрос для NextAuth v4
    const { req: adaptedReq, res } = await adaptRequestForNextAuth(req, context.params)
    adaptedReq.body = body
    
    // NextAuth v4 handler вызывается как функция с адаптированными req и res
    const result = await handler(adaptedReq, res)
    
    // Если handler вернул Response напрямую, используем его
    if (result instanceof Response) {
      return result
    }
    
    // Иначе возвращаем ответ, созданный NextAuth через методы res
    const response = (res as any).__getResponse()
    
    // Проверяем, что ответ был создан
    if (!response) {
      // Если ответ не был создан, возвращаем ошибку
      return errorResponse('NextAuth handler did not return a response')
    }
    
    return response
  } catch (error) {
    console.error('NextAuth POST error:', error)
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}

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

// Адаптер для преобразования NextRequest в формат Pages Router
async function adaptRequestForNextAuth(
  req: NextRequest, 
  params: { nextauth?: string[] } | Promise<{ nextauth?: string[] }>
) {
  const url = new URL(req.url)
  const resolvedParams = await Promise.resolve(params)
  
  // Извлекаем параметры nextauth
  let nextauthParams: string[] = resolvedParams?.nextauth || []
  
  if (!nextauthParams || nextauthParams.length === 0) {
    const pathParts = url.pathname.split('/')
    const authIndex = pathParts.indexOf('auth')
    if (authIndex !== -1 && authIndex < pathParts.length - 1) {
      nextauthParams = pathParts.slice(authIndex + 1)
    }
  }
  
  // Создаем объект ответа
  let statusCode = 200
  const headers: Record<string, string> = {}
  let responseBody: any = null
  let redirectUrl: string | null = null
  let isCredentialsCallback = false
  
  const res: any = {
    status: (code: number) => {
      statusCode = code
      return res
    },
    json: (data: any) => {
      console.log('📤 res.json() called')
      responseBody = typeof data === 'string' ? data : JSON.stringify(data)
      headers['Content-Type'] = 'application/json'
      return res
    },
    send: (data: any) => {
      console.log('📤 res.send() called')
      if (typeof data === 'object' && data !== null) {
        responseBody = JSON.stringify(data)
        headers['Content-Type'] = 'application/json'
      } else {
        responseBody = data !== null && data !== undefined ? String(data) : ''
      }
      return res
    },
    redirect: (url: string) => {
      console.log('🔄 res.redirect() called with URL:', url?.substring(0, 150))
      redirectUrl = url
      statusCode = 302
      
      // Для credentials callback всегда возвращаем JSON вместо redirect
      if (isCredentialsCallback) {
        if (url.includes('/api/auth/signin') || url.includes('/api/auth/error')) {
          // Ошибка аутентификации - извлекаем параметр error из URL
          try {
            const urlObj = new URL(url, 'http://localhost')
            const errorParam = urlObj.searchParams.get('error')
            const errorDescription = urlObj.searchParams.get('error_description')
            
            // Определяем сообщение об ошибке
            let errorCode = errorParam || 'CredentialsSignin'
            let errorMessage = 'Authentication failed'
            
            if (errorDescription) {
              errorMessage = errorDescription
              // Проверяем, содержит ли описание EmailNotVerified
              if (errorDescription.includes('EmailNotVerified') || errorDescription.includes('Email not verified')) {
                errorCode = 'EmailNotVerified'
              }
            } else if (errorParam === 'EmailNotVerified' || url.includes('EmailNotVerified') || url.includes('email')) {
              errorCode = 'EmailNotVerified'
              errorMessage = 'EmailNotVerified'
            } else if (errorParam === 'CredentialsSignin') {
              errorMessage = 'Invalid email or password'
            }
            
            redirectUrl = null
            statusCode = 200
            responseBody = JSON.stringify({ 
              error: errorCode, 
              ok: false,
              message: errorMessage
            })
            headers['Content-Type'] = 'application/json'
          } catch (e) {
            // Если не удалось распарсить URL, используем стандартное сообщение
            redirectUrl = null
            statusCode = 200
            responseBody = JSON.stringify({ error: 'CredentialsSignin', ok: false })
            headers['Content-Type'] = 'application/json'
          }
        } else {
          // Успешная аутентификация - НЕ конвертируем в JSON!
          // Позволяем NextAuth обработать redirect и установить cookie
          // Только для credentials callback возвращаем JSON
          if (isCredentialsCallback) {
            redirectUrl = null
            statusCode = 200
            responseBody = JSON.stringify({ ok: true, url })
            headers['Content-Type'] = 'application/json'
          }
          // Иначе оставляем redirect как есть для установки cookie
        }
      }
      return res
    },
    setHeader: (name: string, value: string | string[]) => {
      if (Array.isArray(value)) {
        headers[name] = value.join(', ')
      } else {
        headers[name] = value
      }
      return res
    },
    getHeader: (name: string) => {
      return headers[name]
    },
    end: (data?: any) => {
      if (data !== undefined && data !== null) {
        if (typeof data === 'object') {
          responseBody = JSON.stringify(data)
          headers['Content-Type'] = headers['Content-Type'] || 'application/json'
        } else {
          responseBody = String(data)
        }
      }
      return res
    },
    write: (chunk: any) => {
      if (responseBody === null) {
        responseBody = ''
      }
      responseBody += String(chunk)
      return res
    },
    writeHead: (code: number, headersOrReason?: any, headersArg?: any) => {
      statusCode = code
      const headersToSet = typeof headersOrReason === 'object' ? headersOrReason : headersArg
      if (headersToSet) {
        Object.entries(headersToSet).forEach(([key, value]) => {
          res.setHeader(key, value as string)
        })
      }
      return res
    },
    __getResponse: () => {
      if (redirectUrl && !isCredentialsCallback) {
        console.log('Redirecting to:', redirectUrl.substring(0, 100), '... (status:', statusCode, ')')
        return Response.redirect(redirectUrl, statusCode)
      }
      const body = responseBody !== null && responseBody !== undefined ? responseBody : ''
      return new Response(body, {
        status: statusCode,
        headers,
      })
    },
  }
  
  // Создаем объект запроса
  const adaptedReq: any = {
    method: req.method,
    headers: Object.fromEntries(req.headers.entries()),
    query: {
      nextauth: nextauthParams
    },
    url: url.toString(),
    body: undefined,
  }
  
  // Проверяем, является ли это credentials callback
  if (nextauthParams[0] === 'callback' && nextauthParams[1] === 'credentials') {
    isCredentialsCallback = true
  }
  
  return { req: adaptedReq, res, isCredentialsCallback }
}

export async function GET(
  req: NextRequest,
  context: { params: { nextauth?: string[] } | Promise<{ nextauth?: string[] }> }
) {
  try {
    if (!process.env.NEXTAUTH_SECRET || !process.env.DATABASE_URL) {
      console.error('Missing env vars:', {
        hasSecret: !!process.env.NEXTAUTH_SECRET,
        hasDb: !!process.env.DATABASE_URL
      })
      return errorResponse('Required environment variables are not set')
    }

    if (!handler) {
      console.log('Initializing NextAuth handler...')
      handler = await getHandler()
      console.log('NextAuth handler initialized')
    }
    
    const resolvedParams = await Promise.resolve(context.params)
    console.log('NextAuth GET request:', resolvedParams?.nextauth)
    
    const { req: adaptedReq, res } = await adaptRequestForNextAuth(req, context.params)
    
    console.log('Calling NextAuth handler with:', {
      method: adaptedReq.method,
      query: adaptedReq.query,
      url: adaptedReq.url
    })
    
    const result = await handler(adaptedReq, res)
    
    console.log('Handler returned:', {
      isResponse: result instanceof Response,
      type: typeof result
    })
    
    if (result instanceof Response) {
      console.log('Handler returned Response, status:', result.status)
      return result
    }
    
    console.log('Getting response from res mock...')
    const response = (res as any).__getResponse()
    if (!response) {
      console.log('ERROR: __getResponse returned null/undefined')
      return errorResponse('NextAuth handler did not return a response')
    }
    
    console.log('Returning adapted response, status:', response.status, 'url:', response.url)
    return response
  } catch (error) {
    console.error('NextAuth GET error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
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
    if (!process.env.NEXTAUTH_SECRET || !process.env.DATABASE_URL) {
      return errorResponse('Required environment variables are not set')
    }

    if (!handler) {
      handler = await getHandler()
    }
    
    const { req: adaptedReq, res, isCredentialsCallback } = await adaptRequestForNextAuth(req, context.params)
    
    const resolvedParams = await Promise.resolve(context.params)
    console.log('NextAuth POST request:', resolvedParams?.nextauth)
    
    // Читаем body
    let body: string
    try {
      body = await req.text()
      const contentType = req.headers.get('content-type') || ''
      
      if (contentType.includes('application/json')) {
        try {
          adaptedReq.body = body ? JSON.parse(body) : {}
        } catch (e) {
          adaptedReq.body = {}
        }
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const params = new URLSearchParams(body)
        adaptedReq.body = Object.fromEntries(params.entries())
      } else {
        adaptedReq.body = body
      }
      
      adaptedReq.rawBody = body
    } catch (bodyError) {
      adaptedReq.body = {}
      adaptedReq.rawBody = ''
    }
    
    // Обновляем флаг isCredentialsCallback в res объекте
    if (isCredentialsCallback) {
      (res as any)._isCredentialsCallback = true
    }
    
    const result = await handler(adaptedReq, res)
    
    if (result instanceof Response) {
      // Если это credentials callback, проверяем, не является ли это redirect
      if (isCredentialsCallback) {
        const location = result.headers.get('location')
        
        // Если это redirect на signin/error - это ошибка
        if (location && (location.includes('/api/auth/signin') || location.includes('/api/auth/error'))) {
          const url = new URL(location, adaptedReq.url)
          const errorParam = url.searchParams.get('error')
          const errorMessage = url.searchParams.get('error_description') || 
                               (errorParam === 'CredentialsSignin' ? 'Invalid email or password' : 
                                errorParam === 'EmailNotVerified' ? 'Email not verified. Please check your email and verify your account.' :
                                'Authentication failed')
          
          return new Response(
            JSON.stringify({ 
              error: errorParam || 'CredentialsSignin', 
              ok: false,
              message: errorMessage
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }
        
        // Для успешного входа - НЕ перехватываем redirect!
        // Позволяем NextAuth установить session cookie через реальный redirect
        // ВАЖНО: возвращаем result как есть, чтобы cookie был установлен
      }
      return result
    }
    
    const response = (res as any).__getResponse()
    if (!response) {
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

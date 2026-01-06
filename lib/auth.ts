import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { sendVerificationEmail } from './email'

// Ленивая инициализация authOptions - создается только при первом вызове
let _authOptions: NextAuthOptions | null = null

async function createAuthOptions(): Promise<NextAuthOptions> {
  // Проверяем обязательные переменные окружения
  if (!process.env.NEXTAUTH_SECRET) {
    console.error('NEXTAUTH_SECRET is not set')
    throw new Error('NEXTAUTH_SECRET is required')
  }

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set')
    throw new Error('DATABASE_URL is required')
  }

  const { prisma } = await import('./prisma')
  
  return {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      }),
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          // Если пользователя нет - создаем его
          if (!user) {
            // Хешируем пароль
            const hashedPassword = await bcrypt.hash(credentials.password, 10)
            
            // Генерируем токен для подтверждения email
            const token = crypto.randomBytes(32).toString('hex')
            const expires = new Date()
            expires.setHours(expires.getHours() + 24) // Токен действителен 24 часа

            // Создаем пользователя
            const newUser = await prisma.user.create({
              data: {
                email: credentials.email,
                password: hashedPassword,
                emailVerified: null, // Email не подтвержден
              },
            })

            // Создаем токен подтверждения
            await prisma.verificationToken.create({
              data: {
                identifier: credentials.email,
                token,
                expires,
              },
            })

            // Отправляем email для подтверждения
            try {
              await sendVerificationEmail(credentials.email, token, 'et')
            } catch (emailError) {
              console.error('Error sending verification email:', emailError)
              // Не прерываем процесс, но логируем ошибку
            }

            // Выбрасываем ошибку о необходимости подтверждения email
            throw new Error('EmailNotVerified: Please check your email and verify your account before signing in.')
          }

          // Если пользователь есть, но пароля нет (OAuth пользователь)
          if (!user.password) {
            return null
          }

          // Проверяем пароль
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          // Проверяем, подтвержден ли email
          if (!user.emailVerified) {
            // Если пользователь был создан более 7 дней назад, автоматически подтверждаем email
            // (это для существующих пользователей, которые были зарегистрированы до внедрения email verification)
            const daysSinceCreation = Math.floor(
              (new Date().getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
            )
            
            if (daysSinceCreation > 7) {
              // Автоматически подтверждаем email для старых пользователей
              await prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() },
              })
              
              // Продолжаем вход
            } else {
              // Для новых пользователей требуем подтверждение email
              // Проверяем, есть ли активный токен
              const existingToken = await prisma.verificationToken.findFirst({
                where: {
                  identifier: credentials.email,
                  expires: {
                    gt: new Date(),
                  },
                },
              })

              // Если токена нет или он истек, создаем новый
              if (!existingToken) {
                const token = crypto.randomBytes(32).toString('hex')
                const expires = new Date()
                expires.setHours(expires.getHours() + 24)

                // Удаляем старые токены
                await prisma.verificationToken.deleteMany({
                  where: { identifier: credentials.email },
                })

                // Создаем новый токен
                await prisma.verificationToken.create({
                  data: {
                    identifier: credentials.email,
                    token,
                    expires,
                  },
                })

                // Отправляем email для подтверждения
                try {
                  await sendVerificationEmail(credentials.email, token, 'et')
                } catch (emailError) {
                  console.error('Error sending verification email:', emailError)
                }
              }

              // Выбрасываем ошибку о необходимости подтверждения email
              throw new Error('EmailNotVerified: Please check your email and verify your account before signing in.')
            }
          }

          // Все проверки пройдены - разрешаем вход
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          }
        },
      }),
    ],
    callbacks: {
      async signIn({ user, account, profile }) {
        if (account?.provider === 'google') {
          try {
            const { prisma } = await import('./prisma')
            const existingUser = await prisma.user.findUnique({
              where: { email: user.email! },
            })

            if (!existingUser) {
              await prisma.user.create({
                data: {
                  email: user.email!,
                  name: user.name,
                  image: user.image,
                  emailVerified: new Date(),
                },
              })
            } else if (!existingUser.image && user.image) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { image: user.image },
              })
            }
          } catch (error) {
            console.error('Error in signIn callback:', error)
            return false
          }
        }
        // Для credentials provider, если user не передан (ошибка в authorize),
        // signIn callback не вызывается, ошибка обрабатывается напрямую
        return true
      },
      async session({ session, token }) {
        if (session.user && token) {
          session.user.id = token.id as string
          session.user.role = token.role as string
        }
        return session
      },
      async jwt({ token, user, account }) {
        if (user) {
          token.id = user.id
          token.role = user.role
        } else if (token.email) {
          const { prisma } = await import('./prisma')
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
          })
          if (dbUser) {
            token.id = dbUser.id
            token.role = dbUser.role
          }
        }
        return token
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
    session: {
      strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
}

// Экспортируем функцию для получения authOptions
export async function getAuthOptions(): Promise<NextAuthOptions> {
  if (!_authOptions) {
    _authOptions = await createAuthOptions()
  }
  return _authOptions
}

// Экспортируем синхронный authOptions для обратной совместимости
// Инициализируется лениво через Proxy
export const authOptions: NextAuthOptions = (() => {
  let _cached: NextAuthOptions | null = null
  const initPromise = getAuthOptions().then(opts => {
    _cached = opts
  })
  
  return new Proxy({} as NextAuthOptions, {
    get(target, prop) {
      if (!_cached) {
        // Синхронный доступ - выбрасываем ошибку
        throw new Error('authOptions accessed synchronously. Use getAuthOptions() instead.')
      }
      return (_cached as any)[prop]
    }
  }) as NextAuthOptions
})()

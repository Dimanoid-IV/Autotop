import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'

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

          if (!user || !user.password) {
            return null
          }

          // Check if email is verified
          if (!user.emailVerified) {
            throw new Error('Email not verified. Please check your email and verify your account.')
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

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

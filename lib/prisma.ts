import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaError: Error | undefined
}

let _prismaClient: PrismaClient | null = null
let _prismaError: Error | null = null

// Ленивая инициализация Prisma - создается только при первом использовании
function getPrismaClient(): PrismaClient | null {
  // Если уже есть ошибка, не пытаемся снова
  if (_prismaError || globalForPrisma.prismaError) {
    return null
  }

  // Если уже инициализирован, возвращаем
  if (_prismaClient || globalForPrisma.prisma) {
    return _prismaClient || globalForPrisma.prisma || null
  }

  try {
    // Проверяем наличие DATABASE_URL перед созданием клиента
    if (!process.env.DATABASE_URL) {
      const error = new Error('DATABASE_URL is not set')
      _prismaError = error
      globalForPrisma.prismaError = error
      console.error('DATABASE_URL is not set')
      return null
    }

    const prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })

    _prismaClient = prisma
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prisma
    }

    return prisma
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    _prismaError = err
    globalForPrisma.prismaError = err
    console.error('Failed to initialize Prisma Client:', error)
    return null
  }
}

// Экспортируем функцию для проверки доступности
export function isPrismaAvailable(): boolean {
  return getPrismaClient() !== null
}

// Экспортируем Prisma Client с безопасным доступом
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    const client = getPrismaClient()
    if (!client) {
      // Возвращаем функцию, которая выбрасывает ошибку, но она будет перехвачена в API
      return () => {
        throw new Error('Prisma Client is not available. Check DATABASE_URL environment variable.')
      }
    }
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
})



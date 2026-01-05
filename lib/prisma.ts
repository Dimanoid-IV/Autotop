import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ленивая инициализация Prisma - создается только при первом использовании
function getPrismaClient(): PrismaClient | null {
  try {
    if (globalForPrisma.prisma) {
      return globalForPrisma.prisma
    }

    // Проверяем наличие DATABASE_URL перед созданием клиента
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set')
      return null
    }

    const prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prisma
    }

    return prisma
  } catch (error) {
    console.error('Failed to initialize Prisma Client:', error)
    return null
  }
}

// Экспортируем функцию вместо прямого клиента
// Возвращает null если Prisma недоступен, что позволяет API возвращать пустые массивы
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    const client = getPrismaClient()
    if (!client) {
      // Возвращаем функцию, которая выбрасывает ошибку, но она будет перехвачена в API
      return () => {
        throw new Error('Prisma Client is not available')
      }
    }
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
})



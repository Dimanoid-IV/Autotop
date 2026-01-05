import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ленивая инициализация Prisma - создается только при первом использовании
function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  // Проверяем наличие DATABASE_URL перед созданием клиента
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }

  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
  }

  return prisma
}

// Экспортируем функцию вместо прямого клиента
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    const client = getPrismaClient()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
})



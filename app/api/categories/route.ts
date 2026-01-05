import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const { prisma, isPrismaAvailable } = await import('@/lib/prisma')
    
    // Проверяем доступность Prisma перед использованием
    if (!isPrismaAvailable()) {
      console.error('Prisma Client is not available - DATABASE_URL may not be set or database is unreachable')
      return NextResponse.json([], { status: 200 })
    }

    const categories = await prisma.category.findMany({
      orderBy: { nameEt: 'asc' },
    })

    return NextResponse.json(categories || [], { status: 200 })
  } catch (error) {
    console.error('Error fetching categories:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      if (error.stack) {
        console.error('Error stack:', error.stack)
      }
    }
    // Всегда возвращаем пустой массив вместо ошибки
    return NextResponse.json([], { status: 200 })
  }
}



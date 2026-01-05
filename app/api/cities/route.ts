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

    const cities = await prisma.city.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(cities || [], { status: 200 })
  } catch (error) {
    console.error('Error fetching cities:', error)
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



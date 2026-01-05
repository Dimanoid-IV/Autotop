import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set')
      return NextResponse.json([], { status: 200 })
    }

    const { prisma } = await import('@/lib/prisma')
    
    // Дополнительная проверка на доступность Prisma
    if (!prisma) {
      console.error('Prisma Client is not available')
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
      console.error('Error stack:', error.stack)
    }
    // Всегда возвращаем пустой массив вместо ошибки
    return NextResponse.json([], { status: 200 })
  }
}



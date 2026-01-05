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

    const categories = await prisma.category.findMany({
      orderBy: { nameEt: 'asc' },
    })

    return NextResponse.json(categories || [], { status: 200 })
  } catch (error) {
    console.error('Error fetching categories:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    // Всегда возвращаем пустой массив вместо ошибки
    return NextResponse.json([], { status: 200 })
  }
}



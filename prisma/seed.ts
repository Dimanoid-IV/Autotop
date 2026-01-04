import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create cities
  const tallinn = await prisma.city.upsert({
    where: { slug: 'tallinn' },
    update: {},
    create: {
      name: 'Tallinn',
      nameEt: 'Tallinn',
      nameRu: 'Таллинн',
      slug: 'tallinn',
    },
  })

  const tartu = await prisma.city.upsert({
    where: { slug: 'tartu' },
    update: {},
    create: {
      name: 'Tartu',
      nameEt: 'Tartu',
      nameRu: 'Тарту',
      slug: 'tartu',
    },
  })

  const narva = await prisma.city.upsert({
    where: { slug: 'narva' },
    update: {},
    create: {
      name: 'Narva',
      nameEt: 'Narva',
      nameRu: 'Нарва',
      slug: 'narva',
    },
  })

  const parnu = await prisma.city.upsert({
    where: { slug: 'parnu' },
    update: {},
    create: {
      name: 'Pärnu',
      nameEt: 'Pärnu',
      nameRu: 'Пярну',
      slug: 'parnu',
    },
  })

  // Create categories
  const autoService = await prisma.category.upsert({
    where: { slug: 'auto-service' },
    update: {},
    create: {
      nameEt: 'Autoteenus',
      nameRu: 'Автосервис',
      slug: 'auto-service',
      type: 'AUTO_SERVICE',
    },
  })

  const autoRepair = await prisma.category.upsert({
    where: { slug: 'auto-repair' },
    update: {},
    create: {
      nameEt: 'Autoremont',
      nameRu: 'Авторемонт',
      slug: 'auto-repair',
      type: 'AUTO_REPAIR',
    },
  })

  const carWash = await prisma.category.upsert({
    where: { slug: 'car-wash' },
    update: {},
    create: {
      nameEt: 'Autopesu',
      nameRu: 'Автомойка',
      slug: 'car-wash',
      type: 'CAR_WASH',
    },
  })

  const detailing = await prisma.category.upsert({
    where: { slug: 'detailing' },
    update: {},
    create: {
      nameEt: 'Detailimine',
      nameRu: 'Детейлинг',
      slug: 'detailing',
      type: 'DETAILING',
    },
  })

  const serviceStation = await prisma.category.upsert({
    where: { slug: 'service-station' },
    update: {},
    create: {
      nameEt: 'Teenindusjaam',
      nameRu: 'Сервисная станция',
      slug: 'service-station',
      type: 'SERVICE_STATION',
    },
  })

  // Create admin user (password: admin123)
  const bcrypt = require('bcryptjs')
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@autotop.ee' },
    update: {},
    create: {
      email: 'admin@autotop.ee',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  console.log('Seed data created:', {
    cities: [tallinn, tartu, narva, parnu],
    categories: [autoService, autoRepair, carWash, detailing, serviceStation],
    admin: admin.email,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


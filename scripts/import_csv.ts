import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface CSVRow {
  name: string
  address: string
  phone?: string
  website?: string
  coordinates?: string
}

async function parseCSV(filePath: string): Promise<CSVRow[]> {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const rows: CSVRow[] = []

  for (const line of lines) {
    // Skip HTML lines, empty lines, and header
    if (line.trim().startsWith('<') || !line.trim() || 
        line.includes('google-symbols') || 
        line.startsWith('Название') || 
        line.startsWith('Name')) {
      continue
    }

    // Parse CSV line: Name,Address,Phone,Website,Coordinates
    // Handle quoted fields
    const parts: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        parts.push(current.trim().replace(/^\? /, ''))
        current = ''
      } else {
        current += char
      }
    }
    parts.push(current.trim().replace(/^\? /, ''))

    if (parts.length >= 2 && parts[0] && parts[1]) {
      const name = parts[0].replace(/^["']|["']$/g, '')
      const address = parts[1].replace(/^["']|["']$/g, '')
      const phone = parts[2]?.replace(/^["']|["']$/g, '').trim() || undefined
      const website = parts[3]?.replace(/^["']|["']$/g, '').trim() || undefined
      const coordinates = parts[4]?.replace(/^["']|["']$/g, '').trim() || undefined

      if (name && address && name.length > 2) {
        rows.push({ name, address, phone, website, coordinates })
      }
    }
  }

  return rows
}

async function importData() {
  try {
    console.log('Starting CSV import...')
    
    // Get cities and categories
    const cities = await prisma.city.findMany()
    const categories = await prisma.category.findMany()

    if (cities.length === 0 || categories.length === 0) {
      console.error('Please run db:seed first to create cities and categories!')
      process.exit(1)
    }

    // Find Tallinn city (default)
    const tallinn = cities.find(c => c.slug === 'tallinn') || cities[0]
    const defaultCategory = categories.find(c => c.slug === 'auto-service') || categories[0]

    // Parse CSV
    const csvPath = path.join(process.cwd(), '..', 'parser_servisi', 'estonia_businesses_for_google_sheets.csv')
    
    if (!fs.existsSync(csvPath)) {
      console.error(`CSV file not found: ${csvPath}`)
      process.exit(1)
    }

    const rows = await parseCSV(csvPath)
    
    console.log(`Found ${rows.length} businesses to import`)

    let imported = 0
    let skipped = 0

    for (const row of rows) {
      try {
        // Parse coordinates if available
        let latitude: number | null = null
        let longitude: number | null = null
        
        if (row.coordinates) {
          const coords = row.coordinates.split(',')
          if (coords.length === 2) {
            const lat = parseFloat(coords[0].trim())
            const lng = parseFloat(coords[1].trim())
            if (!isNaN(lat) && !isNaN(lng)) {
              latitude = lat
              longitude = lng
            }
          }
        }

        // Extract city from address or use Tallinn as default
        let city = tallinn
        for (const c of cities) {
          if (row.address.toLowerCase().includes(c.name.toLowerCase()) || 
              row.address.toLowerCase().includes(c.nameEt.toLowerCase())) {
            city = c
            break
          }
        }

        // Try to determine category from name/website
        let category = defaultCategory
        const nameLower = row.name.toLowerCase()
        if (nameLower.includes('remont') || nameLower.includes('repair')) {
          const repairCat = categories.find(c => c.slug === 'auto-repair')
          if (repairCat) category = repairCat
        } else if (nameLower.includes('pesu') || nameLower.includes('wash')) {
          const washCat = categories.find(c => c.slug === 'car-wash')
          if (washCat) category = washCat
        } else if (nameLower.includes('detail')) {
          const detailCat = categories.find(c => c.slug === 'detailing')
          if (detailCat) category = detailCat
        }

        // Check if business already exists
        const existing = await prisma.business.findFirst({
          where: {
            name: row.name,
            address: row.address,
          },
        })

        if (existing) {
          skipped++
          continue
        }

        // Create business
        await prisma.business.create({
          data: {
            name: row.name,
            address: row.address,
            phone: row.phone || null,
            website: row.website || null,
            latitude,
            longitude,
            cityId: city.id,
            categoryId: category.id,
          },
        })

        imported++
        
        if (imported % 10 === 0) {
          console.log(`Imported ${imported} businesses...`)
        }
      } catch (error: any) {
        console.error(`Error importing ${row.name}:`, error.message)
        skipped++
      }
    }

    console.log(`\nImport completed!`)
    console.log(`Imported: ${imported}`)
    console.log(`Skipped: ${skipped}`)
  } catch (error) {
    console.error('Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

importData()

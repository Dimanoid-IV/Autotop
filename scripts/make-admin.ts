import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables from .env file
try {
  const envPath = join(process.cwd(), '.env')
  const envFile = readFileSync(envPath, 'utf-8')
  envFile.split('\n').forEach(line => {
    // Skip comments and empty lines
    line = line.trim()
    if (!line || line.startsWith('#')) return
    
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      let value = match[2].trim()
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  })
  console.log('✅ Loaded .env file')
} catch (error) {
  console.error('Warning: Could not load .env file:', error)
}

const prisma = new PrismaClient()

async function makeAdmin() {
  try {
    const email = 'dmitri.ivkin@gmail.com'
    
    console.log(`Looking for user: ${email}`)
    
    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.log('User not found, creating new user...')
      user = await prisma.user.create({
        data: {
          email,
          name: 'Dmitri Ivkin',
          role: 'ADMIN',
          emailVerified: new Date(),
        },
      })
      console.log('✅ New admin user created!')
    } else {
      console.log('User found, updating to ADMIN...')
      user = await prisma.user.update({
        where: { email },
        data: {
          role: 'ADMIN',
          emailVerified: new Date(),
        },
      })
      console.log('✅ User updated to ADMIN!')
    }

    console.log('\n📋 User details:')
    console.log(`ID: ${user.id}`)
    console.log(`Email: ${user.email}`)
    console.log(`Name: ${user.name}`)
    console.log(`Role: ${user.role}`)
    console.log(`Email Verified: ${user.emailVerified}`)
    
    console.log('\n🎉 Done! You can now login with this email.')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

makeAdmin()


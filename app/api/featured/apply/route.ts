import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      businessName,
      contactName,
      email,
      phone,
      message,
      planId,
      planName,
      planPrice
    } = body

    // Validate required fields
    if (!businessName || !contactName || !email || !phone || !planId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email to site owner
    const emailContent = `
      <h2>🎯 Новая заявка на топ размещение!</h2>
      
      <h3>Тариф:</h3>
      <p><strong>${planName}</strong> (€${planPrice})</p>
      
      <h3>Контактные данные:</h3>
      <ul>
        <li><strong>Автосервис:</strong> ${businessName}</li>
        <li><strong>Контактное лицо:</strong> ${contactName}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Телефон:</strong> ${phone}</li>
      </ul>
      
      ${message ? `<h3>Дополнительная информация:</h3><p>${message}</p>` : ''}
      
      <hr>
      <p><small>Заявка отправлена через форму на странице /advertise</small></p>
    `

    // Send email to site owner
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'dmitri.ivkin@gmail.com',
      subject: `Заявка на размещение: ${businessName} (${planName})`,
      html: emailContent
    })

    // Send confirmation email to applicant
    const confirmationEmail = `
      <h2>Спасибо за заявку!</h2>
      
      <p>Здравствуйте, ${contactName}!</p>
      
      <p>Мы получили вашу заявку на размещение автосервиса <strong>${businessName}</strong> в топе.</p>
      
      <h3>Выбранный тариф:</h3>
      <p><strong>${planName}</strong> - €${planPrice}</p>
      
      <p>Мы свяжемся с вами в ближайшее время и отправим ссылку на оплату.</p>
      
      <p>С уважением,<br>Команда AutoTop</p>
    `

    await sendEmail({
      to: email,
      subject: 'AutoTop - Заявка на размещение получена',
      html: confirmationEmail
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error processing application:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

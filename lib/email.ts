import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

// Generic email sending function
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export async function sendReviewModerationEmail(
  reviewId: string,
  businessName: string,
  userName: string,
  rating: number,
  comment: string | null,
  locale: string = 'et'
) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const approveUrl = `${baseUrl}/api/reviews/${reviewId}/approve`
  const rejectUrl = `${baseUrl}/api/reviews/${reviewId}/reject`

  const subject = locale === 'ru' 
    ? `Новый отзыв требует модерации: ${businessName}`
    : `Uus arvustus vajab modereerimist: ${businessName}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e3a8a; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .review-box { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #f97316; }
        .rating { color: #f97316; font-size: 18px; font-weight: bold; }
        .actions { margin-top: 20px; }
        .button { display: inline-block; padding: 12px 24px; margin: 5px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .approve { background: #10b981; color: white; }
        .reject { background: #ef4444; color: white; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${locale === 'ru' ? 'Новый отзыв требует модерации' : 'Uus arvustus vajab modereerimist'}</h2>
        </div>
        <div class="content">
          <p><strong>${locale === 'ru' ? 'Бизнес:' : 'Ettevõte:'}</strong> ${businessName}</p>
          <p><strong>${locale === 'ru' ? 'Пользователь:' : 'Kasutaja:'}</strong> ${userName}</p>
          
          <div class="review-box">
            <div class="rating">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)</div>
            ${comment ? `<p><strong>${locale === 'ru' ? 'Комментарий:' : 'Kommentaar:'}</strong></p><p>${comment}</p>` : ''}
          </div>

          <div class="actions">
            <a href="${approveUrl}" class="button approve">
              ${locale === 'ru' ? 'Одобрить отзыв' : 'Kinnita arvustus'}
            </a>
            <a href="${rejectUrl}" class="button reject">
              ${locale === 'ru' ? 'Отклонить отзыв' : 'Lükka tagasi'}
            </a>
          </div>

          <div class="footer">
            <p>${locale === 'ru' 
              ? 'Это автоматическое письмо. Пожалуйста, не отвечайте на него.' 
              : 'See on automaatne e-kiri. Palun ärge sellele vastake.'}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL,
      subject,
      html,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export async function sendReplyModerationEmail(
  replyId: string,
  businessName: string,
  userName: string,
  comment: string,
  locale: string = 'et'
) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const approveUrl = `${baseUrl}/api/replies/${replyId}/approve`
  const rejectUrl = `${baseUrl}/api/replies/${replyId}/reject`

  const subject = locale === 'ru'
    ? `Новый ответ владельца требует модерации: ${businessName}`
    : `Uus omaniku vastus vajab modereerimist: ${businessName}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e3a8a; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .reply-box { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #1e3a8a; }
        .actions { margin-top: 20px; }
        .button { display: inline-block; padding: 12px 24px; margin: 5px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .approve { background: #10b981; color: white; }
        .reject { background: #ef4444; color: white; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${locale === 'ru' ? 'Новый ответ владельца требует модерации' : 'Uus omaniku vastus vajab modereerimist'}</h2>
        </div>
        <div class="content">
          <p><strong>${locale === 'ru' ? 'Бизнес:' : 'Ettevõte:'}</strong> ${businessName}</p>
          <p><strong>${locale === 'ru' ? 'Пользователь:' : 'Kasutaja:'}</strong> ${userName}</p>
          
          <div class="reply-box">
            <p><strong>${locale === 'ru' ? 'Ответ:' : 'Vastus:'}</strong></p>
            <p>${comment}</p>
          </div>

          <div class="actions">
            <a href="${approveUrl}" class="button approve">
              ${locale === 'ru' ? 'Одобрить ответ' : 'Kinnita vastus'}
            </a>
            <a href="${rejectUrl}" class="button reject">
              ${locale === 'ru' ? 'Отклонить ответ' : 'Lükka tagasi'}
            </a>
          </div>

          <div class="footer">
            <p>${locale === 'ru' 
              ? 'Это автоматическое письмо. Пожалуйста, не отвечайте на него.' 
              : 'See on automaatne e-kiri. Palun ärge sellele vastake.'}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL,
      subject,
      html,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export async function sendVerificationEmail(
  email: string,
  token: string,
  locale: string = 'et'
) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`

  const subject = locale === 'ru'
    ? 'Подтвердите ваш email адрес'
    : 'Kinnitage oma e-posti aadress'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e3a8a; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .button { display: inline-block; padding: 12px 24px; margin: 20px 0; text-decoration: none; border-radius: 6px; font-weight: bold; background: #1e3a8a; color: white; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${locale === 'ru' ? 'Подтверждение email адреса' : 'E-posti aadressi kinnitamine'}</h2>
        </div>
        <div class="content">
          <p>${locale === 'ru' 
            ? 'Спасибо за регистрацию! Пожалуйста, подтвердите ваш email адрес, нажав на кнопку ниже:' 
            : 'Täname registreerumise eest! Palun kinnitage oma e-posti aadress, klõpsates alloleval nupul:'}</p>
          
          <div style="text-align: center;">
            <a href="${verifyUrl}" class="button">
              ${locale === 'ru' ? 'Подтвердить email' : 'Kinnita e-posti aadress'}
            </a>
          </div>

          <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
            ${locale === 'ru' 
              ? 'Или скопируйте и вставьте эту ссылку в браузер:' 
              : 'Või kopeerige ja kleepige see link brauserisse:'}
          </p>
          <p style="word-break: break-all; font-size: 12px; color: #6b7280;">${verifyUrl}</p>

          <div class="footer">
            <p>${locale === 'ru' 
              ? 'Это автоматическое письмо. Пожалуйста, не отвечайте на него.' 
              : 'See on automaatne e-kiri. Palun ärge sellele vastake.'}</p>
            <p>${locale === 'ru' 
              ? 'Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.' 
              : 'Kui te ei registreerinud meie veebisaidil, ignoreerige seda e-kirja.'}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject,
      html,
    })
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw error
  }
}



import { Resend } from 'resend';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, name, email, message, businessName, city, address, phone, website } = req.body;
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    let subject = '';
    let html = '';

    if (type === 'contact') {
      subject = `[Contact Us] Message from ${name}`;
      html = `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `;
    } else if (type === 'addService') {
      subject = `[Add Service] New Request: ${businessName}`;
      html = `
        <h2>New Service Addition Request</h2>
        <p><strong>Business Name:</strong> ${businessName}</p>
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Website:</strong> ${website}</p>
        <p><strong>Contact Person:</strong> ${name}</p>
        <p><strong>Contact Email:</strong> ${email}</p>
      `;
    }

    const { data, error } = await resend.emails.send({
      from: 'Autotop <onboarding@resend.dev>',
      to: ['autotop.ee@gmail.com'],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Resend Error:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Success' });
  } catch (err: any) {
    console.error('Server Error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}

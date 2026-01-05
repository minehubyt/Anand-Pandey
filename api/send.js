
import { Resend } from 'resend';

// Initialize Resend with the provided API Key
const resend = new Resend('re_Z8WRHBCj_3fapsCSGcSX6j2G6b6uzzG5m');

export default async function handler(req, res) {
  // CORS Headers - Vital for allowing the frontend to communicate with this function
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request immediately
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Enforce POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, html } = req.body;
    
    // Attempt to send email
    // Note: On free Resend plans, you can only send to the email address registered to your account.
    // Sending to other addresses will result in a 400/403 error.
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: to,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Resend API Error:', error);
      // Return 400 but valid JSON so frontend can handle it
      return res.status(400).json({ error });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

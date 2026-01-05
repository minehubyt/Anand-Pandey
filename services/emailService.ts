
/**
 * AK PANDEY & ASSOCIATES | STRATEGIC EMAIL PROTOCOL
 * 
 * Uses internal Serverless Function (/api/send) to securely transmit emails via Resend.
 * This prevents CORS errors and protects the API key.
 */

const ADMIN_EMAIL = 'admin@anandpandey.in';

export const emailService = {
  /**
   * Sends an email by calling the Vercel Serverless Function.
   * On Localhost, it simulates the send to prevent 404 errors.
   */
  send: async (to: string, subject: string, body: string) => {
    // Detection for local development environment
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isLocal) {
      console.groupCollapsed(`%c[DEV MODE] Email Simulation: ${subject}`, 'color: #CC1414; font-weight: bold;');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Body:', body);
      console.groupEnd();
      
      // Simulate network delay for realistic UI feedback
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    }

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          html: body.replace(/\n/g, '<br>')
        })
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        console.error('Email Transmission Error:', errorData);
        // Even if email fails in production, we might want to return true to not block the UI, 
        // depending on strictness. For now, returning false to alert user.
        return false;
      }
    } catch (error) {
      console.error("Critical Email Protocol Error:", error);
      return false;
    }
  },

  /**
   * Send confirmation for Consultation/Booking
   */
  sendBookingConfirmation: async (data: any) => {
    const { name, email, date, time, branch, uniqueId } = data;
    const formattedDate = new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // 1. Send to Client
    await emailService.send(
      email,
      `Mandate Authorized: Consultation ${uniqueId}`,
      `<strong>Dear ${name},</strong><br><br>Your appointment at our ${branch} chamber is confirmed for ${formattedDate} at ${time.hour}:${time.minute} ${time.period}.<br><br>Reference: <strong>${uniqueId}</strong><br><br>Warm regards,<br>AK Pandey & Associates`
    );

    // 2. Send to Admin
    await emailService.send(
      ADMIN_EMAIL,
      `URGENT: New Appointment - ${uniqueId}`,
      `New appointment request from <strong>${name}</strong>.<br>Date: ${formattedDate}<br>Branch: ${branch}<br>Contact: ${email}`
    );
  },

  /**
   * Send confirmation for RFP submission
   */
  sendRFPConfirmation: async (data: any) => {
    const { firstName, lastName, email, organization, category } = data;
    const fullName = `${firstName} ${lastName}`;

    // 1. Send to Client
    await emailService.send(
      email,
      `RFP Received: Strategic Partnership Mandate`,
      `<strong>Dear ${fullName},</strong><br><br>We have received your RFP for ${organization} regarding ${category}. A Senior Partner will review this dossier shortly.<br><br>Warm regards,<br>AK Pandey & Associates`
    );

    // 2. Send to Admin
    await emailService.send(
      ADMIN_EMAIL,
      `NEW RFP: ${organization}`,
      `RFP Category: ${category}<br>Contact: ${fullName} (${email})`
    );
  },

  /**
   * Send confirmation for Job Application
   */
  sendApplicationConfirmation: async (data: any) => {
    const { name, email, jobTitle } = data;

    // 1. Send to Candidate
    await emailService.send(
      email,
      `Dossier Authorized: ${jobTitle}`,
      `<strong>Dear ${name},</strong><br><br>Your application for ${jobTitle} has been securely filed in our candidate system. The Recruitment Board will review your credentials.<br><br>Warm regards,<br>AK Pandey & Associates`
    );

    // 2. Send to Admin
    await emailService.send(
      ADMIN_EMAIL,
      `NEW APPLICATION: ${jobTitle}`,
      `Applicant: ${name}<br>Email: ${email}`
    );
  }
};

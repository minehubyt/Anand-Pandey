
/**
 * AK PANDEY & ASSOCIATES | STRATEGIC EMAIL PROTOCOL
 * Integrated with Resend API
 */

const RESEND_API_KEY = 're_LYJ4d2Zs_EYmjVUpsTkJJtodjuNv4Sza3';
const DEFAULT_SENDER = 'AK Pandey & Associates <noreply@thetaxjournal.in>';
const ADMIN_EMAIL = 'admin@anandpandey.in';

export const emailService = {
  /**
   * Generic sender using fetch to avoid Node-specific SDK issues in the browser
   */
  send: async (to: string, subject: string, html: string) => {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: DEFAULT_SENDER,
          to,
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Email Protocol Error:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Email Network Error:', err);
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

    // Client Email
    await emailService.send(
      email,
      `Mandate Authorized: Consultation ${uniqueId}`,
      `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #eee;">
        <h2 style="color: #CC1414; text-transform: uppercase; letter-spacing: 2px;">Authorization Confirmed</h2>
        <p>Dear ${name},</p>
        <p>Your strategic consultation with <strong>AK Pandey & Associates</strong> has been successfully authorized and logged into the Chamber Matrix.</p>
        <div style="background: #f9f9f9; padding: 20px; margin: 20px 0;">
          <p><strong>Mandate ID:</strong> ${uniqueId}</p>
          <p><strong>Scheduled Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${time.hour}:${time.minute} ${time.period} IST</p>
          <p><strong>Location:</strong> ${branch}</p>
        </div>
        <p>A Strategic Liaison will contact you shortly to confirm the session credentials.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />
        <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Confidential Communication | AK Pandey & Associates</p>
      </div>
      `
    );

    // Admin Notification
    await emailService.send(
      ADMIN_EMAIL,
      `URGENT: New Appointment - ${uniqueId}`,
      `<p>New appointment request from <strong>${name}</strong> (${email}). Schedule: ${formattedDate} at ${time.hour}:${time.minute} ${time.period} at ${branch}.</p>`
    );
  },

  /**
   * Send confirmation for RFP submission
   */
  sendRFPConfirmation: async (data: any) => {
    const { firstName, lastName, email, organization, category } = data;
    const fullName = `${firstName} ${lastName}`;

    await emailService.send(
      email,
      `RFP Received: Strategic Partnership Mandate`,
      `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #eee;">
        <h2 style="color: #CC1414; text-transform: uppercase; letter-spacing: 2px;">RFP Initiated</h2>
        <p>Dear ${fullName},</p>
        <p>Thank you for submitting the Request for Proposal on behalf of <strong>${organization}</strong>.</p>
        <p>Our Senior Partners are currently reviewing the parameters of the <strong>${category}</strong> mandate. We operate with absolute discretion and will provide a strategic response within the next business cycle.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />
        <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Strategic Liaison Desk | AK Pandey & Associates</p>
      </div>
      `
    );

    // Admin Notification
    await emailService.send(
      ADMIN_EMAIL,
      `NEW RFP: ${organization}`,
      `<p>A new RFP has been submitted by <strong>${fullName}</strong> from <strong>${organization}</strong> for <strong>${category}</strong>.</p>`
    );
  },

  /**
   * Send confirmation for Job Application
   */
  sendApplicationConfirmation: async (data: any) => {
    const { name, email, jobTitle } = data;

    await emailService.send(
      email,
      `Dossier Authorized: ${jobTitle}`,
      `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #eee;">
        <h2 style="color: #CC1414; text-transform: uppercase; letter-spacing: 2px;">Application Received</h2>
        <p>Dear ${name},</p>
        <p>Your professional dossier for the <strong>${jobTitle}</strong> mandate has been successfully authorized and entered into our talent pool.</p>
        <p>Our recruitment board reviews candidates based on strategic fit and academic pedigree. Should there be a match with our current requirements, a partner will reach out for a preliminary briefing.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />
        <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Talent Hub | AK Pandey & Associates</p>
      </div>
      `
    );

    // Admin Notification
    await emailService.send(
      ADMIN_EMAIL,
      `NEW APPLICATION: ${jobTitle}`,
      `<p>New job application from <strong>${name}</strong> (${email}) for the position: <strong>${jobTitle}</strong>.</p>`
    );
  }
};

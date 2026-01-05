
/**
 * AK PANDEY & ASSOCIATES | STRATEGIC EMAIL PROTOCOL
 * Simulated Environment for UI Replica
 */

const ADMIN_EMAIL = 'admin@anandpandey.in';

export const emailService = {
  /**
   * Simulates sending an email to avoid CORS issues in a client-side only environment.
   * In a production app, this would call a backend endpoint (e.g., Firebase Functions).
   */
  send: async (to: string, subject: string, html: string) => {
    console.log(`[EMAIL SIMULATION] 
      To: ${to}
      Subject: ${subject}
      Content: (HTML Content Omitted for logs)
    `);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return true; 
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

    // Simulate sending to Client
    await emailService.send(
      email,
      `Mandate Authorized: Consultation ${uniqueId}`,
      `Confirmation for ${name} at ${branch} on ${formattedDate}`
    );

    // Simulate sending to Admin
    await emailService.send(
      ADMIN_EMAIL,
      `URGENT: New Appointment - ${uniqueId}`,
      `New appointment request from ${name}`
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
      `RFP Received for ${organization} regarding ${category}`
    );

    await emailService.send(
      ADMIN_EMAIL,
      `NEW RFP: ${organization}`,
      `RFP from ${fullName}`
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
      `Application received for ${jobTitle}`
    );

    await emailService.send(
      ADMIN_EMAIL,
      `NEW APPLICATION: ${jobTitle}`,
      `Applicant: ${name}`
    );
  }
};

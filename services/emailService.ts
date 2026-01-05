
/**
 * AK PANDEY & ASSOCIATES | STRATEGIC EMAIL PROTOCOL
 * Simulated Environment for UI Replica
 */

const ADMIN_EMAIL = 'admin@anandpandey.in';

export const emailService = {
  /**
   * Simulates sending an email to avoid CORS issues in a client-side only environment.
   * This ensures the UI flow completes successfully without crashing.
   */
  send: async (to: string, subject: string, body: string) => {
    console.group('📧 EMAIL SIMULATION [DEMO MODE]');
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`BODY: ${body}`);
    console.groupEnd();
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Explicit feedback for the user testing the replica
    // window.alert(`DEMO SUCCESS: Email simulated to ${to}.\n\n(See Console for details)`);
    
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

    await emailService.send(
      email,
      `Mandate Authorized: Consultation ${uniqueId}`,
      `Dear ${name},\n\nYour appointment at our ${branch} chamber is confirmed for ${formattedDate} at ${time.hour}:${time.minute} ${time.period}.\n\nReference: ${uniqueId}`
    );

    await emailService.send(
      ADMIN_EMAIL,
      `URGENT: New Appointment - ${uniqueId}`,
      `New appointment request from ${name} for ${formattedDate}.`
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
      `Dear ${fullName},\n\nWe have received your RFP for ${organization} regarding ${category}. A Partner will review this shortly.`
    );

    await emailService.send(
      ADMIN_EMAIL,
      `NEW RFP: ${organization}`,
      `RFP Category: ${category}\nContact: ${fullName} (${email})`
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
      `Dear ${name},\n\nYour application for ${jobTitle} has been securely filed in our candidate system.`
    );

    await emailService.send(
      ADMIN_EMAIL,
      `NEW APPLICATION: ${jobTitle}`,
      `Applicant: ${name}\nEmail: ${email}`
    );
  }
};

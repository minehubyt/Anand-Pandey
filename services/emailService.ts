
import { Resend } from 'resend';

/**
 * AK PANDEY & ASSOCIATES | STRATEGIC EMAIL PROTOCOL
 * 
 * Uses Resend SDK for email transmissions.
 */

// Provided Resend API Key
const resend = new Resend('re_Z8WRHBCj_3fapsCSGcSX6j2G6b6uzzG5m');

const ADMIN_EMAIL = 'admin@anandpandey.in';
const SENDER_EMAIL = 'onboarding@resend.dev'; // Default Resend sender for testing

export const emailService = {
  /**
   * Sends an email using the Resend SDK.
   */
  send: async (to: string, subject: string, body: string) => {
    try {
      const { data, error } = await resend.emails.send({
        from: SENDER_EMAIL,
        to: to,
        subject: subject,
        html: body.replace(/\n/g, '<br>')
      });

      if (error) {
        console.error('Resend Transmission Error:', error);
        return false;
      }
      
      return true;
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

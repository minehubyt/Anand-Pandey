
/**
 * AK PANDEY & ASSOCIATES | STRATEGIC EMAIL PROTOCOL
 * 
 * Uses internal Serverless Function (/api/send) to securely transmit emails via Resend.
 * This prevents CORS errors and protects the API key.
 */

const ADMIN_EMAIL = 'admin@anandpandey.in';

// --- VISUAL IDENTITY CONSTANTS ---
const COLORS = {
  primary: '#CC1414', // Corporate Red for accents
  brandRed: '#A6192E', // Deep Red for Logo (Matches Portal)
  black: '#000000',
  dark: '#0A1931', // Navy
  text: '#333333',
  bg: '#FFFFFF',
  panel: '#F8F9FA',
  border: '#E2E8F0'
};

/**
 * Generates a high-end, responsive HTML email template.
 * Design Philosophy: "Big Law" aesthetic - Minimalist, Serif Typography, Structured Data.
 */
const generateExecutiveTemplate = (
  headline: string, 
  recipientName: string, 
  introText: string,
  overviewTitle: string,
  overviewBody: string,
  ctaLink: string = "https://www.thetaxjournal.in",
  ctaText: string = "ACCESS SECURE PORTAL"
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${headline}</title>
      <!--[if mso]>
      <noscript>
      <xml>
      <o:OfficeDocumentSettings>
      <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
      </xml>
      </noscript>
      <![endif]-->
      <style>
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f4f4f4; padding-bottom: 60px; }
        .main-table { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 640px; border-spacing: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        
        /* Typography */
        h1 { font-family: 'Georgia', 'Times New Roman', serif; font-weight: 400; font-size: 32px; line-height: 1.2; color: #111111; margin: 0 0 24px 0; letter-spacing: -0.5px; }
        p { margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #444444; }
        
        /* Elements */
        .logo-text { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: 700; font-size: 22px; letter-spacing: 4px; color: ${COLORS.brandRed}; text-transform: uppercase; line-height: 1; display: inline-block; }
        .logo-amp { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; color: ${COLORS.brandRed}; vertical-align: middle; margin: 0 6px; display: inline-block; }
        
        .overview-box { background-color: #F9FAFB; border-left: 4px solid #000000; padding: 32px; margin: 32px 0; }
        .overview-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: ${COLORS.brandRed}; margin-bottom: 12px; display: block; }
        .overview-content { font-family: 'Georgia', 'Times New Roman', serif; font-style: italic; font-size: 17px; line-height: 1.7; color: #111111; }
        
        .btn { display: inline-block; padding: 16px 32px; background-color: ${COLORS.dark}; color: #ffffff !important; text-decoration: none; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; border-radius: 0; transition: background 0.3s; }
        
        .footer { background-color: #000000; padding: 48px 40px; color: #888888; font-size: 12px; line-height: 1.5; text-align: center; }
        .footer-tagline { color: #ffffff; font-family: 'Georgia', serif; font-size: 20px; font-style: italic; margin-bottom: 24px; display: block; }
        .footer a { color: #aaaaaa; text-decoration: none; margin: 0 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: inline-block; }
        .footer a:hover { color: #ffffff; }

        @media screen and (max-width: 600px) {
            .main-table { width: 100% !important; }
            h1 { font-size: 26px !important; }
            .wrapper { padding: 0 !important; }
            .content-cell { padding: 30px 20px !important; }
            .overview-box { padding: 20px !important; }
            .logo-text { font-size: 18px !important; letter-spacing: 2px !important; }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <!-- Spacing Top -->
        <div style="height: 40px; line-height: 40px; font-size: 0;">&nbsp;</div>
        
        <table class="main-table" align="center">
            
            <!-- Logo Header (Left Aligned) -->
            <tr>
                <td style="padding: 48px 40px 32px 40px; text-align: left; background-color: #ffffff;">
                    <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td align="left">
                                <span class="logo-text">AK PANDEY</span>
                                <span class="logo-amp">&</span>
                                <span class="logo-text">ASSOCIATES</span>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Main Content -->
            <tr>
                <td class="content-cell" style="padding: 48px 40px 40px 40px;">
                    <h1>${headline}</h1>
                    
                    <p>Hello ${recipientName},</p>
                    <p style="margin-bottom: 0;">${introText}</p>
                    
                    <!-- Structured Overview Box -->
                    <div class="overview-box">
                        <span class="overview-label">${overviewTitle}</span>
                        <div class="overview-content">
                            ${overviewBody}
                        </div>
                    </div>

                    <p style="font-size: 14px; color: #666666; margin-bottom: 32px;">
                        This communication serves as a formal acknowledgment. Our strategic team is reviewing the particulars of this engagement.
                    </p>

                    <!-- CTA Button -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td align="center">
                                <a href="${ctaLink}" class="btn">${ctaText}</a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td class="footer">
                    <span class="footer-tagline">Impact that matters.™</span>
                    
                    <div style="height: 1px; background-color: #333333; margin: 0 0 24px 0;"></div>
                    
                    <p style="margin-bottom: 24px; color: #888888;">
                        © 2026 AK Pandey & Associates. All rights reserved.<br>
                        High Court Chambers, Shanti Path, New Delhi, 110001
                    </p>
                    
                    <p style="font-size: 10px; color: #555555; margin-bottom: 24px; line-height: 1.4; text-align: justify;">
                        CONFIDENTIALITY NOTICE: The contents of this email message and any attachments are intended solely for the addressee(s) and may contain confidential and/or privileged information. If you are not the intended recipient, please alert the sender by reply email and delete this message.
                    </p>

                    <div>
                        <a href="https://www.thetaxjournal.in/page/privacy">PRIVACY NOTICE</a>
                        <a href="https://www.thetaxjournal.in/page/terms">TERMS OF USE</a>
                        <a href="https://www.thetaxjournal.in/locations">GLOBAL DIRECTORY</a>
                    </div>
                </td>
            </tr>
        </table>

        <!-- Spacing Bottom -->
        <div style="height: 40px; line-height: 40px; font-size: 0;">&nbsp;</div>
      </div>
    </body>
    </html>
  `;
};

export const emailService = {
  /**
   * Sends an email by calling the Vercel Serverless Function.
   * IMPLEMENTS "FAIL-OPEN" LOGIC: If the API fails (404 on local, 400 on free tier),
   * it returns TRUE to ensure the UI Demo Experience is not interrupted.
   */
  send: async (to: string, subject: string, body: string) => {
    // 1. Immediate simulation for obvious local environments to save network calls
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

    if (isLocal) {
      console.groupCollapsed(`%c[DEV MODE] Email Simulation: ${subject}`, 'color: #CC1414; font-weight: bold;');
      console.log('To:', to);
      console.log('Body HTML:', body); // HTML for debugging
      console.groupEnd();
      await new Promise(resolve => setTimeout(resolve, 800)); // Cinematic delay
      return true;
    }

    // 2. Attempt Real Transmission
    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          html: body // Body is now a full HTML string
        })
      });

      // 3. Handle API Responses
      if (response.ok) {
        return true;
      } else {
        // Handle expected errors gracefully for a Demo/Portfolio site
        if (response.status === 404) {
          console.warn('Email API Endpoint (/api/send) not found. This is expected if running on a static host or local vite server without Vercel functions.');
        } else if (response.status === 400) {
          const err = await response.json();
          console.warn('Resend API Restricted (Free Tier): Can only send to verified email. UI will proceed as success.', err);
        } else {
          console.warn(`Email API returned status: ${response.status}`);
        }
        
        // CRITICAL: Return true so the UI shows the "Success" screen to the user
        return true;
      }
    } catch (error) {
      // 4. Handle Network/CORS Errors
      console.warn("Email Protocol Network Error (CORS/Offline). Proceeding with UI simulation.", error);
      return true;
    }
  },

  /**
   * Send OTP for Account Verification
   */
  sendVerificationOTP: async (email: string, name: string, otp: string) => {
    const richOtpContent = `<div style="text-align: center; margin: 30px 0;"><span style="font-family: 'Helvetica Neue', sans-serif; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #CC1414; background: #ffffff; padding: 20px 40px; display: inline-block; border: 2px solid #000000; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">${otp}</span></div><br>This One-Time Password (OTP) is required to authorize the creation of your client mandate dossier. It ensures the security of the communication channel. Do not share this credential.`;

    const html = generateExecutiveTemplate(
      "Identity Verification Required",
      name,
      "We have received a request to establish a secure channel with this email address.",
      "Authentication Code",
      richOtpContent,
      "https://www.thetaxjournal.in",
      "SECURE CHANNEL"
    );

    await emailService.send(email, `Action Required: Verification Code ${otp}`, html);
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

    const overviewBody = `"We confirm that your request for a strategic consultation has been logged in our secure matrix. A Senior Partner has been notified of this engagement.\n\nReference ID: ${uniqueId}\nLocation: ${branch} Chamber"`;

    const html = generateExecutiveTemplate(
      "Mandate Authorized",
      name,
      `Your appointment at our ${branch} chamber is confirmed for ${formattedDate} at ${time.hour}:${time.minute} ${time.period}.`,
      "Engagement Overview",
      overviewBody,
      "https://www.thetaxjournal.in/dashboard",
      "MANAGE APPOINTMENT"
    );

    // 1. Send to Client
    await emailService.send(
      email,
      `Mandate Authorized: Consultation ${uniqueId}`,
      html
    );

    // 2. Send to Admin (Simplified)
    await emailService.send(
      ADMIN_EMAIL,
      `URGENT: New Appointment - ${uniqueId}`,
      `<p>New appointment request from <strong>${name}</strong>.</p><p>Date: ${formattedDate}</p>`
    );
  },

  /**
   * Send confirmation for RFP submission
   * Matches specific user request for "Proposal Transmission Received" look.
   * Uses dynamic data from the form.
   */
  sendRFPConfirmation: async (data: any) => {
    const { firstName, lastName, email, organization, category, summary, industry, spend, phone, attachmentName } = data;
    const fullName = `${firstName} ${lastName}`;

    const introText = `We have successfully received your Request for Proposal regarding <strong>${category}</strong> for <strong>${organization}</strong>.`;
    
    // Dynamic Overview Body using user-filled data
    const overviewBody = `
      <p style="margin-bottom: 20px; font-weight: 700; color: #cc1414; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">CLIENT RFP DIRECTIVE:</p>
      <p style="margin-bottom: 20px; font-style: italic;">"${summary}"</p>
      
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f9fa; border-top: 1px solid #e2e8f0; margin-top: 10px;">
        <tr>
          <td style="padding: 12px 0; font-size: 13px; color: #555; border-bottom: 1px solid #e2e8f0;"><strong>Industry Sector:</strong></td>
          <td style="padding: 12px 0; font-size: 13px; color: #111; border-bottom: 1px solid #e2e8f0; text-align: right;">${industry}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; font-size: 13px; color: #555; border-bottom: 1px solid #e2e8f0;"><strong>Est. Legal Spend:</strong></td>
          <td style="padding: 12px 0; font-size: 13px; color: #111; border-bottom: 1px solid #e2e8f0; text-align: right;">${spend}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; font-size: 13px; color: #555; border-bottom: 1px solid #e2e8f0;"><strong>Direct Contact:</strong></td>
          <td style="padding: 12px 0; font-size: 13px; color: #111; border-bottom: 1px solid #e2e8f0; text-align: right;">${phone || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; font-size: 13px; color: #555;"><strong>Attachment:</strong></td>
          <td style="padding: 12px 0; font-size: 13px; color: #111; text-align: right;">${attachmentName || 'None'}</td>
        </tr>
      </table>
    `;

    const html = generateExecutiveTemplate(
      "Proposal Transmission Received.",
      fullName,
      introText,
      "Proposal Scope",
      overviewBody,
      "https://www.thetaxjournal.in/dashboard",
      "VIEW RFP STATUS"
    );

    // 1. Send to Client
    await emailService.send(
      email,
      `RFP Received: ${category} - ${organization}`,
      html
    );

    // 2. Send to Admin
    await emailService.send(
      ADMIN_EMAIL,
      `NEW RFP: ${organization}`,
      `RFP Category: ${category}<br>Contact: ${fullName} (${email})<br>Summary: ${summary}`
    );
  },

  /**
   * Send confirmation for Job Application with detailed summary
   */
  sendApplicationConfirmation: async (data: any) => {
    const { name, email, jobTitle, formData } = data;

    // Create a rich summary of the submitted data
    const detailsHtml = `
      <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-left: 3px solid #000;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Education:</strong><br>${formData?.education || 'N/A'}</p>
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Experience:</strong><br>${formData?.experience || 'N/A'}</p>
        <p style="margin: 0; font-size: 14px; color: #666;"><strong>Interests:</strong><br>${formData?.interests || 'N/A'}</p>
      </div>
    `;

    const overviewBody = `"Your credentials for the position of ${jobTitle} have been securely filed in our candidate matrix. The Recruitment Board will review your academic and professional history shortly."<br><br><strong>Submitted Dossier Summary:</strong>${detailsHtml}`;

    const html = generateExecutiveTemplate(
      "Dossier Filed Successfully.",
      name,
      `We acknowledge receipt of your application for the position of <strong>${jobTitle}</strong>.`,
      "Candidate Status",
      overviewBody,
      "https://www.thetaxjournal.in/dashboard",
      "CHECK APPLICATION STATUS"
    );

    // 1. Send to Candidate
    await emailService.send(
      email,
      `Dossier Authorized: ${jobTitle}`,
      html
    );

    // 2. Send to Admin
    await emailService.send(
      ADMIN_EMAIL,
      `NEW APPLICATION: ${jobTitle}`,
      `Applicant: ${name}<br>Email: ${email}<br><br><strong>Education:</strong> ${formData?.education}<br><strong>Experience:</strong> ${formData?.experience}`
    );
  },

  /**
   * Send Status Update Email (Interview / Rejection)
   */
  sendApplicationStatusUpdate: async (data: any) => {
    const { name, email, jobTitle, status } = data;

    let subject = "";
    let headline = "";
    let introText = "";
    let overviewBody = "";
    let ctaText = "VIEW DASHBOARD";
    
    if (status === 'Interview') {
       subject = `Interview Invitation: ${jobTitle}`;
       headline = "Candidate Shortlisted";
       introText = `Following a review of your dossier, we are pleased to invite you to the interview stage for <strong>${jobTitle}</strong>.`;
       overviewBody = `"Your profile has been flagged for potential strategic alignment with our firm's values. A member of our Recruitment Board will contact you within 24 hours to schedule the formal interaction. Please ensure your documentation is ready for verification."`;
    } else if (status === 'Rejected') {
       subject = `Application Status Update: ${jobTitle}`;
       headline = "Recruitment Board Decision";
       introText = `We appreciate the time you invested in applying for the <strong>${jobTitle}</strong> position.`;
       overviewBody = `"After careful consideration of your credentials against our current strategic requirements, we have decided not to proceed with your application at this time. We will keep your dossier in our secure matrix for future opportunities that align with your expertise."`;
       ctaText = "VIEW OTHER ROLES";
    }

    if (subject) {
      const html = generateExecutiveTemplate(
        headline,
        name,
        introText,
        "Status Update",
        overviewBody,
        "https://www.thetaxjournal.in/dashboard",
        ctaText
      );

      await emailService.send(email, subject, html);
    }
  }
};

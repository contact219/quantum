import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";

let zohoTransporter: any = null;
let sendGridApiKey: string | null = null;

async function initZohoTransporter() {
  if (zohoTransporter) return zohoTransporter;

  const zohoEmail = process.env.ZOHO_EMAIL;
  const zohoPassword = process.env.ZOHO_PASSWORD;

  if (!zohoEmail || !zohoPassword) {
    console.log("Zoho SMTP credentials not configured - will use SendGrid only");
    return null;
  }

  try {
    zohoTransporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: zohoEmail,
        pass: zohoPassword,
      },
    });

    await zohoTransporter.verify();
    console.log("Zoho SMTP transporter initialized successfully");
    return zohoTransporter;
  } catch (error) {
    console.error("Failed to initialize Zoho SMTP:", error);
    zohoTransporter = null;
    return null;
  }
}

async function getSendGridApiKey(): Promise<string | null> {
  if (sendGridApiKey) return sendGridApiKey;

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? "depl " + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    console.log("Replit token not found - SendGrid fallback unavailable");
    return null;
  }

  try {
    const response = await fetch(
      "https://" + hostname + "/api/v2/connection?include_secrets=true&connector_names=sendgrid",
      {
        headers: {
          Accept: "application/json",
          X_REPLIT_TOKEN: xReplitToken,
        },
      }
    );
    const data = await response.json();
    const connectionSettings = data.items?.[0];

    if (connectionSettings?.settings?.api_key) {
      sendGridApiKey = connectionSettings.settings.api_key;
      console.log("SendGrid API key loaded successfully");
      return sendGridApiKey;
    }

    console.log("SendGrid not configured in Replit connectors");
    return null;
  } catch (error) {
    console.error("Error fetching SendGrid credentials:", error);
    return null;
  }
}

export async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<boolean> {
  console.log(`[EMAIL] Attempting to send email to ${to}: ${subject}`);

  const fromEmail = process.env.ZOHO_EMAIL || "noreply@quantumsurety.bond";

  // Try Zoho SMTP first
  const zohoTransporter = await initZohoTransporter();
  if (zohoTransporter) {
    try {
      console.log(`[EMAIL] Sending via Zoho SMTP to ${to}`);
      await zohoTransporter.sendMail({
        from: fromEmail,
        to,
        subject,
        html: htmlContent,
        text: textContent || subject,
      });
      console.log(`[EMAIL] Successfully sent via Zoho SMTP to ${to}`);
      return true;
    } catch (error) {
      console.error(`[EMAIL] Zoho SMTP failed:`, error);
      console.log(`[EMAIL] Falling back to SendGrid for ${to}`);
    }
  }

  // Fallback to SendGrid
  try {
    const apiKey = await getSendGridApiKey();
    if (!apiKey) {
      console.error(`[EMAIL] SendGrid not available and Zoho failed - email not sent to ${to}`);
      return false;
    }

    console.log(`[EMAIL] Sending via SendGrid to ${to}`);
    sgMail.setApiKey(apiKey);
    await sgMail.send({
      from: fromEmail,
      to,
      subject,
      html: htmlContent,
      text: textContent || subject,
    });
    console.log(`[EMAIL] Successfully sent via SendGrid to ${to}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL] SendGrid failed:`, error);
    console.error(`[EMAIL] Failed to send email to ${to} via all methods`);
    return false;
  }
}

export async function sendBondRequestNotification(
  businessName: string,
  contactName: string,
  contactEmail: string,
  bondType: string,
  projectState: string,
  contractValue: number
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || "administrator@quantumsurety.bond";

  const htmlContent = `
    <h2>New Bond Quote Request</h2>
    <p><strong>From:</strong> ${contactName}</p>
    <p><strong>Company:</strong> ${businessName}</p>
    <p><strong>Email:</strong> ${contactEmail}</p>
    <h3>Request Details:</h3>
    <ul>
      <li><strong>Bond Type:</strong> ${bondType}</li>
      <li><strong>Project State:</strong> ${projectState}</li>
      <li><strong>Contract Value:</strong> $${contractValue.toLocaleString()}</li>
    </ul>
    <p>Log in to the admin portal to review and process this quote request.</p>
  `;

  return sendEmail(adminEmail, `New Bond Quote Request - ${businessName}`, htmlContent);
}

export async function sendQuoteSubmissionNotificationEmail(
  businessName: string,
  contactName: string,
  contactEmail: string,
  bondType: string,
  projectState: string,
  contractValue: number
): Promise<boolean> {
  return sendBondRequestNotification(
    businessName,
    contactName,
    contactEmail,
    bondType,
    projectState,
    contractValue
  );
}

export async function sendApplicationStatusEmail(
  to: string,
  applicationNumber: string,
  status: string,
  details?: string
): Promise<boolean> {
  const statusMessages: Record<string, string> = {
    submitted: "Your surety application has been submitted successfully",
    "in_review": "Your application is under review",
    approved: "Congratulations! Your application has been approved",
    rejected: "We were unable to approve your application at this time",
    bonded: "Your bond has been issued",
  };

  const message = statusMessages[status] || "Your application status has been updated";
  const htmlContent = `
    <h2>Application Status Update</h2>
    <p>Application: <strong>${applicationNumber}</strong></p>
    <p>Status: <strong>${status.toUpperCase()}</strong></p>
    <p>${message}</p>
    ${details ? `<p>Details: ${details}</p>` : ""}
    <p>Log in to your portal to view more details.</p>
  `;

  return sendEmail(to, `Application Status: ${status}`, htmlContent);
}

export async function sendDocumentRequestEmail(
  to: string,
  applicationNumber: string,
  missingDocuments: string[]
): Promise<boolean> {
  const docList = missingDocuments.map((doc) => `<li>${doc}</li>`).join("");
  const htmlContent = `
    <h2>Additional Documents Needed</h2>
    <p>Application: <strong>${applicationNumber}</strong></p>
    <p>We need the following documents to complete your application:</p>
    <ul>${docList}</ul>
    <p>Please upload these documents in your portal as soon as possible.</p>
  `;

  return sendEmail(to, "Additional Documents Required", htmlContent);
}

export async function sendDocumentUploadNotificationEmail(
  adminEmail: string,
  applicantName: string,
  applicationNumber: string,
  documentType: string,
  portalUrl: string
): Promise<boolean> {
  const htmlContent = `
    <h2>Document Upload Notification</h2>
    <p>A new document has been uploaded to an application.</p>
    <p><strong>Applicant:</strong> ${applicantName}</p>
    <p><strong>Application Number:</strong> ${applicationNumber}</p>
    <p><strong>Document Type:</strong> ${documentType}</p>
    <p><a href="${portalUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 4px;">Review in Admin Portal</a></p>
    <p>Please review and validate the uploaded document.</p>
  `;

  return sendEmail(adminEmail, `Document Upload: ${applicationNumber}`, htmlContent);
}

export async function sendDocumentsCompleteNotificationEmail(
  adminEmail: string,
  applicantName: string,
  applicationNumber: string,
  portalUrl: string
): Promise<boolean> {
  const htmlContent = `
    <h2>All Required Documents Received</h2>
    <p>The applicant has uploaded all required documents.</p>
    <p><strong>Applicant:</strong> ${applicantName}</p>
    <p><strong>Application Number:</strong> ${applicationNumber}</p>
    <p><a href="${portalUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 4px;">Proceed with Underwriting</a></p>
    <p>The application is ready for underwriting review and quote generation.</p>
  `;

  return sendEmail(adminEmail, `Ready for Underwriting: ${applicationNumber}`, htmlContent);
}

export async function sendQuoteReadyEmail(
  to: string,
  quoteNumber: string,
  premium: string
): Promise<boolean> {
  const htmlContent = `
    <h2>Your Quote is Ready!</h2>
    <p>Quote: <strong>${quoteNumber}</strong></p>
    <p>Estimated Premium: <strong>$${premium}</strong></p>
    <p>Log in to your portal to review and accept your quote.</p>
  `;

  return sendEmail(to, `Your Quote is Ready: ${quoteNumber}`, htmlContent);
}

export async function sendBondIssuedEmail(
  to: string,
  bondNumber: string,
  effectiveDate: string
): Promise<boolean> {
  const htmlContent = `
    <h2>Your Bond Has Been Issued!</h2>
    <p>Bond: <strong>${bondNumber}</strong></p>
    <p>Effective Date: <strong>${effectiveDate}</strong></p>
    <p>You can now view and download your bond documents from your portal.</p>
  `;

  return sendEmail(to, `Bond Issued: ${bondNumber}`, htmlContent);
}

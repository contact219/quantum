import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";

// ─── Zoho Mail transporter (primary) ────────────────────────────────────────
function createZohoTransporter() {
  const user = process.env.ZOHO_EMAIL;
  const pass = process.env.ZOHO_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

// ─── SendGrid credentials (fallback) ─────────────────────────────────────────
let _sgCredentials: { apiKey: string; email: string } | null = null;

async function getSendGridCredentials() {
  if (_sgCredentials) return _sgCredentials;

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? "depl " + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken || !hostname) return null;

  try {
    const data = await fetch(
      "https://" + hostname + "/api/v2/connection?include_secrets=true&connector_names=sendgrid",
      {
        headers: {
          Accept: "application/json",
          X_REPLIT_TOKEN: xReplitToken,
        },
      }
    )
      .then((res) => res.json())
      .then((d) => d.items?.[0]);

    if (!data?.settings?.api_key || !data?.settings?.from_email) return null;

    _sgCredentials = { apiKey: data.settings.api_key, email: data.settings.from_email };
    return _sgCredentials;
  } catch {
    return null;
  }
}

// ─── Core send function ───────────────────────────────────────────────────────
// Supports two call styles used in the codebase:
//   sendEmail(to, subject, html, text?)          — positional (routes.ts)
//   sendEmail({ to, subject, html, text? })      — object style (routes-bmc84.ts)

export async function sendEmail(
  toOrOptions: string | { to: string; subject: string; html: string; text?: string },
  subject?: string,
  htmlContent?: string,
  textContent?: string
): Promise<boolean> {
  // Normalise arguments
  let to: string;
  let subj: string;
  let html: string;
  let text: string | undefined;

  if (typeof toOrOptions === "object") {
    ({ to, subject: subj, html, text } = toOrOptions);
  } else {
    to = toOrOptions;
    subj = subject!;
    html = htmlContent!;
    text = textContent;
  }

  // 1. Try Zoho first
  const zoho = createZohoTransporter();
  if (zoho) {
    try {
      await zoho.sendMail({
        from: `"Quantum Surety" <${process.env.ZOHO_EMAIL}>`,
        to,
        subject: subj,
        html,
        text: text || subj,
      });
      console.log(`[Email] Zoho → ${to} | "${subj}"`);
      return true;
    } catch (zohoErr: any) {
      console.error("[Email] Zoho failed, trying SendGrid fallback:", zohoErr.message);
    }
  } else {
    console.warn("[Email] Zoho not configured (ZOHO_EMAIL / ZOHO_APP_PASSWORD missing)");
  }

  // 2. SendGrid fallback
  try {
    const creds = await getSendGridCredentials();
    if (!creds) {
      console.warn("[Email] SendGrid also unavailable — email not sent");
      return false;
    }

    sgMail.setApiKey(creds.apiKey);
    await sgMail.send({
      to,
      from: creds.email,
      subject: subj,
      html,
      text: text || subj,
    });
    console.log(`[Email] SendGrid fallback → ${to} | "${subj}"`);
    return true;
  } catch (sgErr: any) {
    console.error("[Email] SendGrid fallback also failed:", sgErr.message);
    return false;
  }
}

// ─── Admin notification helper ────────────────────────────────────────────────
export async function notifyAdministrator(
  subject: string,
  htmlContent: string
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || "administrator@quantumsurety.bond";
  return sendEmail(adminEmail, subject, htmlContent);
}

// ─── Bond request submission notification ────────────────────────────────────
export async function sendBondRequestNotification(data: {
  applicantName: string;
  companyName?: string;
  bondType?: string;
  contractValue?: string | number;
  contactEmail?: string;
  applicationNumber?: string;
  quoteId?: string;
}): Promise<boolean> {
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#4f46e5;">New Bond Request Submitted</h2>
      <table style="border-collapse:collapse;width:100%;">
        <tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Applicant</td>
            <td style="padding:8px;border:1px solid #e5e7eb;"><strong>${data.applicantName}</strong></td></tr>
        ${data.companyName ? `<tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Company</td>
            <td style="padding:8px;border:1px solid #e5e7eb;">${data.companyName}</td></tr>` : ""}
        ${data.bondType ? `<tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Bond Type</td>
            <td style="padding:8px;border:1px solid #e5e7eb;">${data.bondType}</td></tr>` : ""}
        ${data.contractValue ? `<tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Contract Value</td>
            <td style="padding:8px;border:1px solid #e5e7eb;">$${data.contractValue}</td></tr>` : ""}
        ${data.contactEmail ? `<tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Contact Email</td>
            <td style="padding:8px;border:1px solid #e5e7eb;">${data.contactEmail}</td></tr>` : ""}
        ${data.applicationNumber ? `<tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Application #</td>
            <td style="padding:8px;border:1px solid #e5e7eb;">${data.applicationNumber}</td></tr>` : ""}
        <tr><td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;">Submitted</td>
            <td style="padding:8px;border:1px solid #e5e7eb;">${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })} CT</td></tr>
      </table>
      <p style="margin-top:24px;">
        <a href="${process.env.APP_URL || "http://localhost:5000"}/admin"
           style="background:#4f46e5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
          Review in Admin Portal
        </a>
      </p>
    </div>
  `;

  return notifyAdministrator(
    `New Bond Request — ${data.companyName || data.applicantName}`,
    html
  );
}

// ─── Existing named exports (unchanged behaviour) ─────────────────────────────
export async function sendApplicationStatusEmail(
  to: string,
  applicationNumber: string,
  status: string,
  details?: string
): Promise<boolean> {
  const statusMessages: Record<string, string> = {
    submitted: "Your surety application has been submitted successfully",
    in_review: "Your application is under review",
    approved: "Congratulations! Your application has been approved",
    rejected: "We were unable to approve your application at this time",
    bonded: "Your bond has been issued",
    agreement_signed: "The applicant has signed the agreement",
  };

  const message = statusMessages[status] || "Your application status has been updated";
  const html = `
    <h2>Application Status Update</h2>
    <p>Application: <strong>${applicationNumber}</strong></p>
    <p>Status: <strong>${status.toUpperCase()}</strong></p>
    <p>${message}</p>
    ${details ? `<p>Details: ${details}</p>` : ""}
    <p>Log in to your portal to view more details.</p>
  `;

  return sendEmail(to, `Application Status: ${status}`, html);
}

export async function sendDocumentRequestEmail(
  to: string,
  applicationNumber: string,
  missingDocuments: string[]
): Promise<boolean> {
  const docList = missingDocuments.map((doc) => `<li>${doc}</li>`).join("");
  const html = `
    <h2>Additional Documents Needed</h2>
    <p>Application: <strong>${applicationNumber}</strong></p>
    <p>We need the following documents to complete your application:</p>
    <ul>${docList}</ul>
    <p>Please upload these documents in your portal as soon as possible.</p>
  `;

  return sendEmail(to, "Additional Documents Required", html);
}

export async function sendDocumentUploadNotificationEmail(
  adminEmail: string,
  applicantName: string,
  applicationNumber: string,
  documentType: string,
  portalUrl: string
): Promise<boolean> {
  const html = `
    <h2>Document Upload Notification</h2>
    <p>A new document has been uploaded to an application.</p>
    <p><strong>Applicant:</strong> ${applicantName}</p>
    <p><strong>Application Number:</strong> ${applicationNumber}</p>
    <p><strong>Document Type:</strong> ${documentType}</p>
    <p><a href="${portalUrl}" style="display:inline-block;padding:10px 20px;background-color:#4f46e5;color:white;text-decoration:none;border-radius:4px;">Review in Admin Portal</a></p>
    <p>Please review and validate the uploaded document.</p>
  `;

  return sendEmail(adminEmail, `Document Upload: ${applicationNumber}`, html);
}

export async function sendDocumentsCompleteNotificationEmail(
  adminEmail: string,
  applicantName: string,
  applicationNumber: string,
  portalUrl: string
): Promise<boolean> {
  const html = `
    <h2>All Required Documents Received</h2>
    <p>The applicant has uploaded all required documents.</p>
    <p><strong>Applicant:</strong> ${applicantName}</p>
    <p><strong>Application Number:</strong> ${applicationNumber}</p>
    <p><a href="${portalUrl}" style="display:inline-block;padding:10px 20px;background-color:#4f46e5;color:white;text-decoration:none;border-radius:4px;">Proceed with Underwriting</a></p>
    <p>The application is ready for underwriting review and quote generation.</p>
  `;

  return sendEmail(adminEmail, `Ready for Underwriting: ${applicationNumber}`, html);
}

export async function sendQuoteReadyEmail(
  to: string,
  quoteNumber: string,
  premium: string
): Promise<boolean> {
  const html = `
    <h2>Your Quote is Ready!</h2>
    <p>Quote: <strong>${quoteNumber}</strong></p>
    <p>Estimated Premium: <strong>$${premium}</strong></p>
    <p>Log in to your portal to review and accept your quote.</p>
  `;

  return sendEmail(to, `Your Quote is Ready: ${quoteNumber}`, html);
}

export async function sendBondIssuedEmail(
  to: string,
  bondNumber: string,
  effectiveDate: string
): Promise<boolean> {
  const html = `
    <h2>Your Bond Has Been Issued!</h2>
    <p>Bond: <strong>${bondNumber}</strong></p>
    <p>Effective Date: <strong>${effectiveDate}</strong></p>
    <p>You can now view and download your bond documents from your portal.</p>
  `;

  return sendEmail(to, `Bond Issued: ${bondNumber}`, html);
}

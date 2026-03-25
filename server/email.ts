import sgMail from "@sendgrid/mail";

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? "depl " + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    console.warn("X_REPLIT_TOKEN not found - email notifications will not be sent");
    return null;
  }

  try {
    connectionSettings = await fetch(
      "https://" + hostname + "/api/v2/connection?include_secrets=true&connector_names=sendgrid",
      {
        headers: {
          Accept: "application/json",
          X_REPLIT_TOKEN: xReplitToken,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => data.items?.[0]);

    if (!connectionSettings) {
      console.warn("SendGrid integration not found in Replit connectors - email notifications will not be sent");
      return null;
    }

    if (
      !connectionSettings.settings.api_key ||
      !connectionSettings.settings.from_email
    ) {
      console.warn("SendGrid not properly configured - missing api_key or from_email");
      console.warn("SendGrid settings:", {
        hasApiKey: !!connectionSettings.settings.api_key,
        hasFromEmail: !!connectionSettings.settings.from_email
      });
      return null;
    }
    
    console.log("SendGrid credentials loaded successfully");
    return {
      apiKey: connectionSettings.settings.api_key,
      email: connectionSettings.settings.from_email,
    };
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
  try {
    const creds = await getCredentials();
    if (!creds) {
      console.log("Email service not available, skipping send");
      return false;
    }

    sgMail.setApiKey(creds.apiKey);
    const msg = {
      to,
      from: creds.email,
      subject,
      text: textContent || subject,
      html: htmlContent,
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export async function sendQuoteSubmissionNotificationEmail(
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

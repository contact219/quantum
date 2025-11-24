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

  if (
    !connectionSettings ||
    !connectionSettings.settings.api_key ||
    !connectionSettings.settings.from_email
  ) {
    console.warn("SendGrid not properly configured");
    return null;
  }
  return {
    apiKey: connectionSettings.settings.api_key,
    email: connectionSettings.settings.from_email,
  };
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

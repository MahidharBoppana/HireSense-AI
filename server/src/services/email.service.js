import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not configured");
  }

  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is not configured");
  }

  console.log("📧 Sending email to:", to);
  console.log("📧 From:", process.env.EMAIL_FROM);

  try {
    const response = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: "HireSense AI",
        email: process.env.EMAIL_FROM,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: html,
    });

    console.log("📧 Email sent:", response.messageId);

    return response;
  } catch (error) {
    console.error("📧 Email sending failed:", error);
    throw new Error(
      error?.message || "Failed to send email",
    );
  }
};

export const sendPasswordResetEmail = async ({
  email,
  resetUrl,
}) => {
  return sendEmail({
    to: email,
    subject: "Reset your HireSense AI password",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:40px auto;background:#ffffff;padding:40px;border-radius:12px;">
            
            <h1 style="color:#4f46e5;margin-bottom:24px;">
              HireSense AI
            </h1>

            <h2>Password Reset</h2>

            <p>
              We received a request to reset your HireSense AI password.
            </p>

            <p>
              Click the button below to create a new password.
            </p>

            <a
              href="${resetUrl}"
              style="
                display:inline-block;
                padding:12px 24px;
                background:#4f46e5;
                color:#ffffff;
                text-decoration:none;
                border-radius:8px;
                font-weight:600;
                margin:16px 0;
              "
            >
              Reset Password
            </a>

            <p style="color:#64748b;margin-top:24px;">
              This link will expire in 15 minutes.
            </p>

            <p style="color:#64748b;">
              If you did not request this password reset,
              you can safely ignore this email.
            </p>

          </div>
        </body>
      </html>
    `,
  });
};
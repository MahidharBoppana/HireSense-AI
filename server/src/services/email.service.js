import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Email sending failed:", error);
    throw new Error(error.message || "Failed to send email");
  }

  return data;
};

export const sendPasswordResetEmail = async ({ email, resetUrl }) => {
  return sendEmail({
    to: email,
    subject: "Reset your HireSense AI password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px;">
        <h1 style="color: #4f46e5;">HireSense AI</h1>

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
            display: inline-block;
            padding: 12px 20px;
            background: #4f46e5;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
          "
        >
          Reset Password
        </a>

        <p style="margin-top: 24px; color: #666;">
          This link will expire in 15 minutes.
        </p>

        <p style="color: #666;">
          If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};

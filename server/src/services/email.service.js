import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export const sendPasswordResetEmail = async ({ email, resetUrl }) => {
  const info = await transporter.sendMail({
    from: `"HireSense AI" <${process.env.EMAIL_USER}>`,
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
          If you did not request this password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  console.log("📧 Email sent:", info.messageId);

  return info;
};

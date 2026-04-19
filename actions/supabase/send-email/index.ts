"use server";

import nodemailer from "nodemailer";

export async function autoEmailSender(
  text: string,
  subject: string,
  recipient: string,
) {
  const senderAddress = process.env.BREVO_SMTP_USER;
  const senderAppPassword = process.env.BREVO_SMTP_KEY;
  const senderName = process.env.EMAIL_SENDER_NAME ?? "Ecovet Global Team";
  const verifiedAddress = "ecovetadmin@gmail.com";

  if (!senderAddress || !senderAppPassword) {
    throw new Error(
      "Missing email configuration: BREVO_SMTP_USER and BREVO_SMTP_KEY must be set in environment variables.",
    );
  }

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: senderAddress,
      pass: senderAppPassword,
    },
  });

  await transporter.sendMail({
    from: `${senderName} <${verifiedAddress}>`,
    to: recipient,
    subject,
    text,
  });
}

export default autoEmailSender;

export async function sendEmailReminder(
  email: string,
  session_id: string,
  user_id: string,
) {
  if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_KEY) {
    throw new Error(
      "Missing email configuration: BREVO_SMTP_USER and BREVO_SMTP_KEY must be set in environment variables.",
    );
  }

  const text =
    "Hi,\nThis is a reminder that you have an ongoing game. Go to " +
    process.env.NEXT_PUBLIC_SITE_URL +
    "/participants/scenario-overview/" +
    session_id +
    "/" +
    user_id +
    ` to login to join the game.`;

  await autoEmailSender(text, "Reminder to Re-join Your Ongoing Game", email);

  return "Successfully sent email reminder";
}

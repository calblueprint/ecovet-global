"use server";

export async function autoEmailSender(
  htmlContent: string,
  textContent: string,
  subject: string,
  recipient: string,
) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderName = process.env.EMAIL_SENDER_NAME ?? "Ecovet Global Team";
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? "ecovetadmin@gmail.com";

  if (!apiKey) {
    throw new Error("Missing BREVO_API_KEY env var.");
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: recipient }],
      subject,
      htmlContent,
      textContent,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Brevo API ${res.status}: ${errBody}`);
  }
}

export async function sendEmailReminder(email: string, sessionId: string) {
  const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/sign-in?fromNudge=true&sessionId=${sessionId}`;

  const htmlContent = `
    <p>Hi, this is a reminder that you have an ongoing game. 
    <a href="${loginUrl}">Click here to log in and re-join the current excercise</a>.</p>
  `;

  const textContent = `Hi,\nThis is a reminder that you have an ongoing game. Go to ${loginUrl} to login to join the current excercise.`;

  await autoEmailSender(
    htmlContent,
    textContent,
    "Reminder to Re-join Your Ongoing Game",
    email,
  );

  return "Successfully sent email reminder";
}

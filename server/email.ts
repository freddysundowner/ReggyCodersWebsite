const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const NOTIFY_EMAIL = "info@reggycodas.com";

interface ContactMessage {
  name: string;
  email: string;
  company?: string | null;
  service?: string | null;
  message: string;
}

export async function sendContactNotification(contact: ContactMessage): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY is not configured");

  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "ReggyCodas Website", email: NOTIFY_EMAIL },
      to: [{ email: NOTIFY_EMAIL, name: "ReggyCodas" }],
      replyTo: { email: contact.email, name: contact.name },
      subject: `New contact message from ${contact.name}${contact.service ? ` — ${contact.service}` : ""}`,
      htmlContent: `
        <h2>New message from the website contact form</h2>
        <p><strong>Name:</strong> ${escapeHtml(contact.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(contact.email)}</p>
        ${contact.company ? `<p><strong>Company:</strong> ${escapeHtml(contact.company)}</p>` : ""}
        ${contact.service ? `<p><strong>Service:</strong> ${escapeHtml(contact.service)}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(contact.message)}</p>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo API error ${res.status}: ${body}`);
  }
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

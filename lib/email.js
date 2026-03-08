import { Resend } from "resend";

export async function sendOrderEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_FROM_EMAIL || "orders@saromen.com";

  if (!apiKey || !to) {
    return { ok: false, skipped: true };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({ from, to, subject, html });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

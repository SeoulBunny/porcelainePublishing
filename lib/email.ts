import type { ReactElement } from "react";
import { Resend } from "resend";

// Single Resend sender. Better Auth calls this for verification + reset; the
// subscribe route calls it for confirmations. EMAIL_FROM must be a verified
// domain in production (onboarding@resend.dev works for dev, own address only).
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(opts: {
  to: string;
  subject: string;
  react?: ReactElement;
  html?: string;
  url?: string;
}): Promise<void> {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: opts.to,
    subject: opts.subject,
    react: opts.react,
    html: opts.html ?? (opts.url ? `<a href="${opts.url}">Continue</a>` : undefined),
  });
  if (error) throw new Error(`Resend: ${error.message}`);
  void data;
}

// Email helper (Resend). No-ops gracefully if RESEND_API_KEY is missing so
// preview deploys don't crash on the admin status flow.
import { Resend } from 'resend'

const FROM = process.env.RESEND_FROM || 'HouseHoldTalent <hello@householdtalent.com>'
const CONTACT_EMAIL = process.env.RESEND_CONTACT_EMAIL || 'hello@householdtalent.com'
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'https://householdtalent.com'
const SITE_LABEL = SITE_URL.replace(/^https?:\/\//, '')

let cached: Resend | null = null
function client() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  if (!cached) cached = new Resend(key)
  return cached
}

export type SendArgs = {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendEmail({ to, subject, text, html }: SendArgs) {
  const resend = client()
  if (!resend) {
    console.warn('[email] RESEND_API_KEY missing - email not sent', { to, subject })
    return { sent: false, reason: 'no-api-key' as const }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      text: appendTextFooter(text),
      html: html || wrapHtml(text),
    })
    if (error) {
      console.error('[email] send failed', { to, subject, error })
      return { sent: false, reason: 'send-error' as const, error }
    }
    return { sent: true, id: data?.id }
  } catch (err) {
    console.error('[email] send threw', { to, subject, err })
    return { sent: false, reason: 'exception' as const }
  }
}

function appendTextFooter(text: string) {
  return (
    `${text.trim()}\n\n` +
    `--\n` +
    `HouseHoldTalent\n` +
    `Selected, not listed.\n` +
    `${SITE_LABEL}  ·  ${CONTACT_EMAIL}\n` +
    `Access by referral, recommendation or application only.`
  )
}

function wrapHtml(text: string) {
  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => `<p style="margin:0 0 18px;line-height:1.65;color:#1a1a1a;">${escape(p).replace(/\n/g, '<br />')}</p>`)
    .join('')

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f5f3ee;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f5f3ee;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;background:#ffffff;border:1px solid #e6e1d5;border-radius:8px;">
          <tr>
            <td style="padding:32px 40px 12px;border-bottom:1px solid #f0ece1;">
              <p style="margin:0;font-size:18px;font-weight:600;letter-spacing:0.04em;color:#1a1a1a;">HouseHold<span style="color:#9B7B3C;">Talent</span></p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px 8px;">
              ${paragraphs}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px 32px;border-top:1px solid #f0ece1;">
              <p style="margin:0 0 8px;font-size:11px;color:#8a8576;letter-spacing:0.14em;text-transform:uppercase;">Selected, not listed.</p>
              <p style="margin:0 0 4px;font-size:12px;color:#5a5648;line-height:1.6;">
                <a href="${SITE_URL}" style="color:#9B7B3C;text-decoration:none;">${SITE_LABEL}</a>
                &nbsp;&middot;&nbsp;
                <a href="mailto:${CONTACT_EMAIL}" style="color:#9B7B3C;text-decoration:none;">${CONTACT_EMAIL}</a>
              </p>
              <p style="margin:0;font-size:11px;color:#a09b8b;line-height:1.5;">
                Access by referral, recommendation or application only.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function escape(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

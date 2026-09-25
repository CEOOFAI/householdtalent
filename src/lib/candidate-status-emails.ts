// Candidate status notification emails (Heinz Q4, May 2026).
// Triggered from the admin candidate accept/waitlist/decline flow.
// Copy locked by Heinz - DO NOT rewrite without sign-off.
import { sendEmail } from './email'

type StatusEmail = 'accepted' | 'waitlisted' | 'declined'

const TEMPLATES: Record<StatusEmail, { subject: string; body: (name: string) => string }> = {
  accepted: {
    subject: 'Welcome to HouseHoldTalent',
    body: (name) =>
      `Dear ${name},\n\n` +
      `We are pleased to let you know that your application to join the HouseHoldTalent network has been accepted.\n\n` +
      `Welcome to the network. You will shortly receive instructions to complete your member profile. We look forward to making the right introduction for you.\n\n` +
      `The HHT Team.`,
  },
  waitlisted: {
    subject: 'Your HouseHoldTalent application',
    body: (name) =>
      `Dear ${name},\n\n` +
      `Thank you for your application to join HouseHoldTalent.\n\n` +
      `We have reviewed your submission carefully. At this time we have placed your application on our waitlist while we continue to build the network. We will be in touch as soon as a place becomes available.\n\n` +
      `The HHT Team.`,
  },
  declined: {
    subject: 'Your HouseHoldTalent application',
    body: (name) =>
      `Dear ${name},\n\n` +
      `Thank you for taking the time to apply to HouseHoldTalent.\n\n` +
      `After careful review we are unable to offer you a place in the network at this time. We wish you well in your career and encourage you to apply again in the future should your circumstances change.\n\n` +
      `The HHT Team.`,
  },
}

export async function sendCandidateStatusEmail(args: {
  to: string
  firstName: string | null | undefined
  status: StatusEmail
}) {
  const template = TEMPLATES[args.status]
  const name = (args.firstName || '').trim() || 'Applicant'
  return sendEmail({
    to: args.to,
    subject: template.subject,
    text: template.body(name),
  })
}

export function mapStatusToEmail(newStatus: string): StatusEmail | null {
  if (newStatus === 'active') return 'accepted'
  if (newStatus === 'waitlisted') return 'waitlisted'
  if (newStatus === 'suspended') return 'declined'
  return null
}

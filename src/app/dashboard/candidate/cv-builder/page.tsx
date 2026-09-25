import { redirect } from 'next/navigation'

// The self-service CV builder has been replaced by HHT's human-checked CV
// services (see /dashboard/candidate/subscription). The AI endpoints remain
// available for HHT's internal use.
export default function CvBuilderPage() {
  redirect('/dashboard/candidate/subscription')
}

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Check, FileText, Lock } from 'lucide-react'

// Optional CV services for HHT Approved candidates.
// Membership itself is free; these services are entirely separate from
// admission. Online payment is added later, so requests go through HHT by email.
const CV_SERVICES = [
  {
    name: 'HHT CV Polish',
    price: '£35',
    summary: 'Your CV professionally restructured and presented, with a discreet "Prepared by HouseHoldTalent" footer.',
    points: ['Restructured for private-service roles', 'Clear, premium presentation', 'Discreet HHT footer', 'Human-checked before delivery'],
  },
  {
    name: 'Professional CV',
    price: '£59',
    summary: 'Professionally restructured and presented, fully unbranded for unrestricted use.',
    points: ['Everything in CV Polish', 'No HHT branding', 'Use it anywhere you like', 'Human-checked before delivery'],
  },
]

export default async function CandidateCvServicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('candidate_profiles')
    .select('status')
    .eq('user_id', user.id)
    .maybeSingle()
  const approved = profile?.status === 'active'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">CV Services</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Membership of the HHT network is complimentary. These optional services are for approved
          members who would like their CV professionally presented. They have no effect on admission
          or on how your profile is shown to employers.
        </p>
      </div>

      {!approved ? (
        <Card className="animate-fade-up border-border bg-card">
          <CardContent className="flex items-start gap-4 p-6">
            <Lock className="mt-0.5 h-5 w-5 shrink-0 text-[#9B7B3C]" />
            <div>
              <h2 className="font-medium text-white">Available once you are HHT Approved</h2>
              <p className="mt-1 text-sm text-neutral-400">
                CV services are offered after our team has reviewed and accepted your application.
                We will let you know as soon as your profile is approved.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {CV_SERVICES.map((svc, i) => (
            <Card
              key={svc.name}
              className="card-lift animate-fade-up border-border bg-card"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <CardContent className="flex h-full flex-col p-6 sm:p-8">
                <div className="flex items-center gap-2 text-[#9B7B3C]">
                  <FileText className="h-5 w-5" />
                  <span className="text-xs font-medium uppercase tracking-widest">Optional service</span>
                </div>
                <h2 className="mt-4 font-heading text-2xl text-white">{svc.name}</h2>
                <p className="mt-1 font-heading text-3xl text-[#C9A45C]">{svc.price}</p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">{svc.summary}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {svc.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-neutral-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#9B7B3C]" />
                      {p}
                    </li>
                  ))}
                </ul>
                <a
                  href={`mailto:hello@householdtalent.com?subject=${encodeURIComponent(`${svc.name} request`)}`}
                  className="btn-gold mt-6 rounded-md px-5 py-2.5 text-center text-sm"
                >
                  Request {svc.name}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-neutral-500">
        Once a completed CV has been delivered, the fee is not refundable. This does not affect your
        statutory consumer rights.
      </p>
    </div>
  )
}

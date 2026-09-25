'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, MapPin, UserPlus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { IntroductionRequestModal } from '@/components/introduction-request-modal'
import { LOCATIONS, AVAILABILITY_LABELS } from '@/lib/constants'
import type { EmployerCandidateCard } from '@/lib/candidates/employer-view'

function locationLabel(value: string | null) {
  if (!value) return 'Location on request'
  return LOCATIONS.find((l) => l.value === value)?.label || value
}

export function SavedList({ initial }: { initial: EmployerCandidateCard[] }) {
  const [cards, setCards] = useState(initial)
  const [intro, setIntro] = useState<{ id: string; name: string } | null>(null)

  async function remove(id: string) {
    const previous = cards
    setCards((c) => c.filter((x) => x.id !== id))
    const res = await fetch(`/api/employer/saved?candidate_id=${id}`, { method: 'DELETE' }).catch(() => null)
    if (!res || !res.ok) setCards(previous)
  }

  if (cards.length === 0) {
    return (
      <Card className="animate-fade-up border-border bg-card">
        <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
          <div className="rounded-full bg-muted p-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-xl font-semibold text-white">No saved candidates yet</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Tap the heart on any profile in the HHT network to keep it here for quick comparison.
          </p>
          <Link href="/dashboard/employer/search" className="btn-gold mt-2 rounded-md px-6 py-2 text-sm">
            Browse the network
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => {
          const last = c.initials.slice(-1)
          const label = last ? `${c.salutation || 'Mx'}. ${last}.` : c.headline || 'Candidate'
          return (
            <Card
              key={c.id}
              className="card-lift animate-fade-up border-border bg-card"
              style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#9B7B3C]/15 text-sm font-bold text-[#9B7B3C]">
                    {c.initials || 'C'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-white">{c.headline || label}</h3>
                    <p className="truncate text-xs text-[#9B7B3C]">{label}</p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-neutral-400">
                      <MapPin className="h-3.5 w-3.5" /> {locationLabel(c.location)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    aria-label="Remove from saved"
                    className="rounded-md p-1.5 text-[#9B7B3C] transition-colors hover:bg-[#9B7B3C]/10"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
                  {c.experience_years ? <span>{c.experience_years}+ years exp.</span> : <span />}
                  {c.availability && <span>{AVAILABILITY_LABELS[c.availability] || c.availability}</span>}
                </div>
                <button
                  type="button"
                  onClick={() => setIntro({ id: c.id, name: label })}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#9B7B3C] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#9B7B3C]/90"
                >
                  <UserPlus className="h-4 w-4" /> Request Introduction
                </button>
              </CardContent>
            </Card>
          )
        })}
      </div>
      {intro && (
        <IntroductionRequestModal
          candidateId={intro.id}
          candidateName={intro.name}
          isOpen
          onClose={() => setIntro(null)}
        />
      )}
    </>
  )
}

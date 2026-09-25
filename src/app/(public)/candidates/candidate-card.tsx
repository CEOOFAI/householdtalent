'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Lock, Eye, X } from 'lucide-react'
import type { PublicCandidate } from './types'

export function CandidateCard({ candidate }: { candidate: PublicCandidate }) {
  const [showPopup, setShowPopup] = useState(false)
  const initials = candidate.displayName.split(' ').map(s => s.charAt(0)).join('').slice(0, 2).toUpperCase()

  return (
    <>
      <div className="group rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 transition-all hover:border-[#9B7B3C]/30 hover:shadow-[0_0_30px_rgba(212,160,18,0.05)]">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          {candidate.photo ? (
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-[#9B7B3C]/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={candidate.photo}
                alt=""
                className="h-full w-full object-cover"
                style={{ filter: 'blur(8px)', transform: 'scale(1.15)' }}
              />
            </div>
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#9B7B3C]/10 text-sm font-bold text-[#9B7B3C]">
              {initials}
            </div>
          )}
          <div>
            <h3 className="font-heading text-lg font-semibold text-[#9B7B3C]">
              {candidate.displayName}
            </h3>
            <p className="text-sm text-neutral-400">
              {candidate.headline} | {candidate.location}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-neutral-800" />

        {/* Snapshot */}
        <p className="text-sm leading-relaxed text-neutral-300 line-clamp-3">
          {candidate.bio}
        </p>

        {/* Skills */}
        {candidate.skills.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#9B7B3C]/70">
              Key Skills
            </p>
            <ul className="space-y-1">
              {candidate.skills.map(skill => (
                <li key={skill} className="flex items-center gap-2 text-sm text-neutral-400">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-[#9B7B3C]" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Availability */}
        <p className="mt-4 text-xs text-neutral-500">{candidate.availability}</p>

        {/* Locked CTA */}
        <button
          onClick={() => setShowPopup(true)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800/50 px-4 py-2.5 text-sm font-medium text-neutral-300 transition-all hover:border-[#9B7B3C]/50 hover:text-[#9B7B3C]"
        >
          <Lock className="h-3.5 w-3.5" />
          View Full Profile
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-8 text-center shadow-2xl">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute right-4 top-4 text-neutral-500 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#9B7B3C]/10">
              <Eye className="h-6 w-6 text-[#9B7B3C]" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white">
              Full profiles are shared privately with registered employers.
            </h3>
            <p className="mt-3 text-sm text-neutral-400">
              Submit a role brief to browse the HHT Approved network and request an introduction. HHT facilitates every connection, with the candidate&apos;s consent.
            </p>
            <Link
              href="/register/employer"
              className="mt-6 inline-block rounded-lg bg-[#9B7B3C] px-8 py-3 text-sm font-medium text-black transition-colors hover:bg-[#7B6535]"
            >
              Submit a Role Brief
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

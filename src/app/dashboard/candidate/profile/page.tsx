'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LANGUAGES, SKILL_CATEGORIES, LANGUAGE_PROFICIENCY_LEVELS } from '@/lib/constants'
import { Card, CardContent } from '@/components/ui/card'
import {
  User,
  Briefcase,
  SlidersHorizontal,
  Crown,
  ClipboardCheck,
  ArrowLeft,
  ArrowRight,
  Upload,
  Camera,
  Check,
  Star,
  Loader2,
  ChevronDown,
  Plus,
  X,
  FileText,
  Car,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

/* ─── Types ─── */

type Step = 1 | 2 | 3 | 4 | 5 | 'success'
type ProfileType = 'standard' | 'premium' | null

interface FormState {
  // Step 1
  fullName: string
  email: string
  phone: string
  location: string
  nationality: string
  rightToWork: boolean | null
  drivingLicence: string
  photoFile: File | null
  photoPreview: string | null
  cvFile: File | null
  cvFileName: string | null
  jobTitle: string
  jobTitleOther: string

  // Step 2
  yearsExperience: string
  aboutYou: string
  previousRoles: string
  skills: string[]
  customSkill: string
  languages: string[]
  languageOther: string

  // Step 3
  livePreference: 'live_in' | 'live_out' | null
  schedulePreference: 'full_time' | 'part_time' | 'temporary' | null
  salaryMin: string
  salaryMax: string
  availableFrom: string

  // Step 4
  profileType: ProfileType

  // Step 5
  agreedToTerms: boolean
}

const INITIAL_FORM: FormState = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  nationality: '',
  rightToWork: null,
  drivingLicence: '',
  photoFile: null,
  photoPreview: null,
  cvFile: null,
  cvFileName: null,
  jobTitle: '',
  jobTitleOther: '',
  yearsExperience: '',
  aboutYou: '',
  previousRoles: '',
  skills: [],
  customSkill: '',
  languages: [],
  languageOther: '',
  livePreference: null,
  schedulePreference: null,
  salaryMin: '',
  salaryMax: '',
  availableFrom: '',
  profileType: null,
  agreedToTerms: false,
}

const DRIVING_LICENCE_OPTIONS = [
  { value: '', label: 'Select...' },
  { value: 'none', label: 'No licence' },
  { value: 'car', label: 'Car' },
  { value: 'car_clean', label: 'Car (clean record)' },
  { value: 'car_motorcycle', label: 'Car + Motorcycle' },
  { value: 'professional', label: 'Professional / Chauffeur' },
] as const

/* ─── Constants ─── */

const JOB_TITLES = [
  'Housekeeper',
  'Nanny',
  'Butler',
  'Chef',
  'Personal Assistant',
  'Chauffeur',
  'House Manager',
  'Estate Manager',
  'Security',
  'Gardener',
  'Elder Care',
  'Other',
] as const

const EXPERIENCE_OPTIONS = [
  'Less than 1 year',
  '1-2 years',
  '3-5 years',
  '5-10 years',
  '10+ years',
] as const

/* SKILL_CATEGORIES imported from @/lib/constants */

const STEP_META = [
  { num: 1, label: 'Basic Profile', icon: User },
  { num: 2, label: 'Experience', icon: Briefcase },
  { num: 3, label: 'Preferences', icon: SlidersHorizontal },
  { num: 4, label: 'Profile Type', icon: Crown },
  { num: 5, label: 'Review', icon: ClipboardCheck },
] as const

/* ─── Helper Components ─── */

function ProgressBar({ currentStep }: { currentStep: Step }) {
  const stepNum = typeof currentStep === 'number' ? currentStep : 5
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        {STEP_META.map((s, i) => {
          const isActive = stepNum === s.num
          const isCompleted = stepNum > s.num
          const Icon = s.icon
          return (
            <div key={s.num} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors sm:h-10 sm:w-10 ${
                    isActive
                      ? 'border-[#9B7B3C] bg-[#9B7B3C] text-black'
                      : isCompleted
                        ? 'border-[#9B7B3C] bg-[#9B7B3C]/20 text-[#9B7B3C]'
                        : 'border-neutral-700 bg-neutral-900 text-neutral-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  ) : (
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  )}
                </div>
                <span
                  className={`hidden text-xs sm:block ${
                    isActive
                      ? 'font-medium text-[#9B7B3C]'
                      : isCompleted
                        ? 'text-neutral-400'
                        : 'text-neutral-600'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEP_META.length - 1 && (
                <div
                  className={`mx-2 h-px flex-1 ${
                    stepNum > s.num ? 'bg-[#9B7B3C]/40' : 'bg-neutral-800'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">
      {children}
    </h3>
  )
}

function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode
  htmlFor?: string
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-neutral-300"
    >
      {children}
    </label>
  )
}

function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  id: string
  value: string
  onChange: (val: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
    />
  )
}

function ToggleGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[]
  value: string | null
  onChange: (val: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            value === opt.value
              ? 'border-[#9B7B3C] bg-[#9B7B3C]/10 text-[#9B7B3C]'
              : 'border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-neutral-600'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function NavButtons({
  step,
  onBack,
  onNext,
  nextLabel = 'Continue',
  nextDisabled = false,
}: {
  step: number
  onBack: () => void
  onNext: () => void
  nextLabel?: string
  nextDisabled?: boolean
}) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-neutral-800 pt-6">
      {step > 1 ? (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-600 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      ) : (
        <Link
          href="/dashboard/candidate"
          className="flex items-center gap-2 rounded-lg border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-600 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="flex items-center gap-2 rounded-lg bg-[#9B7B3C] px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#9B7B3C]/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {nextLabel}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}

/* ─── Main Component ─── */

export default function CandidateProfilePage() {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hasExistingProfile, setHasExistingProfile] = useState(false)
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cvInputRef = useRef<HTMLInputElement>(null)

  // Load existing profile + candidate_profile data so candidates with saved
  // profiles see their values pre-filled instead of a blank wizard.
  useEffect(() => {
    let cancelled = false
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        if (!cancelled) setLoading(false)
        return
      }

      const [{ data: profile }, { data: candidate }] = await Promise.all([
        supabase.from('profiles').select('first_name, last_name, email, phone').eq('id', user.id).maybeSingle(),
        supabase.from('candidate_profiles')
          .select('full_name, email, phone, location, nationality, right_to_work, driving_licence, photos, cv_url, roles, experience_years, bio, previous_roles, skills, languages, live_preference, schedule_preference, salary_min, salary_max, available_from, tier, status, public_listing_consent')
          .eq('user_id', user.id)
          .maybeSingle(),
      ])

      if (cancelled) return

      if (candidate) {
        setHasExistingProfile(true)
        const fullName = candidate.full_name
          || [profile?.first_name, profile?.last_name].filter(Boolean).join(' ')
        const yearsMap: Record<number, string> = {
          0: 'Less than 1 year',
          1: '1-2 years',
          2: '1-2 years',
          3: '3-5 years',
          4: '3-5 years',
          5: '5-10 years',
        }
        const yearsLabel = candidate.experience_years == null
          ? ''
          : (candidate.experience_years >= 10
            ? '10+ years'
            : (yearsMap[candidate.experience_years] || `${candidate.experience_years} years`))

        setForm((prev) => ({
          ...prev,
          fullName: fullName || '',
          email: candidate.email || profile?.email || '',
          phone: candidate.phone || profile?.phone || '',
          location: candidate.location || '',
          nationality: candidate.nationality || '',
          rightToWork: candidate.right_to_work === 'yes' ? true : candidate.right_to_work === 'no' ? false : null,
          drivingLicence: candidate.driving_licence || '',
          jobTitle: (candidate.roles && candidate.roles[0]) || '',
          yearsExperience: yearsLabel,
          aboutYou: candidate.bio || '',
          previousRoles: candidate.previous_roles || '',
          skills: candidate.skills || [],
          languages: candidate.languages || [],
          livePreference: (candidate.live_preference as 'live_in' | 'live_out' | null) || null,
          schedulePreference: (candidate.schedule_preference as 'full_time' | 'part_time' | 'temporary' | null) || null,
          salaryMin: candidate.salary_min != null ? String(candidate.salary_min) : '',
          salaryMax: candidate.salary_max != null ? String(candidate.salary_max) : '',
          availableFrom: candidate.available_from || '',
          profileType: (candidate.tier === 'recommended' || candidate.tier === 'complete') ? 'premium' : 'standard',
          agreedToTerms: !!candidate.public_listing_consent,
          photoPreview: (candidate.photos && candidate.photos[0]) || null,
          cvFileName: candidate.cv_url ? 'Existing CV uploaded' : null,
        }))
      } else if (profile) {
        setForm((prev) => ({
          ...prev,
          fullName: [profile.first_name, profile.last_name].filter(Boolean).join(' '),
          email: profile.email || '',
          phone: profile.phone || '',
        }))
      }
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function toggleSkill(skill: string) {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }))
  }

  function toggleLanguage(lang: string) {
    setForm((prev) => {
      // Check if this language is already selected (with any proficiency)
      const existing = prev.languages.find(
        (l) => l === lang || l.startsWith(`${lang} (`)
      )
      if (existing) {
        return {
          ...prev,
          languages: prev.languages.filter((l) => l !== existing),
        }
      }
      // Add with default "Fluent" proficiency
      return {
        ...prev,
        languages: [...prev.languages, `${lang} (Fluent)`],
      }
    })
  }

  function getLanguageProficiency(lang: string): string {
    const entry = form.languages.find(
      (l) => l === lang || l.startsWith(`${lang} (`)
    )
    if (!entry) return ''
    const match = entry.match(/\(([^)]+)\)/)
    return match ? match[1] : 'Fluent'
  }

  function isLanguageSelected(lang: string): boolean {
    return form.languages.some((l) => l === lang || l.startsWith(`${lang} (`))
  }

  function setLanguageProficiency(lang: string, level: string) {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.map((l) =>
        l === lang || l.startsWith(`${lang} (`) ? `${lang} (${level})` : l
      ),
    }))
  }

  function toggleCategory(categoryId: string) {
    setOpenCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId)
      }
      // Keep max 2 open at a time
      const next = [...prev, categoryId]
      if (next.length > 2) next.shift()
      return next
    })
  }

  function countSelectedInCategory(skills: readonly string[]): number {
    return skills.filter((s) => form.skills.includes(s)).length
  }

  function addCustomSkill() {
    const trimmed = form.customSkill.trim()
    if (!trimmed || form.skills.includes(trimmed)) return
    setForm((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
      customSkill: '',
    }))
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Photo must be under 5MB')
      return
    }
    update('photoFile', file)
    const reader = new FileReader()
    reader.onload = (ev) => {
      update('photoPreview', ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  function handleCvChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      toast.error('CV must be under 10MB')
      return
    }
    update('cvFile', file)
    update('cvFileName', file.name)
  }

  function goNext() {
    if (typeof step === 'number' && step < 5) {
      setStep((step + 1) as Step)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function goBack() {
    if (typeof step === 'number' && step > 1) {
      setStep((step - 1) as Step)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  async function handleSubmit() {
    if (!form.agreedToTerms) return
    setSubmitting(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error('You need to be logged in to create a profile.')
        setSubmitting(false)
        return
      }

      const jobTitle =
        form.jobTitle === 'Other' ? form.jobTitleOther : form.jobTitle

      // Upload photo to candidate-photos bucket if provided
      let photoUrl: string | null = null
      if (form.photoFile) {
        const ext = form.photoFile.name.split('.').pop() || 'jpg'
        const path = `${user.id}/photo-${Date.now()}.${ext}`
        const { error: uploadErr } = await supabase.storage
          .from('candidate-photos')
          .upload(path, form.photoFile, { upsert: true })
        if (!uploadErr) {
          const { data: urlData } = supabase.storage
            .from('candidate-photos')
            .getPublicUrl(path)
          photoUrl = urlData.publicUrl
        } else {
          console.error('Photo upload failed:', uploadErr)
          toast.error('Photo upload failed but profile will still save')
        }
      }

      // Upload CV to resumes bucket if provided
      let cvUrl: string | null = null
      if (form.cvFile) {
        const ext = form.cvFile.name.split('.').pop() || 'pdf'
        const path = `${user.id}/cv-${Date.now()}.${ext}`
        const { error: cvErr } = await supabase.storage
          .from('resumes')
          .upload(path, form.cvFile, { upsert: true })
        if (!cvErr) {
          const { data: urlData } = supabase.storage
            .from('resumes')
            .getPublicUrl(path)
          cvUrl = urlData.publicUrl
        } else {
          console.error('CV upload failed:', cvErr)
          toast.error('CV upload failed but profile will still save')
        }
      }

      // Bio is the candidate's own personal intro. All structured data lives
      // in dedicated columns now.
      const bio = form.aboutYou ? form.aboutYou.trim() : null

      // Map availability enum
      let availability: string | null = null
      if (form.availableFrom) {
        const days = (new Date(form.availableFrom).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        availability = days <= 30 ? 'immediate' : days <= 60 ? '1_month' : '3_months'
      }

      // Also update profile fields on the profiles table
      const firstName = form.fullName.split(' ')[0] || ''
      const lastName = form.fullName.split(' ').slice(1).join(' ') || ''
      await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: form.phone || null,
        })
        .eq('id', user.id)

      // Normalize location to enum value (user types free text)
      const LOC_ENUMS = ['gibraltar','marbella','estepona','sotogrande','san_roque','la_linea','manilva','casares','benahavis','fuengirola','mijas','other']
      const rawLoc = (form.location || '').toLowerCase().trim().replace(/\s+/g, '_').replace(/-/g, '_')
      const normalizedLocation = LOC_ENUMS.find(v => rawLoc === v || rawLoc.includes(v) || v.includes(rawLoc)) || 'other'

      const payload: Record<string, unknown> = {
        location: normalizedLocation,
        headline: jobTitle,
        bio,
        roles: [jobTitle],
        experience_years: form.yearsExperience ? parseInt(String(form.yearsExperience)) : null,
        skills: form.skills,
        languages: form.languages,
        availability: availability,
        salary_expectation_min: form.salaryMin ? parseInt(form.salaryMin) : null,
        salary_expectation_max: form.salaryMax ? parseInt(form.salaryMax) : null,
        driving_licence: form.drivingLicence || null,
        nationality: form.nationality || null,
        right_to_work: form.rightToWork === true ? 'yes' : form.rightToWork === false ? 'no' : null,
        previous_roles: form.previousRoles || null,
        live_preference: form.livePreference || null,
        schedule_preference: form.schedulePreference || null,
        available_from: form.availableFrom || null,
        tier: form.profileType === 'premium' ? 'premium' : 'free',
        status: 'pending_review',
      }
      if (photoUrl) payload.photos = [photoUrl]
      if (cvUrl) payload.cv_url = cvUrl

      // Check if profile exists (should exist from signup trigger)
      const { data: existing } = await supabase
        .from('candidate_profiles')
        .select('id, slug')
        .eq('user_id', user.id)
        .maybeSingle()

      let error
      if (existing) {
        // UPDATE existing row
        const result = await supabase
          .from('candidate_profiles')
          .update(payload)
          .eq('user_id', user.id)
        error = result.error
      } else {
        // INSERT new row with generated slug
        const slug = `${firstName}-${lastName}-${Date.now()}`
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
        const result = await supabase
          .from('candidate_profiles')
          .insert({ ...payload, user_id: user.id, slug })
        error = result.error
      }

      if (error) {
        toast.error('Something went wrong. Please try again.')
        console.error(error)
        setSubmitting(false)
        return
      }

      setStep('success')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  /* ─── Success Screen ─── */

  if (step === 'success') {
    const isPremium = form.profileType === 'premium'
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#9B7B3C]/20">
          <Check className="h-8 w-8 text-[#9B7B3C]" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-white">
          Profile submitted
        </h1>
        <p className="mt-3 text-neutral-400">
          Thanks. Our team will personally review your profile within 24 hours.
          We&apos;ll be in touch as soon as it&apos;s approved.
        </p>
        {isPremium && (
          <p className="mt-2 text-sm text-[#9B7B3C]">
            Your Premium profile will be prioritised for employers once live.
          </p>
        )}

        {!isPremium && (
          <Card className="mx-auto mt-8 max-w-sm border-[#9B7B3C]/30 bg-[#9B7B3C]/5">
            <CardContent className="p-6 text-center">
              <Crown className="mx-auto mb-3 h-6 w-6 text-[#9B7B3C]" />
              <p className="text-sm font-medium text-white">
                Upgrade to Premium
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                Gold-highlighted profile, increased visibility, and a
                professionally structured CV.
              </p>
              <button
                onClick={() =>
                  toast.info(
                    'Stripe checkout coming soon. Contact us to upgrade your profile.',
                    { duration: 5000 }
                  )
                }
                className="mt-4 rounded-lg bg-[#9B7B3C] px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-[#9B7B3C]/90"
              >
                Upgrade to Premium
              </button>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/dashboard/candidate/opportunities"
            className="rounded-lg bg-[#9B7B3C] px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#9B7B3C]/90"
          >
            Browse Roles
          </Link>
          {!isPremium && (
            <Link
              href="/dashboard/candidate/subscription"
              className="rounded-lg border border-neutral-700 px-6 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-600 hover:text-white"
            >
              Complete Profile
            </Link>
          )}
        </div>
      </div>
    )
  }

  /* ─── Wizard Steps ─── */

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-[#9B7B3C]" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-white">
          {hasExistingProfile ? 'Your Profile' : 'Create Your Profile'}
        </h1>
        <p className="mt-1 text-neutral-400">
          {hasExistingProfile
            ? 'Review and update your professional profile.'
            : 'Complete each step to build your professional profile.'}
        </p>
      </div>

      <ProgressBar currentStep={step} />

      {/* ─── STEP 1: Basic Profile ─── */}
      {step === 1 && (
        <div className="space-y-6">
          <SectionHeading>Basic Profile</SectionHeading>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
              <TextInput
                id="fullName"
                value={form.fullName}
                onChange={(v) => update('fullName', v)}
                placeholder="Your full name"
              />
            </div>
            <div>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <TextInput
                id="email"
                type="email"
                value={form.email}
                onChange={(v) => update('email', v)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <FieldLabel htmlFor="phone">Phone</FieldLabel>
              <TextInput
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(v) => update('phone', v)}
                placeholder="+350 1234 5678"
              />
            </div>
            <div>
              <FieldLabel htmlFor="location">Location / City / Area</FieldLabel>
              <TextInput
                id="location"
                value={form.location}
                onChange={(v) => update('location', v)}
                placeholder="e.g. Gibraltar, Marbella"
              />
            </div>
            <div>
              <FieldLabel htmlFor="nationality">Nationality</FieldLabel>
              <TextInput
                id="nationality"
                value={form.nationality}
                onChange={(v) => update('nationality', v)}
                placeholder="e.g. British"
              />
            </div>
            <div>
              <FieldLabel>Right to Work</FieldLabel>
              <ToggleGroup
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                ]}
                value={
                  form.rightToWork === true
                    ? 'yes'
                    : form.rightToWork === false
                      ? 'no'
                      : null
                }
                onChange={(v) => update('rightToWork', v === 'yes')}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="drivingLicence">
                <span className="inline-flex items-center gap-1.5">
                  <Car className="h-3.5 w-3.5" />
                  Driving Licence
                </span>
              </FieldLabel>
              <select
                id="drivingLicence"
                value={form.drivingLicence}
                onChange={(e) => update('drivingLicence', e.target.value)}
                className="h-10 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 text-sm text-white outline-none transition-colors focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
              >
                {DRIVING_LICENCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <FieldLabel>Profile Photo</FieldLabel>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-neutral-700 bg-neutral-900 transition-colors hover:border-[#9B7B3C]/50"
              >
                {form.photoPreview ? (
                  <img
                    src={form.photoPreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Camera className="h-6 w-6 text-neutral-500 group-hover:text-[#9B7B3C]" />
                )}
              </button>
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-sm font-medium text-[#9B7B3C] transition-colors hover:text-[#9B7B3C]/80"
                >
                  <Upload className="h-4 w-4" />
                  {form.photoPreview ? 'Change photo' : 'Upload photo'}
                </button>
                <p className="mt-1 text-xs text-neutral-500">
                  JPG or PNG, max 5MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <p className="mt-3 rounded-lg border border-neutral-800 bg-neutral-900/50 p-3 text-xs leading-relaxed text-neutral-400">
              <span className="text-[#9B7B3C]">Privacy note:</span> Your photo
              will be blurred on public profiles. Full photo only revealed to
              verified employers after our team approves an introduction.
            </p>
          </div>

          {/* CV Upload */}
          <div>
            <FieldLabel>
              <span className="inline-flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                CV / Resume
              </span>
            </FieldLabel>
            <button
              type="button"
              onClick={() => cvInputRef.current?.click()}
              className="flex w-full items-center justify-between gap-3 rounded-lg border border-dashed border-neutral-700 bg-neutral-900 px-4 py-3 text-left transition-colors hover:border-[#9B7B3C]/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800">
                  <FileText className="h-5 w-5 text-neutral-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {form.cvFileName || 'Submit your CV'}
                  </p>
                  <p className="text-xs text-neutral-500">
                    PDF or Word doc, max 10MB
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-sm font-medium text-[#9B7B3C]">
                <Upload className="h-4 w-4" />
                {form.cvFileName ? 'Change' : 'Upload'}
              </span>
            </button>
            <input
              ref={cvInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleCvChange}
              className="hidden"
            />
          </div>

          {/* Job Title */}
          <div>
            <FieldLabel htmlFor="jobTitle">Job Title</FieldLabel>
            <select
              id="jobTitle"
              value={form.jobTitle}
              onChange={(e) => update('jobTitle', e.target.value)}
              className="h-10 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 text-sm text-white outline-none transition-colors focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
            >
              <option value="" disabled>
                Select a role
              </option>
              {JOB_TITLES.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
            {form.jobTitle === 'Other' && (
              <div className="mt-3">
                <TextInput
                  id="jobTitleOther"
                  value={form.jobTitleOther}
                  onChange={(v) => update('jobTitleOther', v)}
                  placeholder="Enter your job title"
                />
              </div>
            )}
          </div>

          <NavButtons step={1} onBack={goBack} onNext={goNext} />
        </div>
      )}

      {/* ─── STEP 2: Experience & Skills ─── */}
      {step === 2 && (
        <div className="space-y-8">
          {/* About / Intro */}
          <div>
            <SectionHeading>About You</SectionHeading>
            <FieldLabel htmlFor="aboutYou">
              Tell us about yourself
            </FieldLabel>
            <textarea
              id="aboutYou"
              rows={5}
              value={form.aboutYou}
              onChange={(e) => update('aboutYou', e.target.value)}
              placeholder="A short introduction in your own words. What you bring, what you love about household work, the kind of family you want to work with."
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
            />
            <p className="mt-1.5 text-xs text-neutral-500">
              Real and personal beats polished. Employers can see this once
              we&apos;ve approved an introduction.
            </p>
          </div>

          {/* Experience */}
          <div>
            <SectionHeading>Experience</SectionHeading>
            <div className="space-y-5">
              <div>
                <FieldLabel htmlFor="yearsExperience">
                  Years of Experience
                </FieldLabel>
                <select
                  id="yearsExperience"
                  value={form.yearsExperience}
                  onChange={(e) => update('yearsExperience', e.target.value)}
                  className="h-10 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 text-sm text-white outline-none transition-colors focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
                >
                  <option value="" disabled>
                    Select experience
                  </option>
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="previousRoles">Previous Roles</FieldLabel>
                <textarea
                  id="previousRoles"
                  rows={3}
                  value={form.previousRoles}
                  onChange={(e) => update('previousRoles', e.target.value)}
                  placeholder="Brief summary of your most recent roles"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
                />
              </div>
            </div>
          </div>

          {/* Skills - Accordion */}
          <div>
            <SectionHeading>Skills</SectionHeading>
            <p className="mb-4 text-xs text-neutral-500">
              Select all skills that apply. {form.skills.length > 0 && (
                <span className="text-[#9B7B3C]">{form.skills.length} selected</span>
              )}
            </p>
            <div className="space-y-2">
              {SKILL_CATEGORIES.map((category) => {
                const isOpen = openCategories.includes(category.id)
                const selectedCount = countSelectedInCategory(category.skills)
                return (
                  <div
                    key={category.id}
                    className="overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900"
                  >
                    <button
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-neutral-800/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-white">
                          {category.label}
                        </span>
                        {selectedCount > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#9B7B3C] px-1.5 text-xs font-semibold text-black">
                            {selectedCount}
                          </span>
                        )}
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-neutral-800 p-4 pt-3">
                        <div className="flex flex-wrap gap-2">
                          {category.skills.map((skill) => {
                            const selected = form.skills.includes(skill)
                            return (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => toggleSkill(skill)}
                                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                                  selected
                                    ? 'border-[#9B7B3C] bg-[#9B7B3C]/10 text-[#9B7B3C]'
                                    : 'border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-neutral-600'
                                }`}
                              >
                                {selected && (
                                  <Check className="mr-1.5 inline h-3 w-3" />
                                )}
                                {skill}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Custom Skill Input */}
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-neutral-500">
                Don&apos;t see your skill? Add it below.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.customSkill}
                  onChange={(e) => update('customSkill', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCustomSkill()
                    }
                  }}
                  placeholder="Type a custom skill"
                  className="h-10 flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  disabled={!form.customSkill.trim()}
                  className="flex h-10 items-center gap-1.5 rounded-lg border border-neutral-700 px-4 text-sm font-medium text-neutral-400 transition-colors hover:border-neutral-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
              </div>
              {/* Show custom skills (ones not in any category) */}
              {(() => {
                const allCategorySkills: string[] = SKILL_CATEGORIES.flatMap((c) => [...c.skills])
                const customSkills = form.skills.filter(
                  (s) => !allCategorySkills.includes(s)
                )
                if (customSkills.length === 0) return null
                return (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {customSkills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-1.5 rounded-lg border border-[#9B7B3C] bg-[#9B7B3C]/10 px-3 py-1.5 text-sm text-[#9B7B3C]"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className="hover:text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )
              })()}
            </div>
          </div>

          {/* Languages with Proficiency */}
          <div>
            <SectionHeading>Languages</SectionHeading>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.filter((l) => l !== 'Other').map((lang) => {
                  const selected = isLanguageSelected(lang)
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                        selected
                          ? 'border-[#9B7B3C] bg-[#9B7B3C]/10 text-[#9B7B3C]'
                          : 'border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-neutral-600'
                      }`}
                    >
                      {selected && <Check className="mr-1.5 inline h-3 w-3" />}
                      {lang}
                    </button>
                  )
                })}
              </div>

              {/* Proficiency selectors for chosen languages */}
              {form.languages.length > 0 && (
                <div className="mt-3 space-y-2 rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
                  <p className="mb-2 text-xs font-medium text-neutral-500">
                    Set proficiency level
                  </p>
                  {form.languages.map((entry) => {
                    const langName = entry.replace(/\s*\([^)]*\)$/, '')
                    const currentLevel = getLanguageProficiency(langName)
                    return (
                      <div
                        key={entry}
                        className="flex items-center justify-between gap-3"
                      >
                        <span className="text-sm text-white">{langName}</span>
                        <select
                          value={currentLevel}
                          onChange={(e) =>
                            setLanguageProficiency(langName, e.target.value)
                          }
                          className="h-8 rounded-md border border-neutral-700 bg-neutral-900 px-2 text-xs text-white outline-none transition-colors focus:border-[#9B7B3C]"
                        >
                          {LANGUAGE_PROFICIENCY_LEVELS.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Other language input */}
              <div className="mt-2">
                <p className="mb-2 text-xs font-medium text-neutral-500">
                  Other language
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.languageOther}
                    onChange={(e) => update('languageOther', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const trimmed = form.languageOther.trim()
                        if (trimmed && !isLanguageSelected(trimmed)) {
                          setForm((prev) => ({
                            ...prev,
                            languages: [...prev.languages, `${trimmed} (Fluent)`],
                            languageOther: '',
                          }))
                        }
                      }
                    }}
                    placeholder="Type a language and press Enter"
                    className="h-10 flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = form.languageOther.trim()
                      if (trimmed && !isLanguageSelected(trimmed)) {
                        setForm((prev) => ({
                          ...prev,
                          languages: [...prev.languages, `${trimmed} (Fluent)`],
                          languageOther: '',
                        }))
                      }
                    }}
                    disabled={!form.languageOther.trim()}
                    className="flex h-10 items-center gap-1.5 rounded-lg border border-neutral-700 px-4 text-sm font-medium text-neutral-400 transition-colors hover:border-neutral-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <NavButtons step={2} onBack={goBack} onNext={goNext} />
        </div>
      )}

      {/* ─── STEP 3: Preferences ─── */}
      {step === 3 && (
        <div className="space-y-6">
          <SectionHeading>Preferences</SectionHeading>

          <div>
            <FieldLabel>Living Arrangement</FieldLabel>
            <ToggleGroup
              options={[
                { value: 'live_in', label: 'Live-in' },
                { value: 'live_out', label: 'Live-out' },
              ]}
              value={form.livePreference}
              onChange={(v) =>
                update('livePreference', v as 'live_in' | 'live_out')
              }
            />
          </div>

          <div>
            <FieldLabel>Schedule</FieldLabel>
            <ToggleGroup
              options={[
                { value: 'full_time', label: 'Full-time' },
                { value: 'part_time', label: 'Part-time' },
                { value: 'temporary', label: 'Temporary' },
              ]}
              value={form.schedulePreference}
              onChange={(v) =>
                update(
                  'schedulePreference',
                  v as 'full_time' | 'part_time' | 'temporary'
                )
              }
            />
          </div>

          <div>
            <FieldLabel>Salary Expectation (£ per annum)</FieldLabel>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <TextInput
                  id="salaryMin"
                  type="number"
                  value={form.salaryMin}
                  onChange={(v) => update('salaryMin', v)}
                  placeholder="Min"
                />
              </div>
              <div>
                <TextInput
                  id="salaryMax"
                  type="number"
                  value={form.salaryMax}
                  onChange={(v) => update('salaryMax', v)}
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="availableFrom">Available From</FieldLabel>
            <input
              id="availableFrom"
              type="date"
              value={form.availableFrom}
              onChange={(e) => update('availableFrom', e.target.value)}
              className="h-10 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 text-sm text-white outline-none transition-colors focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
            />
          </div>

          <NavButtons step={3} onBack={goBack} onNext={goNext} />
        </div>
      )}

      {/* ─── STEP 4: Profile Type ─── */}
      {step === 4 && (
        <div className="space-y-6">
          <SectionHeading>Choose Your Profile</SectionHeading>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Standard */}
            <Card
              className={`cursor-pointer border-neutral-700 bg-neutral-900 transition-all hover:border-neutral-600 ${
                form.profileType === 'standard'
                  ? 'ring-2 ring-neutral-500'
                  : ''
              }`}
              onClick={() => update('profileType', 'standard')}
            >
              <CardContent className="p-6">
                <div className="mb-3 inline-flex rounded-lg bg-neutral-800 p-2 text-neutral-400">
                  <Star className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-white">
                  Standard Profile
                </h3>
                <p className="mt-1 text-2xl font-bold text-neutral-300">Free</p>

                <ul className="mt-4 space-y-2.5">
                  {[
                    'Basic profile visible',
                    'Apply to roles',
                    'Limited visibility',
                  ].map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-neutral-400"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    update('profileType', 'standard')
                    goNext()
                  }}
                  className={`mt-6 w-full rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                    form.profileType === 'standard'
                      ? 'border-neutral-500 bg-neutral-800 text-white'
                      : 'border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-white'
                  }`}
                >
                  Continue with Free
                </button>
              </CardContent>
            </Card>

            {/* Premium */}
            <Card
              className={`cursor-pointer border-[#9B7B3C]/40 bg-neutral-900 transition-all hover:border-[#9B7B3C]/60 ${
                form.profileType === 'premium'
                  ? 'ring-2 ring-[#9B7B3C]'
                  : ''
              }`}
              onClick={() => update('profileType', 'premium')}
            >
              <CardContent className="p-6">
                <div className="mb-3 inline-flex rounded-lg bg-[#9B7B3C]/10 p-2 text-[#9B7B3C]">
                  <Crown className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-white">
                  Premium Profile
                </h3>
                <p className="mt-1 text-2xl font-bold text-[#9B7B3C]">
                  £50{' '}
                  <span className="text-sm font-normal text-neutral-500">
                    / 3 months
                  </span>
                </p>

                <ul className="mt-4 space-y-2.5">
                  {[
                    'Enhanced profile with more detail',
                    'Gold-highlighted profile',
                    'Increased visibility to employers',
                    'Professionally structured CV',
                    'Downloadable CV',
                  ].map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-neutral-300"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#9B7B3C]" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-xs text-neutral-500">
                  A professionally structured profile ensures you are presented
                  at the highest standard.
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    update('profileType', 'premium')
                    toast.info(
                      'Stripe checkout coming soon. Contact us to upgrade your profile.',
                      { duration: 5000 }
                    )
                    goNext()
                  }}
                  className="mt-6 w-full rounded-lg bg-[#9B7B3C] px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#9B7B3C]/90"
                >
                  Upgrade to Premium
                </button>
              </CardContent>
            </Card>
          </div>

          <NavButtons
            step={4}
            onBack={goBack}
            onNext={goNext}
            nextDisabled={!form.profileType}
          />
        </div>
      )}

      {/* ─── STEP 5: Review & Go Live ─── */}
      {step === 5 && (
        <div className="space-y-6">
          <SectionHeading>Review Your Profile</SectionHeading>

          <Card className="border-neutral-700 bg-neutral-900">
            <CardContent className="divide-y divide-neutral-800 p-6">
              {/* Identity */}
              <div className="pb-5">
                <div className="flex items-center gap-4">
                  {form.photoPreview ? (
                    <img
                      src={form.photoPreview}
                      alt="Profile"
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800">
                      <User className="h-6 w-6 text-neutral-500" />
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {form.fullName || 'No name entered'}
                    </p>
                    <p className="text-sm text-[#9B7B3C]">
                      {form.jobTitle === 'Other'
                        ? form.jobTitleOther || 'No role specified'
                        : form.jobTitle || 'No role specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 py-5">
                <ReviewRow label="Email" value={form.email} />
                <ReviewRow label="Phone" value={form.phone} />
                <ReviewRow label="Location" value={form.location} />
                <ReviewRow label="Nationality" value={form.nationality} />
                <ReviewRow
                  label="Right to Work"
                  value={
                    form.rightToWork === true
                      ? 'Yes'
                      : form.rightToWork === false
                        ? 'No'
                        : 'Not specified'
                  }
                />
                <ReviewRow
                  label="Driving Licence"
                  value={
                    DRIVING_LICENCE_OPTIONS.find(
                      (o) => o.value === form.drivingLicence,
                    )?.label || 'Not specified'
                  }
                />
                <ReviewRow
                  label="CV"
                  value={form.cvFileName || 'Not uploaded'}
                />
              </div>

              {/* About + Experience */}
              <div className="space-y-3 py-5">
                {form.aboutYou && (
                  <div>
                    <p className="mb-1 text-xs text-neutral-500">About</p>
                    <p className="text-sm leading-relaxed text-white">
                      {form.aboutYou}
                    </p>
                  </div>
                )}
                <ReviewRow
                  label="Experience"
                  value={form.yearsExperience || 'Not specified'}
                />
                {form.previousRoles && (
                  <ReviewRow label="Previous Roles" value={form.previousRoles} />
                )}
              </div>

              {/* Skills */}
              {form.skills.length > 0 && (
                <div className="py-5">
                  <p className="mb-2 text-xs text-neutral-500">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {form.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-[#9B7B3C]/30 bg-[#9B7B3C]/10 px-2.5 py-0.5 text-xs text-[#9B7B3C]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {form.languages.length > 0 && (
                <div className="py-5">
                  <p className="mb-2 text-xs text-neutral-500">Languages</p>
                  <p className="text-sm text-white">
                    {form.languages.join(', ')}
                  </p>
                </div>
              )}

              {/* Preferences */}
              <div className="space-y-3 pt-5">
                <ReviewRow
                  label="Living"
                  value={
                    form.livePreference === 'live_in'
                      ? 'Live-in'
                      : form.livePreference === 'live_out'
                        ? 'Live-out'
                        : 'Not specified'
                  }
                />
                <ReviewRow
                  label="Schedule"
                  value={
                    form.schedulePreference
                      ? form.schedulePreference
                          .replace('_', '-')
                          .replace(/^\w/, (c) => c.toUpperCase())
                      : 'Not specified'
                  }
                />
                {(form.salaryMin || form.salaryMax) && (
                  <ReviewRow
                    label="Salary"
                    value={`£${Number(form.salaryMin || 0).toLocaleString()} - £${Number(form.salaryMax || 0).toLocaleString()} p.a.`}
                  />
                )}
                {form.availableFrom && (
                  <ReviewRow label="Available From" value={form.availableFrom} />
                )}
                <ReviewRow
                  label="Profile Type"
                  value={
                    form.profileType === 'premium'
                      ? 'Premium'
                      : 'Standard (Free)'
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Terms */}
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={form.agreedToTerms}
              onChange={(e) => update('agreedToTerms', e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-neutral-600 bg-neutral-900 text-[#9B7B3C] accent-[#9B7B3C]"
            />
            <span className="text-sm text-neutral-400">
              I agree to the{' '}
              <a
                href="/candidate-terms"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[#9B7B3C] underline hover:text-[#9B7B3C]/80"
              >
                Candidate Terms
              </a>{' '}
              &amp;{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[#9B7B3C] underline hover:text-[#9B7B3C]/80"
              >
                Privacy Policy
              </a>
            </span>
          </label>

          {/* Submit */}
          <div className="flex items-center justify-between border-t border-neutral-800 pt-6">
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-2 rounded-lg border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-600 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!form.agreedToTerms || submitting}
              className="flex items-center gap-2 rounded-lg bg-[#9B7B3C] px-8 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#9B7B3C]/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Profile'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Review Row ─── */

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <p className="shrink-0 text-xs text-neutral-500">{label}</p>
      <p className="text-right text-sm text-white">{value}</p>
    </div>
  )
}

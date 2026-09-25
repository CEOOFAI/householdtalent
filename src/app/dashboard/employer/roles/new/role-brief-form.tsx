'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Loader2,
  ChevronRight,
  ChevronLeft,
  FileText,
  CheckCircle2,
  Briefcase,
  ClipboardList,
  CreditCard,
  Send,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { ROLE_CATEGORIES, LOCATIONS, LANGUAGES } from '@/lib/constants';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Temporary'] as const;
const LIVE_OPTIONS = ['Live-in', 'Live-out'] as const;
const HOURS_OPTIONS = ['Fixed', 'Flexible'] as const;
const HOURS_PER_WEEK = ['10', '20', '30', '40', '50', '60', 'Varies'] as const;

const SALARY_BANDS = [
  '£15,000 - £20,000',
  '£20,000 - £25,000',
  '£25,000 - £30,000',
  '£30,000 - £40,000',
  '£40,000 - £50,000',
  '£50,000+',
  'Negotiable',
] as const;

const RESPONSIBILITY_GROUPS = [
  {
    label: 'Cleaning & Housekeeping',
    items: ['Daily cleaning', 'Deep cleaning', 'Laundry & ironing'],
  },
  {
    label: 'Driving & Errands',
    items: ['Driving principals', 'Shopping / errands', 'Car maintenance'],
  },
  {
    label: 'Household Support',
    items: ['Cooking', 'Table service', 'Stock management'],
  },
  {
    label: 'Childcare',
    items: ['Childcare support', 'School runs', 'Homework & tutoring', 'Activities & outings'],
  },
  {
    label: 'Other',
    items: ['Pet care', 'Travel with family', 'Event hosting'],
  },
];

const REQUIREMENT_OPTIONS = [
  'Driving licence required',
  'Own car required',
  'Weekend work required',
  'Travel required',
  'High level English required',
] as const;

const LANGUAGE_OPTIONS = ['English', 'Spanish', 'Other'] as const;

interface Plan {
  id: string;
  name: string;
  price: number;
  tagline: string;
  features: string[];
  popular?: boolean;
  note?: string;
}

const PLANS: Plan[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: 165,
    tagline: '30 days access',
    features: [
      '1 live role at any time',
      'Replace roles as filled within 30 days',
      'Professionally structured role',
      'Access to curated candidates',
      'Filtered introductions',
    ],
  },
  {
    id: 'ongoing',
    name: 'Ongoing Hiring',
    price: 295,
    tagline: '30 days access',
    popular: true,
    features: [
      'Up to 2 live roles at any time',
      'Replace roles as filled within 30 days',
      'Increased visibility',
      'Faster candidate exposure',
    ],
  },
  {
    id: 'priority',
    name: 'Priority Search',
    price: 445,
    tagline: '30 days access',
    features: [
      'Everything in Ongoing Hiring',
      'Featured placement across platform',
      'Curated shortlist delivered',
      'Role profile + NDA templates included',
    ],
  },
  {
    id: 'agency',
    name: 'Professional / Agency',
    price: 675,
    tagline: '30 days access',
    features: [
      'Up to 5 live roles at any time',
      'Replace roles as filled within 30 days',
      'Designed for agencies & multi-role hiring',
      'Priority visibility across all roles',
    ],
    note: 'Suitable for multi-role households and professional users',
  },
];

const STEP_LABELS = ['Role Basics', 'Details', 'Package', 'Review'];
const STEP_ICONS = [Briefcase, ClipboardList, CreditCard, Send];

// ---------------------------------------------------------------------------
// Form State
// ---------------------------------------------------------------------------

interface FormData {
  jobTitle: string;
  customJobTitle: string;
  location: string;
  liveOption: string;
  employmentType: string;
  startDate: string;
  responsibilities: string[];
  requirements: string[];
  languages: string[];
  customLanguage: string;
  hoursType: string;
  hoursPerWeek: string;
  salaryBand: string;
  description: string;
  selectedPlan: string;
  agreedToTerms: boolean;
}

const INITIAL_FORM: FormData = {
  jobTitle: '',
  customJobTitle: '',
  location: '',
  liveOption: '',
  employmentType: '',
  startDate: '',
  responsibilities: [],
  requirements: [],
  languages: [],
  customLanguage: '',
  hoursType: '',
  hoursPerWeek: '',
  salaryBand: '',
  description: '',
  selectedPlan: '',
  agreedToTerms: false,
};

// ---------------------------------------------------------------------------
// Inline Sub-components
// ---------------------------------------------------------------------------

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl">
      <div className="flex items-center justify-between">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const Icon = STEP_ICONS[i];
          const isActive = stepNum === currentStep;
          const isComplete = stepNum < currentStep;

          return (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all sm:h-10 sm:w-10 ${
                    isComplete
                      ? 'border-[#9B7B3C] bg-[#9B7B3C] text-black'
                      : isActive
                      ? 'border-[#9B7B3C] bg-[#9B7B3C]/10 text-[#9B7B3C]'
                      : 'border-neutral-700 bg-neutral-900 text-neutral-500'
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  )}
                </div>
                <span
                  className={`mt-1.5 text-[10px] font-medium sm:mt-2 sm:text-xs ${
                    isActive || isComplete ? 'text-[#9B7B3C]' : 'text-neutral-500'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={`mx-2 h-px flex-1 ${
                    stepNum < currentStep ? 'bg-[#9B7B3C]' : 'bg-neutral-800'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-medium text-white">{title}</h2>
      {children}
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="pt-2">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#9B7B3C]/80">
        {label}
      </p>
    </div>
  );
}

function ToggleButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-4 py-2.5 text-xs font-medium transition-all ${
        active
          ? 'border-[#9B7B3C] bg-[#9B7B3C]/10 text-[#9B7B3C]'
          : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-600'
      }`}
    >
      {label}
    </button>
  );
}

function CheckboxItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-xs text-neutral-300 transition-all hover:border-neutral-600 select-none">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] transition-all ${
          checked
            ? 'border-[#9B7B3C] bg-[#9B7B3C] text-black'
            : 'border-neutral-600 bg-transparent'
        }`}
      >
        {checked && '✓'}
      </span>
      <span className={checked ? 'text-[#9B7B3C]' : ''}>{label}</span>
    </label>
  );
}

function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: Plan;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex flex-col rounded-xl border-2 p-5 text-left transition-all ${
        selected
          ? 'border-[#9B7B3C] bg-[#9B7B3C]/5 ring-1 ring-[#9B7B3C]/30'
          : plan.popular
          ? 'border-[#9B7B3C]/40 bg-neutral-900 hover:border-[#9B7B3C]/60'
          : 'border-neutral-800 bg-neutral-900 hover:border-neutral-600'
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-4 flex items-center gap-1 rounded-full bg-[#9B7B3C] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
          <Star className="h-3 w-3" /> Most Popular
        </span>
      )}

      <div className="mb-3">
        <h3 className="text-base font-semibold text-white">{plan.name}</h3>
        <p className="text-xs text-neutral-400">{plan.tagline}</p>
      </div>

      <p className="mb-4 text-2xl font-bold text-white">
        £{plan.price}
      </p>

      <ul className="space-y-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-xs text-neutral-300">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9B7B3C]" />
            {feature}
          </li>
        ))}
      </ul>

      {plan.note && (
        <p className="mt-3 text-[10px] text-neutral-500">{plan.note}</p>
      )}

      {selected && (
        <div className="mt-4 rounded-md bg-[#9B7B3C]/10 px-3 py-1.5 text-center text-xs font-medium text-[#9B7B3C]">
          Selected
        </div>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function PostRoleForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 'success'>(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  // Helpers
  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleInArray(key: 'responsibilities' | 'requirements' | 'languages', value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  }

  function canProceed(): boolean {
    if (step === 1) return !!(form.jobTitle || form.customJobTitle);
    if (step === 2) return true;
    if (step === 3) return !!form.selectedPlan;
    if (step === 4) return form.agreedToTerms;
    return false;
  }

  function handleNext() {
    if (step === 1 && !canProceed()) {
      toast.error('Please select or enter a job title');
      return;
    }
    if (step === 3 && !form.selectedPlan) {
      toast.error('Please select a plan to continue');
      return;
    }
    if (typeof step === 'number' && step < 4) {
      setStep((step + 1) as 1 | 2 | 3 | 4);
    }
  }

  function handleBack() {
    if (typeof step === 'number' && step > 1) {
      setStep((step - 1) as 1 | 2 | 3 | 4);
    }
  }

  async function handleSubmit() {
    if (!form.agreedToTerms) {
      toast.error('Please agree to the Terms & Conditions');
      return;
    }

    setSubmitting(true);

    try {
      const title = form.jobTitle === '__custom__' ? form.customJobTitle : form.jobTitle;
      const selectedPlan = PLANS.find((p) => p.id === form.selectedPlan);

      const res = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          role_type: title,
          position_type: form.liveOption === 'Live-in' ? 'live_in' : 'live_out',
          employment_type: form.employmentType.toLowerCase().replace('-', '_'),
          location: form.location,
          start_date: form.startDate || null,
          responsibilities: form.responsibilities,
          requirements: form.requirements,
          languages: form.languages,
          hours_type: form.hoursType.toLowerCase(),
          hours_per_week: form.hoursPerWeek,
          salary_band: form.salaryBand,
          description: form.description,
          plan: form.selectedPlan,
          plan_price: selectedPlan?.price,
          status: 'pending_review',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to post role');
      }

      toast.success('Stripe checkout coming soon. Role saved.');
      setStep('success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  // -------------------------------------------------------------------------
  // SUCCESS STATE
  // -------------------------------------------------------------------------

  if (step === 'success') {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#9B7B3C]/10">
          <CheckCircle2 className="h-8 w-8 text-[#9B7B3C]" />
        </div>
        <h1 className="font-heading text-3xl font-light text-white">Your role is now live</h1>
        <p className="mt-3 text-sm text-neutral-400">
          Start reviewing candidates immediately.
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <Link
            href="/dashboard/employer/roles"
            className="rounded-lg border border-neutral-700 bg-transparent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            View Role
          </Link>
          <Link
            href="/dashboard/employer/search"
            className="rounded-lg bg-[#9B7B3C] px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-[#7B6535]"
          >
            Browse Candidates
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 text-center">
        <h1 className="font-heading text-3xl font-light text-white">Submit a Role Brief</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Tell us what you need. We will curate considered introductions.
        </p>
      </div>

      <ProgressBar currentStep={step} />

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-8">
          <Section title="Job Title">
            <select
              value={form.jobTitle}
              onChange={(e) => update('jobTitle', e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white outline-none focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
            >
              <option value="">Select a role</option>
              {ROLE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__custom__">Other (specify below)</option>
            </select>
            {form.jobTitle === '__custom__' && (
              <input
                type="text"
                value={form.customJobTitle}
                onChange={(e) => update('customJobTitle', e.target.value)}
                placeholder="Enter a custom job title"
                className="mt-3 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
              />
            )}
          </Section>

          <Section title="Location">
            <input
              type="text"
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              placeholder="City or area"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
            />
          </Section>

          <Section title="Live-in or Live-out">
            <div className="flex flex-wrap gap-2">
              {LIVE_OPTIONS.map((opt) => (
                <ToggleButton
                  key={opt}
                  label={opt}
                  active={form.liveOption === opt}
                  onClick={() => update('liveOption', opt)}
                />
              ))}
            </div>
          </Section>

          <Section title="Employment Type">
            <div className="flex flex-wrap gap-2">
              {EMPLOYMENT_TYPES.map((type) => (
                <ToggleButton
                  key={type}
                  label={type}
                  active={form.employmentType === type}
                  onClick={() => update('employmentType', type)}
                />
              ))}
            </div>
          </Section>

          <Section title="Start Date (optional)">
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => update('startDate', e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white outline-none focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50 [color-scheme:dark]"
            />
          </Section>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-8">
          {/* Responsibilities */}
          <Section title="Role Responsibilities">
            <div className="max-h-[380px] overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-900/30 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#9B7B3C transparent' }}>
              {RESPONSIBILITY_GROUPS.map((group) => (
                <div key={group.label} className="border-b border-neutral-800/60 last:border-b-0">
                  <p className="sticky top-0 bg-neutral-900/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#9B7B3C]/80 backdrop-blur-sm">
                    {group.label}
                  </p>
                  <div className="grid grid-cols-1 gap-1.5 px-3 pb-3 sm:grid-cols-2">
                    {group.items.map((item) => (
                      <CheckboxItem
                        key={item}
                        label={item}
                        checked={form.responsibilities.includes(item)}
                        onChange={() => toggleInArray('responsibilities', item)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Requirements */}
          <SectionDivider label="Requirements" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {REQUIREMENT_OPTIONS.map((req) => (
              <CheckboxItem
                key={req}
                label={req}
                checked={form.requirements.includes(req)}
                onChange={() => toggleInArray('requirements', req)}
              />
            ))}
          </div>

          {/* Languages */}
          <Section title="Languages">
            <div className="flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map((lang) => (
                <ToggleButton
                  key={lang}
                  label={lang}
                  active={form.languages.includes(lang)}
                  onClick={() => toggleInArray('languages', lang)}
                />
              ))}
            </div>
            {form.languages.includes('Other') && (
              <input
                type="text"
                value={form.customLanguage}
                onChange={(e) => update('customLanguage', e.target.value)}
                placeholder="Specify language"
                className="mt-3 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
              />
            )}
          </Section>

          {/* Hours */}
          <SectionDivider label="Hours" />
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {HOURS_OPTIONS.map((opt) => (
                <ToggleButton
                  key={opt}
                  label={opt}
                  active={form.hoursType === opt}
                  onClick={() => update('hoursType', opt)}
                />
              ))}
            </div>
            <select
              value={form.hoursPerWeek}
              onChange={(e) => update('hoursPerWeek', e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white outline-none focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
            >
              <option value="">Hours per week</option>
              {HOURS_PER_WEEK.map((h) => (
                <option key={h} value={h}>
                  {h === 'Varies' ? 'Varies' : `${h} hours`}
                </option>
              ))}
            </select>
          </div>

          {/* Salary */}
          <SectionDivider label="Salary" />
          <select
            value={form.salaryBand}
            onChange={(e) => update('salaryBand', e.target.value)}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white outline-none focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
          >
            <option value="">Select salary range</option>
            {SALARY_BANDS.map((band) => (
              <option key={band} value={band}>
                {band}
              </option>
            ))}
          </select>

          {/* Role Description */}
          <SectionDivider label="Role Description" />
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={4}
            placeholder="Add any additional details about the role, household, or expectations"
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
          />

          {/* Template Upsell */}
          <div className="rounded-xl border border-[#9B7B3C]/20 bg-[#9B7B3C]/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#9B7B3C]/10">
                <FileText className="h-4 w-4 text-[#9B7B3C]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Need help structuring your role?</p>
                <a
                  href="/dashboard/employer/resources"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#9B7B3C] hover:underline"
                >
                  Browse our professional templates &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-medium text-white">Choose Your Plan</h2>
            <p className="mt-1 text-sm text-neutral-400">Select a package that fits your hiring needs.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={form.selectedPlan === plan.id}
                onSelect={() => update('selectedPlan', plan.id)}
              />
            ))}
          </div>

          <p className="text-center text-xs text-neutral-500">
            All plans are prepaid, non-refundable, and time-limited.
          </p>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-medium text-white">Review Your Role</h2>
            <p className="mt-1 text-sm text-neutral-400">Confirm the details before posting.</p>
          </div>

          <div className="space-y-4">
            <ReviewRow label="Job Title" value={form.jobTitle === '__custom__' ? form.customJobTitle : form.jobTitle} />
            <ReviewRow label="Location" value={form.location} />
            <ReviewRow label="Live-in / Live-out" value={form.liveOption} />
            <ReviewRow label="Employment Type" value={form.employmentType} />
            {form.startDate && <ReviewRow label="Start Date" value={form.startDate} />}
            {form.responsibilities.length > 0 && (
              <ReviewRow label="Responsibilities" value={form.responsibilities.join(', ')} />
            )}
            {form.requirements.length > 0 && (
              <ReviewRow label="Requirements" value={form.requirements.join(', ')} />
            )}
            {form.languages.length > 0 && (
              <ReviewRow
                label="Languages"
                value={
                  form.languages
                    .map((l) => (l === 'Other' && form.customLanguage ? form.customLanguage : l))
                    .join(', ')
                }
              />
            )}
            {form.hoursType && <ReviewRow label="Hours" value={`${form.hoursType}${form.hoursPerWeek ? `, ${form.hoursPerWeek} hrs/week` : ''}`} />}
            {form.salaryBand && <ReviewRow label="Salary" value={form.salaryBand} />}
            {form.description && <ReviewRow label="Description" value={form.description} />}
            <ReviewRow
              label="Selected Plan"
              value={`${PLANS.find((p) => p.id === form.selectedPlan)?.name || ''} (£${PLANS.find((p) => p.id === form.selectedPlan)?.price || ''})`}
            />
          </div>

          {/* Terms checkbox */}
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900 p-4 select-none">
            <input
              type="checkbox"
              checked={form.agreedToTerms}
              onChange={() => update('agreedToTerms', !form.agreedToTerms)}
              className="sr-only"
            />
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs transition-all ${
                form.agreedToTerms
                  ? 'border-[#9B7B3C] bg-[#9B7B3C] text-black'
                  : 'border-neutral-600 bg-transparent'
              }`}
            >
              {form.agreedToTerms && '✓'}
            </span>
            <span className="text-sm text-neutral-300">
              I agree to the{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[#9B7B3C] hover:underline">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[#9B7B3C] hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
        </div>
      )}

      {/* NAVIGATION BUTTONS */}
      <div className="mt-10 flex gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-transparent px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
        )}

        <div className="flex-1" />

        {step < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2 rounded-lg bg-[#9B7B3C] px-6 py-3.5 text-sm font-medium text-black transition-colors hover:bg-[#7B6535] disabled:opacity-50"
          >
            {step === 3 ? 'Continue to Payment' : 'Continue'} <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!form.agreedToTerms || submitting}
            className="flex items-center gap-2 rounded-lg bg-[#9B7B3C] px-6 py-3.5 text-sm font-medium text-black transition-colors hover:bg-[#7B6535] disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Posting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Post Role
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Review Row
// ---------------------------------------------------------------------------

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="shrink-0 text-xs font-medium text-neutral-400">{label}</span>
      <span className="text-sm text-white sm:text-right">{value}</span>
    </div>
  );
}

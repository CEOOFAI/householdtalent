'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, RotateCcw, Download } from 'lucide-react';
import { ROLE_CATEGORIES, LOCATIONS, LANGUAGES } from '@/lib/constants';
import {
  CV_SKILL_CATEGORIES,
  EXPERIENCE_YEAR_OPTIONS,
  LANGUAGE_PROFICIENCY,
} from '@/lib/ai/constants';
import type { GeneratedCV } from '@/types';

const AVAILABILITY_OPTIONS = [
  { value: 'immediate', label: 'Immediate' },
  { value: '1_month', label: 'Within 1 month' },
  { value: '3_months', label: 'Within 3 months' },
  { value: 'not_available', label: 'Not currently available' },
] as const;

interface CVBuilderFormProps {
  existingCV: GeneratedCV | null;
  lastGenerated: string | null;
}

interface FormData {
  roles: string[];
  roleYears: Record<string, string>;
  skills: string[];
  languages: string[];
  languageProficiency: Record<string, string>;
  availability: string;
  locationPreferences: string[];
  salaryMin: string;
  salaryMax: string;
  personalStatement: string;
  achievements: string;
}

export default function CVBuilderForm({ existingCV, lastGenerated }: CVBuilderFormProps) {
  const [step, setStep] = useState<'form' | 'review'>(existingCV ? 'review' : 'form');
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [cv, setCV] = useState<GeneratedCV | null>(existingCV);

  const [form, setForm] = useState<FormData>({
    roles: [],
    roleYears: {},
    skills: [],
    languages: [],
    languageProficiency: {},
    availability: '',
    locationPreferences: [],
    salaryMin: '',
    salaryMax: '',
    personalStatement: '',
    achievements: '',
  });

  // Editable CV fields for review step
  const [editCV, setEditCV] = useState({
    professional_summary: existingCV?.professional_summary || '',
    skills_competencies: existingCV?.skills_competencies
      ? existingCV.skills_competencies.map(c => `${c.category}: ${c.skills.join(', ')}`).join('\n')
      : '',
    professional_experience: existingCV?.professional_experience
      ? existingCV.professional_experience.map(e => `${e.role} (${e.years})\n${e.description}`).join('\n\n')
      : '',
    languages: existingCV?.languages
      ? existingCV.languages.map(l => `${l.language} - ${l.proficiency}`).join('\n')
      : '',
    availability_location: existingCV
      ? `${existingCV.availability}\n${existingCV.location_preferences.join(', ')}`
      : '',
    salary_expectation: existingCV?.salary_expectation || '',
  });

  function toggleRole(role: string) {
    setForm(prev => {
      const newRoles = prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role];
      const newYears = { ...prev.roleYears };
      if (!newRoles.includes(role)) delete newYears[role];
      return { ...prev, roles: newRoles, roleYears: newYears };
    });
  }

  function toggleSkill(skill: string) {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  }

  function toggleLanguage(lang: string) {
    setForm(prev => {
      const newLangs = prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang];
      const newProf = { ...prev.languageProficiency };
      if (!newLangs.includes(lang)) delete newProf[lang];
      else if (!newProf[lang]) newProf[lang] = 'conversational';
      return { ...prev, languages: newLangs, languageProficiency: newProf };
    });
  }

  function toggleLocation(locValue: string) {
    setForm(prev => ({
      ...prev,
      locationPreferences: prev.locationPreferences.includes(locValue)
        ? prev.locationPreferences.filter(l => l !== locValue)
        : [...prev.locationPreferences, locValue],
    }));
  }

  async function handleGenerate() {
    if (form.roles.length === 0) { toast.error('Select at least one role'); return; }

    setGenerating(true);
    try {
      const rolesWithYears = form.roles.map(role => ({
        role,
        years: form.roleYears[role] || '<1',
      }));

      const languagesWithProf = form.languages.map(lang => ({
        language: lang,
        proficiency: form.languageProficiency[lang] || 'conversational',
      }));

      const res = await fetch('/api/ai/cv-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roles: rolesWithYears,
          skills: form.skills,
          languages: languagesWithProf,
          availability: form.availability,
          location_preferences: form.locationPreferences,
          salary_min: form.salaryMin ? Number(form.salaryMin) : null,
          salary_max: form.salaryMax ? Number(form.salaryMax) : null,
          personal_statement: form.personalStatement,
          achievements: form.achievements,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'CV generation failed');
      }

      const { cv: generatedCV } = await res.json();
      setCV(generatedCV);
      setEditCV({
        professional_summary: generatedCV.professional_summary,
        skills_competencies: generatedCV.skills_competencies
          .map((c: GeneratedCV['skills_competencies'][number]) => `${c.category}: ${c.skills.join(', ')}`)
          .join('\n'),
        professional_experience: generatedCV.professional_experience
          .map((e: GeneratedCV['professional_experience'][number]) => `${e.role} (${e.years})\n${e.description}`)
          .join('\n\n'),
        languages: generatedCV.languages
          .map((l: GeneratedCV['languages'][number]) => `${l.language} - ${l.proficiency}`)
          .join('\n'),
        availability_location: `${generatedCV.availability}\n${generatedCV.location_preferences.join(', ')}`,
        salary_expectation: generatedCV.salary_expectation,
      });
      setStep('review');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  }

  async function handleDownloadPDF() {
    setDownloading(true);
    try {
      const res = await fetch('/api/ai/cv-pdf');
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'PDF download failed');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'HouseHoldTalent-CV.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('CV downloaded');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setDownloading(false);
    }
  }

  function handleRegenerate() {
    setStep('form');
    setCV(null);
  }

  // ─── REVIEW STEP ───────────────────────────────────────────────────
  if (step === 'review') {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-light text-white">Your Generated CV</h1>
          {lastGenerated && (
            <p className="mt-2 text-xs text-neutral-500">
              Last generated: {new Date(lastGenerated).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </p>
          )}
          <p className="mt-1 text-sm text-neutral-400">Review and edit your CV before downloading.</p>
        </div>

        <div className="space-y-4">
          <ReviewCard
            title="Professional Summary"
            value={editCV.professional_summary}
            onChange={v => setEditCV(prev => ({ ...prev, professional_summary: v }))}
          />
          <ReviewCard
            title="Skills & Competencies"
            value={editCV.skills_competencies}
            onChange={v => setEditCV(prev => ({ ...prev, skills_competencies: v }))}
            hint="Category: skill1, skill2 (one category per line)"
          />
          <ReviewCard
            title="Professional Experience"
            value={editCV.professional_experience}
            onChange={v => setEditCV(prev => ({ ...prev, professional_experience: v }))}
            hint="Role (years) + description, separated by blank lines"
          />
          <ReviewCard
            title="Languages"
            value={editCV.languages}
            onChange={v => setEditCV(prev => ({ ...prev, languages: v }))}
            hint="Language - Proficiency (one per line)"
          />
          <ReviewCard
            title="Availability & Location"
            value={editCV.availability_location}
            onChange={v => setEditCV(prev => ({ ...prev, availability_location: v }))}
          />
          <ReviewCard
            title="Salary Expectation"
            value={editCV.salary_expectation}
            onChange={v => setEditCV(prev => ({ ...prev, salary_expectation: v }))}
          />
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={handleRegenerate}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-transparent px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            <RotateCcw className="h-4 w-4" /> Regenerate
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#9B7B3C] px-6 py-3.5 text-sm font-medium text-black transition-colors hover:bg-[#7B6535] disabled:opacity-50"
          >
            {downloading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Downloading...</>
            ) : (
              <><Download className="h-4 w-4" /> Download PDF</>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ─── FORM STEP ─────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-light text-white">CV Builder</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Tell us about your experience and we'll generate a professionally structured CV.
        </p>
      </div>

      <div className="space-y-8">
        {/* Roles Experienced In */}
        <Section title="Roles Experienced In" subtitle="Select all that apply">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {ROLE_CATEGORIES.map(role => (
              <button
                key={role}
                type="button"
                onClick={() => toggleRole(role)}
                className={`rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition-all ${
                  form.roles.includes(role)
                    ? 'border-[#9B7B3C] bg-[#9B7B3C]/10 text-[#9B7B3C]'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-600'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </Section>

        {/* Years of Experience per Role */}
        {form.roles.length > 0 && (
          <Section title="Years of Experience" subtitle="Per selected role">
            <div className="space-y-3">
              {form.roles.map(role => (
                <div key={role} className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3">
                  <span className="flex-1 text-sm text-white">{role}</span>
                  <select
                    value={form.roleYears[role] || ''}
                    onChange={e => setForm(prev => ({
                      ...prev,
                      roleYears: { ...prev.roleYears, [role]: e.target.value },
                    }))}
                    className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs text-white outline-none focus:border-[#9B7B3C]"
                  >
                    <option value="">Select</option>
                    {EXPERIENCE_YEAR_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Skills by Category */}
        <Section title="Skills" subtitle="Select your competencies">
          <div className="space-y-5">
            {Object.entries(CV_SKILL_CATEGORIES).map(([key, category]) => (
              <div key={key}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#9B7B3C]/70">
                  {category.label}
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {category.skills.map(skill => (
                    <label
                      key={skill}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-xs transition-all ${
                        form.skills.includes(skill)
                          ? 'border-[#9B7B3C] bg-[#9B7B3C]/10 text-[#9B7B3C]'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.skills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                        className="sr-only"
                      />
                      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${
                        form.skills.includes(skill)
                          ? 'border-[#9B7B3C] bg-[#9B7B3C] text-black'
                          : 'border-neutral-600'
                      }`}>
                        {form.skills.includes(skill) && '✓'}
                      </span>
                      {skill}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Languages */}
        <Section title="Languages">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                    form.languages.includes(lang)
                      ? 'border-[#9B7B3C] bg-[#9B7B3C]/10 text-[#9B7B3C]'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-600'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            {form.languages.length > 0 && (
              <div className="space-y-2 pt-2">
                {form.languages.map(lang => (
                  <div key={lang} className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3">
                    <span className="flex-1 text-sm text-white">{lang}</span>
                    <select
                      value={form.languageProficiency[lang] || 'conversational'}
                      onChange={e => setForm(prev => ({
                        ...prev,
                        languageProficiency: { ...prev.languageProficiency, [lang]: e.target.value },
                      }))}
                      className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs text-white outline-none focus:border-[#9B7B3C]"
                    >
                      {LANGUAGE_PROFICIENCY.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* Availability */}
        <Section title="Availability">
          <div className="flex flex-wrap gap-2">
            {AVAILABILITY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, availability: opt.value }))}
                className={`rounded-lg border px-4 py-2 text-xs font-medium transition-all ${
                  form.availability === opt.value
                    ? 'border-[#9B7B3C] bg-[#9B7B3C]/10 text-[#9B7B3C]'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Section>

        {/* Location Preferences */}
        <Section title="Location Preferences" subtitle="Select all areas you would work in">
          <div className="flex flex-wrap gap-2">
            {LOCATIONS.map(loc => (
              <button
                key={loc.value}
                type="button"
                onClick={() => toggleLocation(loc.value)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                  form.locationPreferences.includes(loc.value)
                    ? 'border-[#9B7B3C] bg-[#9B7B3C]/10 text-[#9B7B3C]'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-600'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </Section>

        {/* Salary */}
        <Section title="Annual Salary Expectation (£ per annum)">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-neutral-500">Minimum</label>
              <input
                type="number"
                value={form.salaryMin}
                onChange={e => setForm(prev => ({ ...prev, salaryMin: e.target.value }))}
                placeholder="e.g. 25000"
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-neutral-500">Maximum</label>
              <input
                type="number"
                value={form.salaryMax}
                onChange={e => setForm(prev => ({ ...prev, salaryMax: e.target.value }))}
                placeholder="e.g. 40000"
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
              />
            </div>
          </div>
        </Section>

        {/* Personal Statement */}
        <Section title="Personal Statement">
          <div className="relative">
            <input
              type="text"
              value={form.personalStatement}
              onChange={e => {
                if (e.target.value.length <= 200) {
                  setForm(prev => ({ ...prev, personalStatement: e.target.value }));
                }
              }}
              maxLength={200}
              placeholder="One sentence about yourself"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">
              {form.personalStatement.length}/200
            </span>
          </div>
        </Section>

        {/* Achievements */}
        <Section title="Key Achievements">
          <div className="relative">
            <textarea
              value={form.achievements}
              onChange={e => {
                if (e.target.value.length <= 300) {
                  setForm(prev => ({ ...prev, achievements: e.target.value }));
                }
              }}
              maxLength={300}
              rows={3}
              placeholder="Notable achievements, awards, or highlights from your career..."
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
            />
            <span className="absolute bottom-2 right-3 text-xs text-neutral-500">
              {form.achievements.length}/300
            </span>
          </div>
        </Section>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={generating || form.roles.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#9B7B3C] px-6 py-4 text-base font-medium text-black transition-colors hover:bg-[#7B6535] disabled:opacity-50"
        >
          {generating ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Generating CV...</>
          ) : (
            'Generate CV'
          )}
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-1 text-sm font-medium text-white">{title}</h2>
      {subtitle && <p className="mb-3 text-xs text-neutral-500">{subtitle}</p>}
      {!subtitle && <div className="mb-3" />}
      {children}
    </div>
  );
}

function ReviewCard({
  title,
  value,
  onChange,
  hint,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#9B7B3C]">{title}</h3>
        {hint && <span className="text-xs text-neutral-500">{hint}</span>}
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={4}
        className="w-full resize-none rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white outline-none focus:border-[#9B7B3C] focus:ring-1 focus:ring-[#9B7B3C]/50"
      />
    </div>
  );
}

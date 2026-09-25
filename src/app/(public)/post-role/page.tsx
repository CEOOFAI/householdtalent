"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Shirt,
  ChefHat,
  Car,
  Building2,
  ShoppingBag,
  ArrowRight,
  Lock,
  Check,
  Shield,
  Users,
  Clock,
} from "lucide-react";
import {
  ROLE_CATEGORIES,
  RESPONSIBILITIES,
  POSITION_TYPES,
  EXPERIENCE_PREFERRED_OPTIONS,
  SALARY_RANGES,
  LOCATIONS,
} from "@/lib/constants";

const RESPONSIBILITY_ICONS: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="h-5 w-5" />,
  Shirt: <Shirt className="h-5 w-5" />,
  ChefHat: <ChefHat className="h-5 w-5" />,
  Car: <Car className="h-5 w-5" />,
  Building2: <Building2 className="h-5 w-5" />,
  ShoppingBag: <ShoppingBag className="h-5 w-5" />,
};

export default function PostRolePage() {
  const [roleType, setRoleType] = useState("");
  const [positionType, setPositionType] = useState("");
  const [selectedResponsibilities, setSelectedResponsibilities] = useState<string[]>([]);
  const [experiencePreferred, setExperiencePreferred] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [location, setLocation] = useState("");

  function toggleResponsibility(id: string) {
    setSelectedResponsibilities((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  }

  const selectedResponsibilityLabels = RESPONSIBILITIES.filter((r) =>
    selectedResponsibilities.includes(r.id)
  ).map((r) => r.label);

  const locationLabel = LOCATIONS.find((l) => l.value === location)?.label ?? "";
  const positionLabel = POSITION_TYPES.find((p) => p.value === positionType)?.label ?? "";

  return (
    <div className="min-h-screen">
      {/* Hero / Header with background image */}
      <section className="relative pb-8 pt-24 text-center">
        <div className="absolute inset-0">
          <Image
            src="/images/desk-writing.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6">
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Submit a Role Brief
          </h1>
          <p className="mt-4 text-lg text-white/60">
            Tell us what you need. We will structure the rest into a
            professional brief, and HHT facilitates every introduction.
          </p>

          {/* Progress Steps */}
          <div className="mt-12 flex items-center justify-center gap-4 sm:gap-6">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                1
              </div>
              <span className="hidden text-sm font-medium text-white sm:inline">
                Define Requirements
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-sm font-medium text-muted-foreground">
                2
              </div>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                We Structure Your Role
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            {/* Step 3 */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-sm font-medium text-muted-foreground">
                3
              </div>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                Request Introductions
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="bg-ornate px-6 pb-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left: Form */}
          <div className="space-y-10">
            {/* ROLE TYPE */}
            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-primary">
                Role Type
              </label>
              <select
                value={roleType}
                onChange={(e) => setRoleType(e.target.value)}
                className="w-full rounded-lg border border-border bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="" disabled>
                  Select a role type
                </option>
                {ROLE_CATEGORIES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* POSITION TYPE */}
            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-primary">
                Position Type
              </label>
              <div className="flex flex-wrap gap-3">
                {POSITION_TYPES.map((pt) => (
                  <button
                    key={pt.value}
                    type="button"
                    onClick={() => setPositionType(pt.value)}
                    className={`rounded-lg border px-5 py-2.5 text-sm font-medium transition-all ${
                      positionType === pt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-[#1A1A1A] text-muted-foreground hover:border-primary/50 hover:text-white"
                    }`}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* RESPONSIBILITIES */}
            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-primary">
                Responsibilities
              </label>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {RESPONSIBILITIES.map((resp) => {
                  const isSelected = selectedResponsibilities.includes(resp.id);
                  return (
                    <button
                      key={resp.id}
                      type="button"
                      onClick={() => toggleResponsibility(resp.id)}
                      className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-white"
                          : "border-border bg-[#1A1A1A] text-muted-foreground hover:border-primary/50 hover:text-white"
                      }`}
                    >
                      <span className={isSelected ? "text-primary" : "text-muted-foreground"}>
                        {RESPONSIBILITY_ICONS[resp.icon]}
                      </span>
                      <span className="text-sm font-medium">{resp.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* EXPERIENCE PREFERRED */}
            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-primary">
                Experience Preferred
              </label>
              <div className="flex flex-wrap gap-3">
                {EXPERIENCE_PREFERRED_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setExperiencePreferred(opt.value)}
                    className={`rounded-lg border px-5 py-2.5 text-sm font-medium transition-all ${
                      experiencePreferred === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-[#1A1A1A] text-muted-foreground hover:border-primary/50 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SALARY RANGE */}
            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-primary">
                Salary Range
              </label>
              <select
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full rounded-lg border border-border bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="" disabled>
                  Select a salary range
                </option>
                {SALARY_RANGES.map((sr) => (
                  <option key={sr.value} value={sr.value}>
                    {sr.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ADDITIONAL NOTES */}
            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-primary">
                Additional Notes
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={4}
                placeholder="Anything else we should know?"
                className="w-full rounded-lg border border-border bg-[#1A1A1A] px-4 py-3 text-sm text-white placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* LOCATION */}
            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-primary">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-border bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="" disabled>
                  Select a location
                </option>
                {LOCATIONS.map((loc) => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <div className="pt-4">
              <button
                type="button"
                className="btn-gold flex w-full items-center justify-center gap-2 rounded-lg px-8 py-4 text-base font-semibold"
              >
                Generate Role Brief
                <ArrowRight className="h-5 w-5" />
              </button>
              <p className="mt-3 text-center text-xs uppercase tracking-widest text-muted-foreground">
                Instant Draft &middot; Professional Role Brief
              </p>
            </div>
          </div>

          {/* Right: Sticky Summary */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="card-light rounded-xl p-6">
                <p className="text-xs font-medium uppercase tracking-widest text-primary">
                  Step 1 of 3
                </p>
                <h3 className="mt-3 font-heading text-xl font-bold text-[#1A1A1A]">
                  Your Role Summary
                </h3>

                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#888]">Position</p>
                    <p className="mt-1 text-sm font-medium text-[#1A1A1A]">
                      {roleType || "Not selected"}{positionLabel ? ` \u2022 ${positionLabel}` : ""}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#888]">Location</p>
                    <p className="mt-1 text-sm font-medium text-[#1A1A1A]">
                      {locationLabel || "Not selected"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#888]">Start Date</p>
                    <p className="mt-1 text-sm font-medium text-[#1A1A1A]">As soon as possible</p>
                  </div>

                  {selectedResponsibilityLabels.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#888]">
                        Key Responsibilities
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {selectedResponsibilityLabels.map((label) => (
                          <li
                            key={label}
                            className="flex items-center gap-2 text-sm text-[#1A1A1A]"
                          >
                            <Check className="h-3.5 w-3.5 text-primary" />
                            {label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="btn-gold mt-8 w-full rounded-lg px-6 py-3 text-sm font-semibold"
                >
                  Next: Review &amp; Publish
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#888]">
                  <Lock className="h-3.5 w-3.5" />
                  Secure &amp; Confidential
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Bar */}
      <section className="border-t border-border bg-[#0A0A0A] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              HHT Approved
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-primary" />
              Selected, not listed
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              Live for 30 days
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <a href="/contact" className="text-primary underline underline-offset-4">
              Our team is here to assist
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

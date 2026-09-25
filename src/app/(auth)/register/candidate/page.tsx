"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ROLE_CATEGORIES = [
  "Nanny / Childcare",
  "Housekeeper",
  "House Manager",
  "Chef / Cook",
  "Butler",
  "Personal Assistant",
  "Chauffeur",
  "Gardener / Groundskeeper",
  "Estate / Property Manager",
  "Security / Close Protection",
  "Laundry / Wardrobe",
  "Pet Care",
  "Yacht Crew",
  "Elder Care / Companion",
  "Tutor / Governess",
  "Personal Trainer / Wellness",
  "Events / Hospitality",
  "Other",
];

export default function CandidateApplyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [roleCategory, setRoleCategory] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [languages, setLanguages] = useState("");
  const [personalStatement, setPersonalStatement] = useState("");
  const [referralSource, setReferralSource] = useState("");

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!roleCategory) {
      setError("Please select the role you specialise in");
      return;
    }
    if (!personalStatement.trim()) {
      setError("Please share a short personal statement");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/verify-email`,
        data: {
          role: "candidate",
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
      if (authData.session === null) {
        router.push("/verify-email");
        return;
      }
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    // Let the auto-create trigger settle before we update.
    await new Promise((r) => setTimeout(r, 500));

    const now = new Date().toISOString();

    const profileUpdate: Record<string, unknown> = {
      gdpr_consent_at: now,
      marketing_consent: marketingOptIn,
      marketing_consent_at: marketingOptIn ? now : null,
    };
    if (phone) profileUpdate.phone = phone;
    await supabase.from("profiles").update(profileUpdate).eq("id", authData.user.id);

    const languagesArr = languages
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);

    const yearsInt = yearsExperience ? parseInt(yearsExperience, 10) : null;

    await supabase
      .from("candidate_profiles")
      .update({
        roles: [roleCategory],
        experience_years: yearsInt,
        location_text: currentLocation || null,
        languages: languagesArr.length ? languagesArr : null,
        personal_statement: personalStatement.trim() || null,
        application_source: referralSource.trim() || null,
        bio: personalStatement.trim() || null,
        applied_at: now,
        status: "pending_review",
      })
      .eq("user_id", authData.user.id);

    setSubmitted(true);
    setLoading(false);
  }

  const inputClass =
    "w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#9B7B3C] focus:outline-none focus:ring-1 focus:ring-[#9B7B3C]";

  if (submitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#9B7B3C]/10">
          <span className="font-heading text-2xl text-[#9B7B3C]">✓</span>
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Application Submitted
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-400">
            Thank you for applying to HouseHoldTalent. We will be in touch
            within 5 working days. Not everyone who applies will be accepted,
            and that is intentional.
          </p>
          <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-neutral-500">
            Please check your inbox to verify your email address so we can
            reach you with the outcome.
          </p>
        </div>
        <Link
          href="/"
          className="inline-block rounded-md border border-[#9B7B3C] px-6 py-2.5 text-sm font-semibold text-[#9B7B3C] transition-colors hover:bg-[#9B7B3C]/10"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-[#9B7B3C]">
          Apply to Join
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          Apply to Join the Network
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-400">
          HouseHoldTalent is a private network. Access is by application,
          referral or recommendation only. We review every submission
          personally before extending an invitation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            About You
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium text-neutral-300">
                First Name
              </label>
              <input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
                required
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium text-neutral-300">
                Last Name
              </label>
              <input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Smith"
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-neutral-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className={inputClass}
            />
          </div>

          <div className="mt-4 space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-neutral-300">
              Phone (optional)
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+350 200 12345"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Your Experience
          </p>

          <div className="space-y-2">
            <label htmlFor="roleCategory" className="text-sm font-medium text-neutral-300">
              Role you specialise in
            </label>
            <select
              id="roleCategory"
              value={roleCategory}
              onChange={(e) => setRoleCategory(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">Select your specialism</option>
              {ROLE_CATEGORIES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="yearsExperience" className="text-sm font-medium text-neutral-300">
                Years in private households
              </label>
              <input
                id="yearsExperience"
                type="number"
                min="0"
                max="60"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                placeholder="e.g. 8"
                required
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="currentLocation" className="text-sm font-medium text-neutral-300">
                Current location
              </label>
              <input
                id="currentLocation"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                placeholder="e.g. Gibraltar, Marbella"
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <label htmlFor="languages" className="text-sm font-medium text-neutral-300">
              Languages spoken
            </label>
            <input
              id="languages"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="English, Spanish, French"
              required
              className={inputClass}
            />
            <p className="text-xs text-neutral-600">Comma separated.</p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Your Application
          </p>

          <div className="space-y-2">
            <label htmlFor="personalStatement" className="text-sm font-medium text-neutral-300">
              Why are you applying?
            </label>
            <textarea
              id="personalStatement"
              value={personalStatement}
              onChange={(e) => setPersonalStatement(e.target.value)}
              placeholder="A short personal statement. Tell us why you would like to join the network and what kind of role suits you."
              required
              rows={5}
              className={inputClass}
            />
          </div>

          <div className="mt-4 space-y-2">
            <label htmlFor="referralSource" className="text-sm font-medium text-neutral-300">
              How did you hear about HouseHoldTalent? Who referred you?
            </label>
            <input
              id="referralSource"
              value={referralSource}
              onChange={(e) => setReferralSource(e.target.value)}
              placeholder="A name, an agency, an introduction, a search"
              required
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Account Access
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-neutral-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-300">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className={inputClass}
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-neutral-600">
            If accepted, you will use these details to access your member
            dashboard, complete your full profile, and upload your CV and
            references.
          </p>
        </div>

        <div className="space-y-3 rounded-md border border-neutral-800 bg-neutral-900/40 p-3">
          <label className="flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#9B7B3C]"
            />
            <span className="text-xs text-neutral-400">
              <span className="text-red-400">*</span> I agree to the{" "}
              <a
                href="/candidate-terms"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[#9B7B3C] hover:underline"
              >
                Candidate Terms &amp; Conditions
              </a>
              ,{" "}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[#9B7B3C] hover:underline"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="/cookies"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[#9B7B3C] hover:underline"
              >
                Cookie Policy
              </a>
              . I consent to my application being stored and personally
              reviewed by the HouseHoldTalent team.
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#9B7B3C]"
            />
            <span className="text-xs text-neutral-400">
              Optional: send me occasional updates from HouseHoldTalent. You
              can unsubscribe at any time.
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-[#9B7B3C] px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#9B7B3C]/90 disabled:opacity-50"
          disabled={loading || !agreedToTerms}
        >
          {loading ? "Submitting application..." : "Submit Application"}
        </button>

        <p className="text-center text-xs leading-relaxed text-neutral-500">
          We will be in touch within 5 working days. Not everyone who applies
          will be accepted, and that is intentional.
        </p>
      </form>

      <p className="text-center text-sm text-neutral-500">
        Already a member?{" "}
        <Link href="/login" className="text-[#9B7B3C] hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}

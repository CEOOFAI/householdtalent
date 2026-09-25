"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GoogleAuthButton } from "@/components/google-auth-button";

export default function EmployerRegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

    setLoading(true);
    const supabase = createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/verify-email`,
        data: {
          role: "employer",
          first_name: firstName,
          last_name: lastName,
          company_name: companyName || null,
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

    await new Promise(r => setTimeout(r, 500));

    const now = new Date().toISOString();
    const profileUpdate: Record<string, unknown> = {
      gdpr_consent_at: now,
      marketing_consent: marketingOptIn,
      marketing_consent_at: marketingOptIn ? now : null,
    };
    if (phone) profileUpdate.phone = phone;
    await supabase.from("profiles").update(profileUpdate).eq("id", authData.user.id);

    router.push("/dashboard/employer");
    router.refresh();
  }

  const inputClass = "w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#9B7B3C] focus:outline-none focus:ring-1 focus:ring-[#9B7B3C]";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-white">Register as an Employer</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Browse the HHT Approved network and request introductions
        </p>
      </div>

      <GoogleAuthButton role="employer" mode="register" />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-3 text-neutral-500">or register with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-neutral-300">First Name</label>
            <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" required className={inputClass} />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-neutral-300">Last Name</label>
            <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Smith" required className={inputClass} />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-neutral-300">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className={inputClass} />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-neutral-300">Phone (optional)</label>
          <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+350 200 12345" className={inputClass} />
        </div>

        <div className="space-y-2">
          <label htmlFor="companyName" className="text-sm font-medium text-neutral-300">Company / Household Name (optional)</label>
          <input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. The Smith Residence" className={inputClass} />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-neutral-300">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required className={inputClass} />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-300">Confirm Password</label>
          <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" required className={inputClass} />
        </div>

        <div className="space-y-3 rounded-md border border-neutral-800 bg-neutral-900/40 p-3">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#9B7B3C]"
            />
            <span className="text-xs text-neutral-400">
              <span className="text-red-400">*</span> I agree to the{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[#9B7B3C] hover:underline">Terms &amp; Conditions</a>
              {", "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[#9B7B3C] hover:underline">Privacy Policy</a>
              {" "}and{" "}
              <a href="/cookies" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[#9B7B3C] hover:underline">Cookie Policy</a>
              . I consent to my data being stored and processed for the purpose of accessing the candidate network.
            </span>
          </label>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#9B7B3C]"
            />
            <span className="text-xs text-neutral-400">
              Optional: keep me informed about new candidates joining the
              network, market trends, and platform updates. You can
              unsubscribe at any time.
            </span>
          </label>
        </div>

        <p className="text-xs text-neutral-600">
          Employer plans are one-off, prepaid 30-day access packages. Introductions are facilitated by HHT; we do not guarantee outcomes.
        </p>

        <button
          type="submit"
          className="w-full rounded-md bg-[#9B7B3C] px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#9B7B3C]/90 disabled:opacity-50"
          disabled={loading || !agreedToTerms}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link href="/login" className="text-[#9B7B3C] hover:underline">Sign In</Link>
      </p>
    </div>
  );
}

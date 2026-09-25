"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GoogleAuthButton } from "@/components/google-auth-button";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-white">Sign In</h1>
      </div>

      <GoogleAuthButton mode="login" />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-3 text-neutral-500">or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-neutral-300">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#9B7B3C] focus:outline-none focus:ring-1 focus:ring-[#9B7B3C]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-neutral-300">Password</label>
            <Link href="/forgot-password" className="text-xs text-[#9B7B3C] hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
            className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#9B7B3C] focus:outline-none focus:ring-1 focus:ring-[#9B7B3C]"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-[#9B7B3C] px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#9B7B3C]/90 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-[#9B7B3C] hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password` }
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="space-y-4 pt-6 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-primary" />
          <h1 className="font-heading text-2xl font-bold text-white">
            Check Your Email
          </h1>
          <p className="text-sm text-muted-foreground">
            If an account exists for {email}, you&apos;ll receive a password
            reset link shortly.
          </p>
          <Link
            href="/login"
            className="inline-block text-sm text-primary hover:underline"
          >
            Back to Sign In
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <h1 className="font-heading text-2xl font-bold text-white">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            Back to Sign In
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}

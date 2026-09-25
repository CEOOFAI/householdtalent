"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
      setSessionChecked(true);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    setTimeout(() => router.push("/dashboard"), 2000);
  }

  if (!sessionChecked) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!hasSession) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="space-y-4 pt-6 text-center">
          <h1 className="font-heading text-2xl font-bold text-white">
            Invalid or expired link
          </h1>
          <p className="text-sm text-muted-foreground">
            This reset link isn&apos;t valid anymore. Request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block text-sm text-primary hover:underline"
          >
            Request new reset link
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (success) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="space-y-4 pt-6 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-primary" />
          <h1 className="font-heading text-2xl font-bold text-white">
            Password Updated
          </h1>
          <p className="text-sm text-muted-foreground">
            Redirecting you to your dashboard...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <h1 className="font-heading text-2xl font-bold text-white">
            Set New Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose a new password for your account.
          </p>

          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              minLength={8}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
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

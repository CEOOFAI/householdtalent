import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Verify Your Email",
  description: "Verify your email address to activate your HouseHoldTalent account.",
};

export default function VerifyEmailPage() {
  return (
    <Card className="border-border bg-card">
      <CardContent className="space-y-4 pt-6 text-center">
        <Mail className="mx-auto h-12 w-12 text-primary" />
        <h1 className="font-heading text-2xl font-bold text-white">
          Verify Your Email
        </h1>
        <p className="text-sm text-muted-foreground">
          We&apos;ve sent a verification link to your email address. Click the
          link to activate your account.
        </p>
        <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
          <p className="text-xs text-muted-foreground">
            Your application can only be reviewed once your email is verified.
            Profiles are never shared without your consent.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-block text-sm text-primary hover:underline"
        >
          Already verified? Sign In
        </Link>
      </CardContent>
    </Card>
  );
}

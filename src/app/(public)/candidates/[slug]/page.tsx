import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Briefcase, Clock, Star } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Candidate Profile",
  description: "View this candidate's profile on HouseHoldTalent.",
};

export default async function CandidateProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            {slug.toUpperCase().slice(0, 2)}
          </div>
          <h1 className="mt-6 font-heading text-3xl font-bold text-white">
            Candidate Profile
          </h1>
          <p className="mt-2 text-muted-foreground">
            Profile ID: {slug}
          </p>
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-3 p-4">
              <Briefcase className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-sm font-medium text-white">Domestic Professional</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-3 p-4">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium text-white">Gibraltar Area</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-3 p-4">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="text-sm font-medium text-white">Details on full profile</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-3 p-4">
              <Star className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm font-medium text-white">Available</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bio Placeholder */}
        <Card className="mt-8 border-border bg-card">
          <CardContent className="p-6">
            <h2 className="font-heading text-lg font-semibold text-white">About</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Full candidate profiles with biography, experience, skills,
              references, and photos will be available once the platform
              launches. Request access as an employer to be notified when
              profiles go live.
            </p>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/register/employer"
            className="rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Request Access to Contact
          </Link>
          <Link
            href="/candidates"
            className="rounded-md border border-border bg-secondary px-8 py-3 text-base font-medium text-white transition-colors hover:bg-muted"
          >
            Browse All Candidates
          </Link>
        </div>
      </div>
    </div>
  );
}

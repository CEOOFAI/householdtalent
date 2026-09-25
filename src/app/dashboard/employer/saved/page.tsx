import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function EmployerSavedPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">
          Saved Candidates
        </h1>
        <p className="mt-1 text-muted-foreground">
          Your shortlisted candidates for quick access.
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
          <div className="rounded-full bg-muted p-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-xl font-semibold text-white">
            No Saved Candidates Yet
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            When you find candidates you like, save them here for easy
            comparison. Start browsing the directory to build your shortlist.
          </p>
          <Link
            href="/dashboard/employer/search"
            className="mt-4 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Search Candidates
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

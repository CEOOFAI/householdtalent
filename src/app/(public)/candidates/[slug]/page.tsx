import { redirect } from "next/navigation";

// Individual candidate profiles are not public. Full profiles are shared
// privately with employers through HHT-facilitated introductions, so any
// /candidates/<slug> link goes back to the network overview.
export default function CandidateProfilePage() {
  redirect("/candidates");
}

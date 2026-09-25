import Link from "next/link";
import { Users, Briefcase } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold text-white">
          Create Your Account
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Choose how you&apos;d like to use HouseHoldTalent
        </p>
      </div>

      <div className="grid gap-4">
        <Link href="/register/candidate">
          <div className="group flex cursor-pointer items-center gap-4 rounded-lg border border-neutral-800 bg-neutral-900/50 p-5 transition-all hover:border-[#9B7B3C]/40 hover:bg-neutral-800/50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#9B7B3C]/10">
              <Users className="h-6 w-6 text-[#9B7B3C]" />
            </div>
            <div>
              <h2 className="font-medium text-white">I&apos;m looking for work</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Create a profile and get discovered by employers
              </p>
            </div>
          </div>
        </Link>

        <Link href="/register/employer">
          <div className="group flex cursor-pointer items-center gap-4 rounded-lg border border-neutral-800 bg-neutral-900/50 p-5 transition-all hover:border-[#9B7B3C]/40 hover:bg-neutral-800/50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#9B7B3C]/10">
              <Briefcase className="h-6 w-6 text-[#9B7B3C]" />
            </div>
            <div>
              <h2 className="font-medium text-white">I&apos;m hiring staff</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Browse candidates and find the perfect match
              </p>
            </div>
          </div>
        </Link>
      </div>

      <p className="text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link href="/login" className="text-[#9B7B3C] hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}

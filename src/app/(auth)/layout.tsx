import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="font-heading text-3xl font-bold text-white">
            HouseHold<span className="text-primary">Talent</span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Exceptional Staff. Exemplary Homes.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

import { PageTransition } from "@/components/motion/page-transition";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <PageTransition className="pt-16">{children}</PageTransition>

      <SiteFooter />
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import {
  Baby, ChefHat, ShieldCheck, Car, TreePine, Building2,
  Sparkles, Heart, Anchor, Dog, Droplets, HandHelping,
  Check, ArrowRight, Clock, Home, Crown, Shirt, Dumbbell,
  Wrench, GraduationCap, PartyPopper, Fence, Briefcase, UserCog,
  Plane, Cookie, Baby as Bottle, Palette, Sailboat, Settings2,
} from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";
import { FeaturedRoles } from "@/components/featured-roles";
import { TestimonialsMarquee } from "@/components/testimonials-marquee";

const ROLE_CATEGORIES: { heading: string; roles: { name: string; icon: typeof Baby }[] }[] = [
  {
    heading: "Household Leadership",
    roles: [
      { name: "Chief of Staff", icon: Briefcase },
      { name: "House Manager", icon: Home },
      { name: "Head Butler", icon: Crown },
      { name: "Estate Manager", icon: Building2 },
      { name: "Estate Director", icon: Building2 },
      { name: "Head Housekeeper", icon: Sparkles },
      { name: "House Steward", icon: HandHelping },
    ],
  },
  {
    heading: "Personal & Executive Support",
    roles: [
      { name: "Executive PA / Private PA", icon: UserCog },
      { name: "Lady's Maid", icon: Shirt },
      { name: "Valet", icon: Shirt },
      { name: "Family Office Manager", icon: Briefcase },
      { name: "Travel Manager / Fixer", icon: Plane },
    ],
  },
  {
    heading: "Culinary",
    roles: [
      { name: "Private Chef", icon: ChefHat },
      { name: "Head Chef", icon: ChefHat },
      { name: "Travelling Chef", icon: ChefHat },
      { name: "Chef / Cook", icon: ChefHat },
      { name: "Pastry Chef", icon: Cookie },
    ],
  },
  {
    heading: "Childcare & Education",
    roles: [
      { name: "Nanny / Childcare", icon: Baby },
      { name: "Maternity Nurse", icon: Bottle },
      { name: "Tutor / Governess", icon: GraduationCap },
    ],
  },
  {
    heading: "Household & Property",
    roles: [
      { name: "Housekeeper", icon: Sparkles },
      { name: "Laundry / Wardrobe", icon: Shirt },
      { name: "Property Manager", icon: Building2 },
      { name: "Handyman / General Maintenance", icon: Wrench },
      { name: "Pool / Maintenance", icon: Droplets },
    ],
  },
  {
    heading: "Grounds & Estate",
    roles: [
      { name: "Gardener", icon: TreePine },
      { name: "Groundskeeper", icon: Fence },
      { name: "Estate Couple", icon: Home },
    ],
  },
  {
    heading: "Lifestyle & Specialist",
    roles: [
      { name: "Chauffeur", icon: Car },
      { name: "Security / Close Protection", icon: ShieldCheck },
      { name: "Yacht Crew", icon: Anchor },
      { name: "Yacht Captain", icon: Sailboat },
      { name: "Personal Trainer / Wellness", icon: Dumbbell },
      { name: "Events / Hospitality", icon: PartyPopper },
      { name: "Pet Care", icon: Dog },
      { name: "Elder Care / Companion", icon: Heart },
      { name: "Art Handler / Registrar", icon: Palette },
      { name: "Specialist Role / Other", icon: Settings2 },
    ],
  },
];

export default async function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-heading text-xl font-bold text-white sm:text-2xl">
            HouseHold<span className="text-primary">Talent</span>
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            <Link href="/jobs" className="text-sm text-white/70 transition-colors hover:text-white">Open Roles</Link>
            <Link href="/register/employer" className="text-sm text-white/70 transition-colors hover:text-white">Submit a Role Brief</Link>
            <Link href="/register/candidate" className="text-sm text-white/70 transition-colors hover:text-white">Apply to Join</Link>
            <Link href="/pricing" className="text-sm text-white/70 transition-colors hover:text-white">Pricing</Link>
            <Link href="/about" className="text-sm text-white/70 transition-colors hover:text-white">About</Link>
            <Link href="/contact" className="rounded-md border border-white/20 px-4 py-1.5 text-sm text-white transition-colors hover:bg-white/10">Contact Us</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="hidden text-sm text-white/70 transition-colors hover:text-white sm:block">Dashboard</Link>
            <Link href="/register/employer" className="hidden btn-gold rounded-md px-3 py-1.5 text-xs sm:block sm:px-4 sm:py-2 sm:text-sm">Submit a Role Brief</Link>
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Hero - Butler service, white gloves */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden sm:min-h-screen">
        <div className="absolute inset-0">
          <Image
            src="/images/estate-hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-4 inline-block rounded-full border border-primary/40 bg-black/40 px-4 py-1.5 backdrop-blur-sm sm:mb-6 sm:px-5 sm:py-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-primary sm:text-xs">
              Gibraltar & International
            </span>
          </div>
          <h1 className="font-heading text-4xl font-light leading-tight text-white sm:text-5xl lg:text-7xl">
            Exceptional Staff
            <br />
            <span className="text-primary">for Exemplary Homes.</span>
          </h1>
          <p className="mx-auto mt-3 text-lg font-medium tracking-wide text-primary sm:mt-4 sm:text-xl">
            Selected, not listed.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70 sm:mt-4 sm:text-lg">
            Direct access to carefully selected household staff.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-xs uppercase tracking-widest text-white/50 sm:mt-5 sm:text-sm">
            Access by referral, recommendation or application. Every member personally reviewed.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <Link
              href="/register/employer"
              className="btn-gold flex w-full items-center justify-center gap-2 rounded-md px-6 py-3 text-sm sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
            >
              Submit a Role Brief <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register/candidate"
              className="w-full rounded-md border border-white/20 bg-white/5 px-6 py-3 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/10 sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
            >
              Apply to Join the Network
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Open Roles */}
      <FeaturedRoles />

      {/* Testimonials marquee */}
      <TestimonialsMarquee />

      {/* How It Works - Cream */}
      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-light text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <div className="mx-auto mt-2 h-px w-16 bg-primary" />
          </div>

          <div className="mt-12 grid gap-12 sm:mt-16 md:grid-cols-2 md:gap-16">
            {/* For Employers */}
            <div>
              <div className="mb-6 overflow-hidden rounded-xl sm:mb-8">
                <Image
                  src="/images/table-setting.png"
                  alt="Elegant formal dining table service"
                  width={600}
                  height={192}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="h-40 w-full object-cover sm:h-48"
                />
              </div>
              <h3 className="mb-6 font-heading text-xl font-light text-gray-900 sm:mb-8 sm:text-2xl">
                For <span className="text-primary">Employers</span>
              </h3>
              <div className="space-y-5 sm:space-y-6">
                {[
                  { step: "01", title: "Tell Us What You Need", desc: "Submit a role brief outlining your ideal candidate. Select the role type, responsibilities, experience level and any specific preferences." },
                  { step: "02", title: "We Find the Right Match", desc: "Our team personally reviews your brief and curates a shortlist from our private network of vetted professionals." },
                  { step: "03", title: "We Make the Introduction", desc: "We introduce you to a small number of carefully selected candidates. No noise. No irrelevant profiles. Just the right people, presented professionally." },
                  { step: "04", title: "You Take It From There", desc: "You review each introduction and decide who to meet. We remain available throughout to support or refine the search if needed." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3 border-l-2 border-primary/30 pl-4 sm:gap-4 sm:pl-5">
                    <span className="font-heading text-2xl font-light text-primary sm:text-3xl">{item.step}</span>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 sm:text-base">{item.title}</h4>
                      <p className="mt-1 text-xs text-gray-500 sm:text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/register/employer"
                  className="btn-gold inline-block rounded-md px-6 py-3 text-sm font-medium sm:px-7 sm:py-3.5"
                >
                  Submit a Role Brief
                </Link>
              </div>
            </div>

            {/* For Candidates */}
            <div>
              <div className="mb-6 overflow-hidden rounded-xl sm:mb-8">
                <Image
                  src="/images/nanny-garden.jpg"
                  alt="Professional nanny with child at luxury estate"
                  width={600}
                  height={192}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="h-40 w-full object-cover sm:h-48"
                />
              </div>
              <h3 className="mb-6 font-heading text-xl font-light text-gray-900 sm:mb-8 sm:text-2xl">
                For <span className="text-primary">Candidates</span>
              </h3>
              <div className="space-y-5 sm:space-y-6">
                {[
                  { step: "01", title: "Apply to Join the Network", desc: "Submit your application and tell us about your experience, role specialism, languages and availability." },
                  { step: "02", title: "We Review Your Application", desc: "Every application is personally reviewed. Not every application is accepted, and that is intentional." },
                  { step: "03", title: "Build Your Profile", desc: "Accepted members build a complete profile inside the member dashboard, ready to be presented to the right households." },
                  { step: "04", title: "Be Introduced", desc: "When the right role comes along, we make the connection personally. No cold applications. Just warm, considered introductions." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3 border-l-2 border-primary/30 pl-4 sm:gap-4 sm:pl-5">
                    <span className="font-heading text-2xl font-light text-primary sm:text-3xl">{item.step}</span>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 sm:text-base">{item.title}</h4>
                      <p className="mt-1 text-xs text-gray-500 sm:text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/register/candidate"
                  className="inline-block rounded-md border border-gray-900 px-6 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-900 hover:text-white sm:px-7 sm:py-3.5"
                >
                  Apply to Join the Network
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Categories */}
      <section className="relative py-16 sm:py-24">
        <div className="absolute inset-0">
          <Image
            src="/images/hotel-lobby.jpg"
            alt=""
            fill
            loading="lazy"
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/88" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-light text-white sm:text-4xl">Every Private Residence Role. One Network.</h2>
            <div className="mx-auto mt-2 h-px w-16 bg-primary" />
            <p className="mt-4 text-sm text-white/60">From Childcare to Estate Management, By Introduction Only</p>
          </div>
          <div className="mt-10 space-y-10 sm:mt-14 sm:space-y-14">
            {ROLE_CATEGORIES.map((category) => (
              <div key={category.heading}>
                <div className="mb-4 flex items-center gap-3 sm:mb-6">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary sm:text-sm">
                    {category.heading}
                  </span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-7">
                  {category.roles.map((role) => (
                    <div
                      key={role.name}
                      className="group flex flex-col items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-white/10 sm:gap-3 sm:p-4"
                    >
                      <role.icon className="h-4 w-4 text-white/50 transition-colors group-hover:text-primary sm:h-5 sm:w-5" />
                      <span className="text-center text-[10px] leading-tight text-white/50 transition-colors group-hover:text-white sm:text-xs">
                        {role.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Member Access */}
      <section className="bg-black py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="mb-4 inline-block rounded-full border border-primary/40 bg-black/40 px-4 py-1.5 backdrop-blur-sm">
            <span className="text-[10px] font-medium uppercase tracking-widest text-primary sm:text-xs">
              By Invitation
            </span>
          </div>
          <h2 className="font-heading text-3xl font-light text-white sm:text-4xl">
            Founding Member Access
          </h2>
          <div className="mx-auto mt-2 h-px w-16 bg-primary" />
          <p className="mt-6 text-base leading-relaxed text-white/70 sm:text-lg">
            HouseHoldTalent is personally onboarding its first founding members, both candidates and households.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
            For candidates: if you have been referred or invited, your application will be reviewed with priority. Founding candidates receive a complimentary professionally curated HHT profile.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
            For private households and family offices: our first founding employer members are invited to post one role complimentary and receive curated candidate introductions from our founding network. Places are strictly limited.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
            To enquire about founding membership, get in touch directly.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/register/candidate"
              className="btn-gold w-full rounded-md px-6 py-3 text-sm font-medium sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
            >
              Apply to Join the Network
            </Link>
            <Link
              href="/contact"
              className="w-full rounded-md border border-white/20 bg-white/5 px-6 py-3 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/10 sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
            >
              Enquire About Employer Access
            </Link>
          </div>
        </div>
      </section>

      {/* Image break - White glove service */}
      <section className="relative h-56 overflow-hidden sm:h-72 md:h-96">
        <Image
          src="/images/butler-tray.png"
          alt="Butler service with crystal decanters"
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 sm:p-8 md:p-12">
          <p className="font-heading text-xl font-light italic text-white/90 sm:text-2xl md:text-3xl">
            &ldquo;Selected, not listed.&rdquo;
          </p>
          <p className="mt-2 text-xs text-white/60 sm:text-sm">
            Every candidate is personally reviewed before being introduced.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 sm:py-24">
        <div className="absolute inset-0">
          <Image
            src="/images/villa-pool.jpg"
            alt=""
            fill
            loading="lazy"
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-3xl font-light text-white sm:text-4xl">
            A Private Network. By Introduction Only.
          </h2>
          <div className="mx-auto mt-2 h-px w-16 bg-primary" />
          <p className="mt-4 text-sm text-white/60 sm:mt-6 sm:text-base">
            Discreet hiring for private households across the UK, Europe and the Middle East. Access by referral, recommendation or application only.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:gap-4">
            <Link href="/register/employer" className="btn-gold w-full rounded-md px-6 py-3 text-sm sm:w-auto sm:px-8 sm:py-3.5 sm:text-base">Submit a Role Brief</Link>
            <Link href="/contact" className="w-full rounded-md border border-white/20 bg-white/5 px-6 py-3 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/10 sm:w-auto sm:px-8 sm:py-3.5 sm:text-base">Speak to Us</Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-ornate py-4 sm:py-6">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4 px-4 text-xs text-white/50 sm:gap-8 sm:text-sm">
          <span className="flex items-center gap-1.5 sm:gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" /> Curated & Vetted
          </span>
          <span className="flex items-center gap-1.5 sm:gap-2">
            <Check className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" /> Selected, not listed
          </span>
          <span className="flex items-center gap-1.5 sm:gap-2">
            <Clock className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" /> By introduction only
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <span className="font-heading text-xl font-bold text-white">
                HouseHold<span className="text-primary">Talent</span>
              </span>
              <p className="mt-3 text-xs text-white/40 sm:text-sm">Exceptional Staff. Exemplary Homes.</p>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-white/30 sm:text-xs">
                Access by referral, recommendation or application only.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/60">Company</h4>
              <ul className="mt-3 space-y-2">
                <li><Link href="/about" className="text-xs text-white/40 hover:text-white sm:text-sm">About</Link></li>
                <li><Link href="/how-it-works" className="text-xs text-white/40 hover:text-white sm:text-sm">How It Works</Link></li>
                <li><Link href="/pricing" className="text-xs text-white/40 hover:text-white sm:text-sm">Pricing</Link></li>
                <li><Link href="/dashboard/employer/resources" className="text-xs text-white/40 hover:text-white sm:text-sm">Resources</Link></li>
                <li><Link href="/contact" className="text-xs text-white/40 hover:text-white sm:text-sm">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/60">Legal</h4>
              <ul className="mt-3 space-y-2">
                <li><Link href="/terms" className="text-xs text-white/40 hover:text-white sm:text-sm">Terms &amp; Conditions</Link></li>
                <li><Link href="/candidate-terms" className="text-xs text-white/40 hover:text-white sm:text-sm">Candidate Terms</Link></li>
                <li><Link href="/privacy" className="text-xs text-white/40 hover:text-white sm:text-sm">Privacy Policy</Link></li>
                <li><Link href="/faq" className="text-xs text-white/40 hover:text-white sm:text-sm">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/60">Apply</h4>
              <ul className="mt-3 space-y-2">
                <li><Link href="/register/employer" className="text-xs text-white/40 hover:text-white sm:text-sm">Submit a Role Brief</Link></li>
                <li><Link href="/register/candidate" className="text-xs text-white/40 hover:text-white sm:text-sm">Apply to Join</Link></li>
                <li><Link href="/login" className="text-xs text-white/40 hover:text-white sm:text-sm">Dashboard</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-6 text-center sm:pt-8">
            <p className="text-[10px] text-white/30 sm:text-xs">
              Need help? Our concierge team is <Link href="/contact" className="text-primary hover:underline">here to assist</Link>.
            </p>
            <p className="mt-1 text-[10px] text-white/30 sm:mt-2 sm:text-xs">
              &copy; {new Date().getFullYear()} HouseHoldTalent. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

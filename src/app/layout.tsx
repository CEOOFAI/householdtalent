import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { Toaster } from "sonner";
import { CookieBanner } from "@/components/cookie-banner";
import "./globals.css";
import { jsonLd } from '@/lib/utils'
import { SITE_URL } from '@/lib/site'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const SITE_NAME = "HouseHoldTalent";
const SITE_TAGLINE = "Exceptional Staff. Exemplary Homes.";
const SITE_DESCRIPTION =
  "A private introduction network connecting discerning households with exceptional domestic staff across Gibraltar, the Costa del Sol and internationally. HHT Approved nannies, housekeepers, private chefs, butlers, estate managers and more.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  keywords: [
    "household staff gibraltar",
    "domestic staff international",
    "nanny gibraltar",
    "nanny costa del sol",
    "nanny marbella",
    "nanny sotogrande",
    "private chef gibraltar",
    "private chef marbella",
    "estate manager spain",
    "house manager gibraltar",
    "butler private household",
    "private household staff",
    "luxury domestic staffing",
    "household staff introductions",
    "personal assistant household",
    "uhnw household staff",
  ],
  openGraph: {
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
    alternateLocale: ["en_US", "es_ES"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: "HHT",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: SITE_DESCRIPTION,
  areaServed: [
    { "@type": "Country", name: "Gibraltar" },
    { "@type": "Country", name: "Spain" },
    { "@type": "Place", name: "International" },
  ],
  knowsAbout: [
    "Private household staffing",
    "Private household staff introductions",
    "Nanny introductions",
    "Private chef introductions",
    "Estate management staffing",
    "Butler introductions",
    "Personal assistant introductions",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    url: `${SITE_URL}/contact`,
    areaServed: ["GB", "GI", "ES", "FR", "IT", "CH", "MC", "AE", "QA", "SA"],
    availableLanguage: ["English", "Spanish"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${cormorant.variable} overflow-x-hidden`}
      >
        {children}
        <CookieBanner />
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "#111111",
              border: "1px solid #2A2A2A",
              color: "#FFFFFF",
            },
          }}
        />
      </body>
    </html>
  );
}

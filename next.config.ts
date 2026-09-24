import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async headers() {
    // TODO: Add a Content-Security-Policy header once the whole site has been
    // tested end-to-end. CSP can break Supabase auth iframes, Stripe Checkout,
    // and Pollinations/Unsplash image hosts if rolled out blind. Audit all
    // third-party origins (Supabase project, Stripe, Pollinations, Unsplash,
    // fonts, analytics) before enabling, and ship in Report-Only mode first.
    return [
      {
        source: '/:path*',
        headers: [
          // Vercel injects HSTS automatically, but be explicit so the policy
          // travels with the app on any host. 2 years + includeSubDomains +
          // preload matches hstspreload.org requirements.
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // payment=(self) so Stripe Checkout's Payment Request API works
          // when launched from our own origin. Camera/mic/geo stay disabled.
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(self)' },
        ],
      },
    ]
  },
};

export default nextConfig;

import type { MetadataRoute } from 'next'

const BASE = 'https://householdtalent.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/jobs', '/jobs/', '/about', '/how-it-works', '/pricing', '/faq', '/contact', '/register'],
        disallow: ['/dashboard/', '/admin/', '/api/', '/login', '/forgot-password', '/reset-password', '/verify-email'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}

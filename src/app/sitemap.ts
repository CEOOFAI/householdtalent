import type { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { SITE_URL as BASE } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Public role pages are rendered with the service role, so the sitemap reads
  // the same way (the anon key can't see roles under RLS).
  const { data: roles } = await createAdminClient()
    .from('roles')
    .select('id, updated_at, created_at')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const roleEntries: MetadataRoute.Sitemap = (roles || [])
    .map((r) => ({
      url: `${BASE}/jobs/${r.id}`,
      lastModified: r.updated_at || r.created_at,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/jobs`, changeFrequency: 'daily', priority: 0.95 },
    { url: `${BASE}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/how-it-works`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/pricing`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/faq`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/register/employer`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/register/candidate`, changeFrequency: 'monthly', priority: 0.6 },
  ]

  return [...staticEntries, ...roleEntries]
}

import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const BASE = 'https://householdtalent.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const { data: roles } = await supabase
    .from('roles')
    .select('id, updated_at, created_at, status')
    .in('status', ['active', 'closed'])
    .order('created_at', { ascending: false })

  const roleEntries: MetadataRoute.Sitemap = (roles || [])
    .filter((r) => r.status === 'active')
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

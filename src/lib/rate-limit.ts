// Simple in-memory IP rate limiter. Fine for low-traffic / single-region
// deployments. For multi-region / high traffic, swap for Upstash or Vercel KV.

const buckets = new Map<string, { count: number; resetAt: number }>()

export function checkIpRateLimit(
  ip: string,
  opts: { max: number; windowMs: number },
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const bucket = buckets.get(ip)

  if (!bucket || bucket.resetAt < now) {
    const fresh = { count: 1, resetAt: now + opts.windowMs }
    buckets.set(ip, fresh)
    // Opportunistic GC so the map doesn't grow forever
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) {
        if (v.resetAt < now) buckets.delete(k)
      }
    }
    return { ok: true, remaining: opts.max - 1, resetAt: fresh.resetAt }
  }

  bucket.count += 1
  return {
    ok: bucket.count <= opts.max,
    remaining: Math.max(0, opts.max - bucket.count),
    resetAt: bucket.resetAt,
  }
}

export function ipFromRequest(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  const real = req.headers.get('x-real-ip')
  if (real) return real
  return 'unknown'
}

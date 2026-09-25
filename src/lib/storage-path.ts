// Candidate files live in private buckets. Older rows stored a (non-working)
// public URL; newer rows store the object path. Accept either and return the path.
export function storagePathFrom(value: string | null | undefined, bucket: string): string | null {
  if (!value) return null
  if (!/^https?:\/\//.test(value)) return value.replace(/^\/+/, '')
  const m = value.match(new RegExp(`/storage/v1/object/(?:public|sign|authenticated)/${bucket}/([^?]+)`))
  return m ? decodeURIComponent(m[1]) : null
}

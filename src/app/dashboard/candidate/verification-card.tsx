'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { ShieldCheck, Award, Upload, Loader2, FileCheck, Clock } from 'lucide-react'
import { toast } from 'sonner'

const MAX_BYTES = 8 * 1024 * 1024 // 8 MB
const ACCEPTED = ['application/pdf', 'image/jpeg', 'image/png', 'image/heic']

export default function VerificationCard({
  candidateId,
  userId,
  referenceStatus,
  goldVerified,
  policeCheckUploaded,
}: {
  candidateId: string
  userId: string
  referenceStatus: 'pending' | 'in_progress' | 'verified' | null
  goldVerified: boolean
  policeCheckUploaded: boolean
}) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [hasFile, setHasFile] = useState(policeCheckUploaded)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_BYTES) {
      toast.error('File too large. Maximum 8MB.')
      return
    }
    if (!ACCEPTED.includes(file.type)) {
      toast.error('Please upload a PDF or image file.')
      return
    }

    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf'
    const path = `${userId}/police-check.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('police-checks')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadErr) {
      toast.error(`Upload failed: ${uploadErr.message}`)
      setUploading(false)
      return
    }

    const { error: dbErr } = await supabase
      .from('candidate_profiles')
      .update({
        police_check_url: path,
        police_check_uploaded_at: new Date().toISOString(),
      })
      .eq('id', candidateId)

    if (dbErr) {
      toast.error(`Saved file but could not update profile: ${dbErr.message}`)
      setUploading(false)
      return
    }

    setHasFile(true)
    toast.success('Police check uploaded. HHT will review it shortly.')
    router.refresh()
    setUploading(false)
    e.target.value = ''
  }

  const status = referenceStatus || 'pending'

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#9B7B3C]" />
              <h2 className="font-medium text-white">Reference & Verification</h2>
            </div>
            <p className="mt-2 text-sm text-neutral-400">
              Every member of the HHT network is verified. We contact a minimum of two references before your profile is activated. Upload a valid police check or DBS certificate to qualify for HHT Gold Verified status.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            {goldVerified ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9B7B3C] bg-[#9B7B3C]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#9B7B3C]">
                <Award className="h-3.5 w-3.5" />
                HHT Gold Verified
              </span>
            ) : status === 'verified' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                References Verified by HHT
              </span>
            ) : status === 'in_progress' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-300">
                <Clock className="h-3.5 w-3.5" />
                References in progress
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                <Clock className="h-3.5 w-3.5" />
                References pending
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white">Police check / DBS</p>
              <p className="mt-1 text-xs text-neutral-400">
                {hasFile
                  ? 'On file. HHT will review and confirm Gold Verified status.'
                  : 'Upload a valid police check or DBS certificate. PDF or image, up to 8MB.'}
              </p>
            </div>
            <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-md border border-[#9B7B3C]/40 bg-[#9B7B3C]/10 px-3 py-1.5 text-xs font-medium text-[#9B7B3C] transition-colors hover:bg-[#9B7B3C]/20">
              {uploading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : hasFile ? (
                <FileCheck className="h-3 w-3" />
              ) : (
                <Upload className="h-3 w-3" />
              )}
              <span>{hasFile ? 'Replace' : 'Upload'}</span>
              <input
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/heic"
                className="hidden"
                disabled={uploading}
                onChange={handleUpload}
              />
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

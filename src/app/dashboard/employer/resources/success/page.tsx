'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Download, Loader2, AlertCircle, FileText } from 'lucide-react'
import Link from 'next/link'
import { PRODUCT_TEMPLATES, RESOURCE_PRODUCTS, type ResourceProductId } from '@/lib/resources/config'
import { TEMPLATES, type Template, type TemplateSection } from '@/lib/resources/templates'

export default function ResourceSuccessPage() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')
  const productId = params.get('product') as ResourceProductId | null
  const [status, setStatus] = useState<'loading' | 'verified' | 'error'>('loading')

  useEffect(() => {
    if (!sessionId || !productId) {
      setStatus('error')
      return
    }

    // Verify the session with our API
    fetch(`/api/resources/verify?session_id=${sessionId}`)
      .then((res) => {
        if (res.ok) {
          setStatus('verified')
        } else {
          setStatus('error')
        }
      })
      .catch(() => setStatus('error'))
  }, [sessionId, productId])

  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#9B7B3C]" />
          <p className="mt-4 text-sm text-neutral-400">Verifying your purchase...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-red-400" />
          <h2 className="mt-4 font-heading text-xl text-white">Something went wrong</h2>
          <p className="mt-2 text-sm text-neutral-400">
            We could not verify your purchase. If you were charged, please contact support.
          </p>
          <Link
            href="/dashboard/employer/resources"
            className="mt-6 inline-block rounded-lg border border-neutral-700 px-6 py-2.5 text-sm text-white hover:bg-neutral-800"
          >
            Back to Resources
          </Link>
        </div>
      </div>
    )
  }

  // Get the templates this purchase unlocks
  const templateIds = productId ? PRODUCT_TEMPLATES[productId] || [] : []
  const product = productId ? RESOURCE_PRODUCTS[productId] : null

  return (
    <div>
      {/* Success Header */}
      <div className="mb-8 rounded-xl border border-[#9B7B3C]/20 bg-[#9B7B3C]/5 p-6 text-center">
        <CheckCircle className="mx-auto h-10 w-10 text-[#9B7B3C]" />
        <h1 className="mt-4 font-heading text-2xl font-light text-white">
          Purchase Complete
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          {product?.name} is ready to download
        </p>
      </div>

      {/* Download Cards */}
      <div className="space-y-6">
        {templateIds.map((templateId) => {
          const template = TEMPLATES[templateId]
          if (!template) return null
          return (
            <TemplateDownloadCard key={templateId} template={template} />
          )
        })}
      </div>

      {/* Legal Disclaimer */}
      <div className="mt-8 rounded-lg border border-neutral-800/50 bg-neutral-900/20 p-4">
        <p className="text-xs leading-relaxed text-neutral-500">
          These documents are provided as general templates for guidance only and
          do not constitute legal advice. Users should seek independent legal
          advice to ensure documents comply with applicable laws in their
          jurisdiction.
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/dashboard/employer/resources"
          className="text-sm text-[#9B7B3C] hover:underline"
        >
          Back to Resources
        </Link>
      </div>
    </div>
  )
}

function TemplateDownloadCard({ template }: { template: Template }) {
  const printRef = useRef<HTMLDivElement>(null)

  function handleDownload() {
    const el = printRef.current
    if (!el) return

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${template.title}</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; line-height: 1.6; }
  h1 { font-size: 22px; text-align: center; margin-bottom: 32px; letter-spacing: 2px; }
  h2 { font-size: 16px; margin-top: 28px; margin-bottom: 8px; }
  h3 { font-size: 14px; font-weight: 600; margin-top: 16px; margin-bottom: 6px; }
  p { font-size: 13px; margin: 6px 0; }
  ul { padding-left: 24px; margin: 8px 0; }
  li { font-size: 13px; margin: 4px 0; }
  .signature-block { margin-top: 48px; }
  .signature-line { display: flex; gap: 64px; margin-top: 24px; }
  .sig { flex: 1; }
  .sig-label { font-size: 13px; font-weight: 600; margin-bottom: 32px; }
  .sig-underline { border-bottom: 1px solid #1a1a1a; height: 1px; }
  .disclaimer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #ccc; font-size: 11px; color: #666; font-style: italic; }
  .subheading { font-weight: 600; font-size: 13px; }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
${el.innerHTML}
</body>
</html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${template.id}-template.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#9B7B3C]/10">
            <FileText className="h-5 w-5 text-[#9B7B3C]" />
          </div>
          <div>
            <h3 className="font-heading text-lg text-white">{template.title}</h3>
            <p className="text-xs text-neutral-500">HTML format, editable</p>
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-lg bg-[#9B7B3C] px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#7B6535]"
        >
          <Download className="h-4 w-4" /> Download
        </button>
      </div>

      {/* Hidden rendered template for download */}
      <div ref={printRef} className="hidden">
        <h1>{template.title}</h1>
        {template.sections.map((section, i) => (
          <SectionRenderer key={i} section={section} />
        ))}
        {template.disclaimer && (
          <div className="disclaimer">
            <p>{template.disclaimer}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionRenderer({ section }: { section: TemplateSection }) {
  if (section.signature) {
    return (
      <div className="signature-block">
        <h2>Signed</h2>
        <div className="signature-line">
          <div className="sig">
            <p className="sig-label">Employer:</p>
            <div className="sig-underline" />
          </div>
          <div className="sig">
            <p className="sig-label">Employee:</p>
            <div className="sig-underline" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {section.heading && <h2>{section.heading}</h2>}
      {section.subheading && <p className="subheading">{section.subheading}</p>}
      {section.content &&
        section.content.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
      {section.list && section.list.length > 0 && (
        <ul>
          {section.list.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      {section.subsections?.map((sub, i) => (
        <div key={i}>
          {sub.heading && <h3>{sub.heading}</h3>}
          {sub.list.length > 0 && (
            <ul>
              {sub.list.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}

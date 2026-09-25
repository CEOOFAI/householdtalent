import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Employer shortlist ("saved candidates").
// GET    -> { ids: string[] }
// POST   { candidate_id } -> save
// DELETE ?candidate_id=... -> remove
async function employerFor() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, employerId: null, status: 401 as const }
  const { data: employer } = await supabase
    .from('employer_profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!employer) return { supabase, employerId: null, status: 403 as const }
  return { supabase, employerId: employer.id as string, status: 200 as const }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET() {
  const { supabase, employerId, status } = await employerFor()
  if (!employerId) return NextResponse.json({ error: 'Forbidden' }, { status })
  const { data } = await supabase
    .from('saved_candidates')
    .select('candidate_id')
    .eq('employer_id', employerId)
  return NextResponse.json({ ids: (data ?? []).map((r) => r.candidate_id) })
}

export async function POST(req: NextRequest) {
  const { supabase, employerId, status } = await employerFor()
  if (!employerId) return NextResponse.json({ error: 'Forbidden' }, { status })
  const { candidate_id } = (await req.json()) as { candidate_id?: string }
  if (!candidate_id || !UUID.test(candidate_id)) {
    return NextResponse.json({ error: 'Invalid candidate' }, { status: 400 })
  }
  const { error } = await supabase
    .from('saved_candidates')
    .upsert({ employer_id: employerId, candidate_id }, { onConflict: 'employer_id,candidate_id', ignoreDuplicates: true })
  if (error) {
    console.error('save candidate failed', error.code)
    return NextResponse.json({ error: 'Could not save' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const { supabase, employerId, status } = await employerFor()
  if (!employerId) return NextResponse.json({ error: 'Forbidden' }, { status })
  const candidateId = req.nextUrl.searchParams.get('candidate_id')
  if (!candidateId || !UUID.test(candidateId)) {
    return NextResponse.json({ error: 'Invalid candidate' }, { status: 400 })
  }
  await supabase.from('saved_candidates').delete().eq('employer_id', employerId).eq('candidate_id', candidateId)
  return NextResponse.json({ ok: true })
}

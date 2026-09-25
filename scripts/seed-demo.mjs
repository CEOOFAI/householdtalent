// Seed demo employers, candidates, roles, and introductions for Heinz walkthrough.
// Idempotent: re-running skips existing demo accounts. All demo users use the
// demo+...@householdtalent.demo email prefix so they're easy to identify.
//
// Run with: node scripts/seed-demo.mjs

import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function readEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  const env = fs.readFileSync(envPath, 'utf8')
  const url = env.match(/NEXT_PUBLIC_SUPABASE_URL="?([^"\n]+)"?/)[1].replace(/\\n/g, '').trim()
  const key = env.match(/SUPABASE_SERVICE_ROLE_KEY="?([^"\n]+)"?/)[1].replace(/\\n/g, '').trim()
  return { url, key }
}

const { url, key } = readEnv()
const sb = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })

const DEMO_PASSWORD = 'HHT-Demo-2026!'

// ---------- Demo data ----------

// All locations must match location_enum (gibraltar, marbella, estepona, sotogrande, san_roque,
// la_linea, manilva, casares, benahavis, fuengirola, mijas, other) and location_region
// (gibraltar, costa_del_sol_west, costa_del_sol_east).
const EMPLOYERS = [
  { email: 'demo+employer-sotogrande@householdtalent.demo', company: 'Casa del Mar', region: 'costa_del_sol_west', location: 'sotogrande' },
  { email: 'demo+employer-marbella@householdtalent.demo', company: 'Villa Aurora', region: 'costa_del_sol_west', location: 'marbella' },
  { email: 'demo+employer-mijas@householdtalent.demo', company: 'Cap Estate', region: 'costa_del_sol_west', location: 'mijas' },
  { email: 'demo+employer-estepona@householdtalent.demo', company: 'Belgravia House', region: 'costa_del_sol_west', location: 'estepona' },
  { email: 'demo+employer-gibraltar@householdtalent.demo', company: 'Rock Residence', region: 'gibraltar', location: 'gibraltar' },
]

// experience_preferred must be one of: private_household, luxury_hospitality, open_to_both
const ROLES = [
  { title: 'Live-in Nanny', role_type: 'Nanny / Childcare', position_type: 'live_in', employer_idx: 0, location: 'sotogrande', region: 'costa_del_sol_west', salary_band: '£40,000 - £50,000', languages: ['English', 'Spanish'], description: 'Two children aged 3 and 6. Warm professional family seeking experienced nanny for live-in role. School runs, activities, light cooking.', responsibilities: ['Childcare', 'School runs', 'Light meal prep', 'Educational activities'], experience_preferred: 'private_household', employment_type: 'full_time', hours_per_week: 50, plan: 'priority', plan_price: 295 },
  { title: 'Private Chef', role_type: 'Chef', position_type: 'live_in', employer_idx: 1, location: 'marbella', region: 'costa_del_sol_west', salary_band: '£60,000 - £80,000', languages: ['English'], description: 'Fine dining background required. Catering for principal couple plus regular guests. Mediterranean and dietary-aware menus.', responsibilities: ['Daily meals', 'Menu planning', 'Provisioning', 'Event catering'], experience_preferred: 'luxury_hospitality', employment_type: 'full_time', hours_per_week: 45, plan: 'professional', plan_price: 445 },
  { title: 'House Manager', role_type: 'House Manager', position_type: 'live_out', employer_idx: 2, location: 'mijas', region: 'costa_del_sol_west', salary_band: '£70,000 - £90,000', languages: ['English', 'French'], description: 'Manage a 12-room residence and oversee household staff of 6. Vendor coordination, budget management, principal liaison.', responsibilities: ['Staff oversight', 'Vendor management', 'Budget control', 'Principal liaison'], experience_preferred: 'private_household', employment_type: 'full_time', hours_per_week: 50, plan: 'extended', plan_price: 675 },
  { title: 'Live-in Housekeeper', role_type: 'Housekeeper', position_type: 'live_in', employer_idx: 1, location: 'marbella', region: 'costa_del_sol_west', salary_band: '£35,000 - £45,000', languages: ['English', 'Spanish'], description: 'Experienced housekeeper for a private 8-bedroom villa. Formal household, attention to detail essential.', responsibilities: ['Daily cleaning', 'Laundry & wardrobe care', 'Inventory', 'Hosting prep'], experience_preferred: 'private_household', employment_type: 'full_time', hours_per_week: 45, plan: 'priority', plan_price: 295 },
  { title: 'Personal Driver', role_type: 'Driver', position_type: 'live_out', employer_idx: 3, location: 'estepona', region: 'costa_del_sol_west', salary_band: '£45,000 - £55,000', languages: ['English'], description: 'Experienced chauffeur for principal family. Discrete, security-trained preferred. Modern fleet (Range Rover, S-Class).', responsibilities: ['School runs', 'Airport transfers', 'Family logistics', 'Vehicle maintenance'], experience_preferred: 'private_household', employment_type: 'full_time', hours_per_week: 45, plan: 'priority', plan_price: 295 },
  { title: 'Estate Manager', role_type: 'Property Manager', position_type: 'live_out', employer_idx: 0, location: 'sotogrande', region: 'costa_del_sol_west', salary_band: '£55,000 - £70,000', languages: ['English', 'Spanish'], description: 'Multi-property estate. Oversee maintenance, gardens, security, and seasonal staff. Hands-on operations role.', responsibilities: ['Property maintenance', 'Garden & pool oversight', 'Security coordination', 'Seasonal staffing'], experience_preferred: 'private_household', employment_type: 'full_time', hours_per_week: 50, plan: 'professional', plan_price: 445 },
  { title: 'Personal Assistant', role_type: 'Personal Assistant', position_type: 'live_out', employer_idx: 4, location: 'gibraltar', region: 'gibraltar', salary_band: '£40,000 - £55,000', languages: ['English', 'Spanish'], description: 'PA to UHNW principal. Calendar, travel, household coordination. Confidential, fast-paced environment.', responsibilities: ['Calendar management', 'Travel logistics', 'Event coordination', 'Household admin'], experience_preferred: 'open_to_both', employment_type: 'full_time', hours_per_week: 45, plan: 'professional', plan_price: 445 },
  { title: 'Tutor (Mandarin)', role_type: 'Tutor', position_type: 'live_out', employer_idx: 1, location: 'marbella', region: 'costa_del_sol_west', salary_band: '£35,000 - £50,000', languages: ['English', 'Mandarin'], description: 'After-school Mandarin tutoring for two children (ages 8 and 11). Native or near-native fluency required.', responsibilities: ['Daily Mandarin lessons', 'Cultural context', 'Homework support', 'Progress reporting'], experience_preferred: 'open_to_both', employment_type: 'part_time', hours_per_week: 20, plan: 'standard', plan_price: 165 },
  { title: 'Personal Trainer', role_type: 'Personal Trainer', position_type: 'live_out', employer_idx: 2, location: 'mijas', region: 'costa_del_sol_west', salary_band: '£40,000 - £60,000', languages: ['English', 'French'], description: 'Private trainer for principal. Strength, mobility, and Pilates background. Mornings only, 6 days a week.', responsibilities: ['Personal training sessions', 'Mobility work', 'Programme design', 'Nutrition guidance'], experience_preferred: 'luxury_hospitality', employment_type: 'part_time', hours_per_week: 30, plan: 'priority', plan_price: 295 },
  { title: 'Estate Couple', role_type: 'Estate Couple', position_type: 'live_in', employer_idx: 0, location: 'sotogrande', region: 'costa_del_sol_west', salary_band: '£70,000 - £90,000', languages: ['English'], description: 'Husband-and-wife team for residence and gardens. Housekeeper / handyman split. Independent cottage provided.', responsibilities: ['Housekeeping', 'Garden & maintenance', 'Hosting support', 'Property security'], experience_preferred: 'private_household', employment_type: 'full_time', hours_per_week: 50, plan: 'extended', plan_price: 675 },
  { title: 'Events Coordinator', role_type: 'Events Coordinator', position_type: 'live_out', employer_idx: 4, location: 'gibraltar', region: 'gibraltar', salary_band: '£40,000 - £55,000', languages: ['English', 'Spanish'], description: 'Coordinate private events, dinners, and seasonal celebrations. 6-12 events per year, plus regular hosting.', responsibilities: ['Event planning', 'Vendor coordination', 'Guest logistics', 'Budget management'], experience_preferred: 'open_to_both', employment_type: 'part_time', hours_per_week: 25, plan: 'standard', plan_price: 165 },
  { title: 'Newborn Maternity Nurse', role_type: 'Nanny / Childcare', position_type: 'live_in', employer_idx: 3, location: 'estepona', region: 'costa_del_sol_west', salary_band: '£60,000 - £80,000', languages: ['English'], description: 'Specialist maternity nurse for newborn (due in 6 weeks). 12-month engagement, with potential for nanny extension.', responsibilities: ['Newborn care', 'Sleep training', 'Breastfeeding support', 'Parent guidance'], experience_preferred: 'private_household', employment_type: 'full_time', hours_per_week: 50, plan: 'extended', plan_price: 675 },
]

const CANDIDATES = [
  { email: 'demo+cand-01@householdtalent.demo', salutation: 'Ms', full_name: 'Ana Ramirez', last_initial: 'R', headline: 'Senior Live-in Housekeeper', roles: ['Housekeeper'], location: 'marbella', languages: ['English', 'Spanish'], experience_years: 12, bio: 'Twelve years with UHNW families across the Costa del Sol. Formal household training. Discreet, detail-driven.', skills: ['Laundry & wardrobe', 'Formal service', 'Inventory'], driving_licence: 'full_clean', salary_min: 35000, salary_max: 45000, photo_seed: 21 },
  { email: 'demo+cand-02@householdtalent.demo', salutation: 'Mr', full_name: 'James Sullivan', last_initial: 'S', headline: 'Private Chef, Fine Dining', roles: ['Chef'], location: 'sotogrande', languages: ['English', 'French'], experience_years: 14, bio: 'Trained at two-Michelin-star background, 14 years in private households. Mediterranean and dietary-aware menus.', skills: ['Fine dining', 'Dietary planning', 'Wine pairing', 'Provisioning'], driving_licence: 'full_clean', salary_min: 60000, salary_max: 80000, photo_seed: 22 },
  { email: 'demo+cand-03@householdtalent.demo', salutation: 'Ms', full_name: 'Laura Costa', last_initial: 'C', headline: 'Nanny / Childcare Specialist', roles: ['Nanny / Childcare'], location: 'gibraltar', languages: ['English', 'Spanish', 'Portuguese'], experience_years: 8, bio: 'Eight years with UHNW families. Newborn through school-age. Paediatric first aid certified, Norland-trained ethos.', skills: ['Newborn care', 'School support', 'Safeguarding', 'Activity planning'], driving_licence: 'full_clean', salary_min: 38000, salary_max: 48000, photo_seed: 23 },
  { email: 'demo+cand-04@householdtalent.demo', salutation: 'Mr', full_name: 'David Pereira', last_initial: 'P', headline: 'House Manager / Estate Manager', roles: ['House Manager', 'Property Manager'], location: 'estepona', languages: ['English', 'Spanish'], experience_years: 16, bio: 'Sixteen years managing multi-property estates. Former hotel ops director. Calm, systematic, hands-on.', skills: ['Staff management', 'Vendor coordination', 'Budgeting', 'Project oversight'], driving_licence: 'full_clean', salary_min: 60000, salary_max: 85000, photo_seed: 24 },
  { email: 'demo+cand-05@householdtalent.demo', salutation: 'Ms', full_name: 'Sophie Bernard', last_initial: 'B', headline: 'Personal Assistant to UHNW Principals', roles: ['Personal Assistant'], location: 'marbella', languages: ['English', 'French', 'Spanish'], experience_years: 11, bio: 'Eleven years supporting UHNW principals. Calendar, travel, household admin. Discreet, fluent across three languages.', skills: ['Calendar & travel', 'Event planning', 'Household admin', 'Confidentiality'], driving_licence: 'full_clean', salary_min: 45000, salary_max: 60000, photo_seed: 25 },
  { email: 'demo+cand-06@householdtalent.demo', salutation: 'Mr', full_name: 'Robert Greene', last_initial: 'G', headline: 'Chauffeur / Personal Driver', roles: ['Driver'], location: 'gibraltar', languages: ['English'], experience_years: 18, bio: 'Eighteen years as principal chauffeur. Security-trained (advanced driving). Familiar with London, Cotswolds, and Côte d\'Azur.', skills: ['Advanced driving', 'Security awareness', 'Vehicle maintenance', 'Discretion'], driving_licence: 'full_clean', salary_min: 50000, salary_max: 65000, photo_seed: 26 },
  { email: 'demo+cand-07@householdtalent.demo', salutation: 'Ms', full_name: 'Isabel Torres', last_initial: 'T', headline: 'Senior Nanny / Maternity Nurse', roles: ['Nanny / Childcare'], location: 'sotogrande', languages: ['English', 'Spanish'], experience_years: 10, bio: 'Ten years with newborns and infants. Sleep training specialist. Norland-aligned approach.', skills: ['Newborn care', 'Sleep training', 'Breastfeeding support', 'Routine setting'], driving_licence: 'full_clean', salary_min: 50000, salary_max: 70000, photo_seed: 27 },
  { email: 'demo+cand-08@householdtalent.demo', salutation: 'Mr', full_name: 'Marco Rossi', last_initial: 'R', headline: 'Private Chef, Italian & Mediterranean', roles: ['Chef'], location: 'marbella', languages: ['English', 'Italian', 'Spanish'], experience_years: 9, bio: 'Italian fine dining background. Nine years private households. Pasta, seafood, traditional Italian craft.', skills: ['Italian cuisine', 'Mediterranean menus', 'Seafood', 'Hosting'], driving_licence: 'full_clean', salary_min: 50000, salary_max: 65000, photo_seed: 28 },
  { email: 'demo+cand-09@householdtalent.demo', salutation: 'Ms', full_name: 'Eleanor Hayes', last_initial: 'H', headline: 'Housekeeper / Lady\'s Maid', roles: ['Housekeeper'], location: 'gibraltar', languages: ['English'], experience_years: 13, bio: 'Thirteen years in formal Belgravia households. Couture wardrobe management, silver service trained.', skills: ['Wardrobe management', 'Silver service', 'Antique care', 'Discretion'], driving_licence: 'full_clean', salary_min: 38000, salary_max: 50000, photo_seed: 29 },
  { email: 'demo+cand-10@householdtalent.demo', salutation: 'Mr', full_name: 'Henry Walker', last_initial: 'W', headline: 'Estate Manager (UK & Spain)', roles: ['Property Manager', 'House Manager'], location: 'sotogrande', languages: ['English', 'Spanish'], experience_years: 20, bio: 'Twenty years managing principal estates UK and Spain. Construction projects, staff management, security.', skills: ['Construction oversight', 'Staff management', 'Security', 'Multi-property'], driving_licence: 'full_clean', salary_min: 70000, salary_max: 100000, photo_seed: 30 },
  { email: 'demo+cand-11@householdtalent.demo', salutation: 'Ms', full_name: 'Mei Lin', last_initial: 'L', headline: 'Mandarin & English Tutor', roles: ['Tutor'], location: 'marbella', languages: ['English', 'Mandarin'], experience_years: 7, bio: 'Cambridge-trained, native Mandarin. Seven years tutoring 5-15 age range. Cultural context and exam prep.', skills: ['Mandarin tutoring', 'Cultural fluency', 'Exam prep', 'Reading & writing'], driving_licence: 'full_clean', salary_min: 35000, salary_max: 45000, photo_seed: 31 },
  { email: 'demo+cand-12@householdtalent.demo', salutation: 'Mr', full_name: 'Karim Benali', last_initial: 'B', headline: 'Personal Trainer & Wellness Coach', roles: ['Personal Trainer'], location: 'mijas', languages: ['English', 'French', 'Arabic'], experience_years: 9, bio: 'Strength, mobility, Pilates. Worked with high-net-worth principals across Monaco and Geneva.', skills: ['Strength training', 'Pilates', 'Mobility', 'Nutrition'], driving_licence: 'full_clean', salary_min: 40000, salary_max: 60000, photo_seed: 32 },
  { email: 'demo+cand-13@householdtalent.demo', salutation: 'Ms', full_name: 'Patricia Jones', last_initial: 'J', headline: 'Senior Housekeeper', roles: ['Housekeeper'], location: 'gibraltar', languages: ['English', 'Spanish'], experience_years: 22, bio: 'Twenty-two years in Gibraltar and southern Spain. Long-tenure references. Quiet, methodical, dependable.', skills: ['Daily cleaning', 'Linens', 'Inventory', 'Long-tenure references'], driving_licence: 'full_clean', salary_min: 30000, salary_max: 38000, photo_seed: 33 },
  { email: 'demo+cand-14@householdtalent.demo', salutation: 'Mr', full_name: 'Philippe Dubois', last_initial: 'D', headline: 'Butler / House Manager', roles: ['House Manager'], location: 'mijas', languages: ['English', 'French', 'Italian'], experience_years: 17, bio: 'Trained at the Ivor Spencer school. Seventeen years in Monaco and Côte d\'Azur. Formal service.', skills: ['Formal service', 'Wine cellar', 'Hosting', 'Discretion'], driving_licence: 'full_clean', salary_min: 65000, salary_max: 85000, photo_seed: 34 },
  { email: 'demo+cand-15@householdtalent.demo', salutation: 'Ms', full_name: 'Olivia King', last_initial: 'K', headline: 'Events Coordinator & Hosting Specialist', roles: ['Events Coordinator'], location: 'marbella', languages: ['English'], experience_years: 8, bio: 'Hospitality and private events background. Specialist in 50-200 person principal events.', skills: ['Event planning', 'Vendor management', 'Guest logistics', 'Hosting'], driving_licence: 'full_clean', salary_min: 38000, salary_max: 50000, photo_seed: 35 },
  { email: 'demo+cand-16@householdtalent.demo', salutation: 'Mr', full_name: 'Antonio Garcia', last_initial: 'G', headline: 'Estate Couple (with Maria)', roles: ['Estate Couple'], location: 'sotogrande', languages: ['English', 'Spanish'], experience_years: 15, bio: 'Husband-wife team, 15 years estate work. Garden, maintenance, housekeeping split.', skills: ['Garden & pool', 'Maintenance', 'Driving', 'Cooking'], driving_licence: 'full_clean', salary_min: 60000, salary_max: 80000, photo_seed: 36 },
  { email: 'demo+cand-17@householdtalent.demo', salutation: 'Ms', full_name: 'Catherine Mills', last_initial: 'M', headline: 'Personal Assistant & Lifestyle Manager', roles: ['Personal Assistant'], location: 'gibraltar', languages: ['English', 'French'], experience_years: 12, bio: 'Twelve years supporting UHNW families. Calendar, travel, lifestyle management, confidential matters.', skills: ['Calendar', 'Travel', 'Lifestyle management', 'Confidentiality'], driving_licence: 'full_clean', salary_min: 50000, salary_max: 65000, photo_seed: 37 },
  { email: 'demo+cand-18@householdtalent.demo', salutation: 'Mr', full_name: 'Tom Anderson', last_initial: 'A', headline: 'Chauffeur (Security-Trained)', roles: ['Driver'], location: 'gibraltar', languages: ['English'], experience_years: 11, bio: 'Former police, 11 years private chauffeur. Advanced security-driving certified. Cross-border familiarity.', skills: ['Security driving', 'Route planning', 'Vehicle maintenance', 'Risk awareness'], driving_licence: 'full_clean', salary_min: 45000, salary_max: 55000, photo_seed: 38 },
  { email: 'demo+cand-19@householdtalent.demo', salutation: 'Ms', full_name: 'Rachel Thompson', last_initial: 'T', headline: 'Maternity Nurse / Newborn Specialist', roles: ['Nanny / Childcare'], location: 'gibraltar', languages: ['English'], experience_years: 14, bio: 'Norland-trained maternity nurse. Fourteen years exclusively newborn (0-12 months). Sleep training expert.', skills: ['Newborn care', 'Sleep training', 'Breastfeeding', 'Parent guidance'], driving_licence: 'full_clean', salary_min: 65000, salary_max: 85000, photo_seed: 39 },
  { email: 'demo+cand-20@householdtalent.demo', salutation: 'Ms', full_name: 'Valentina Russo', last_initial: 'R', headline: 'Live-in Housekeeper / Cook', roles: ['Housekeeper', 'Chef'], location: 'marbella', languages: ['English', 'Italian', 'Spanish'], experience_years: 9, bio: 'Combined housekeeper-cook role. Italian family background. Comfortable cooking for 6-12 daily.', skills: ['Italian cooking', 'Daily cleaning', 'Linens', 'Light hosting'], driving_licence: 'full_clean', salary_min: 32000, salary_max: 42000, photo_seed: 40 },
]

// 6 introductions in different states for the admin dashboard to look populated.
// candidate_idx + role_idx into the arrays above. status describes the lane.
// Messages are written by the EMPLOYER to the candidate when requesting an introduction.
const INTRODUCTIONS = [
  { candidate_idx: 0, role_idx: 3, status: 'pending', message: 'Your formal household experience looks like a strong fit for our Marbella residence. Would welcome a conversation.' },
  { candidate_idx: 1, role_idx: 1, status: 'approved', message: 'Your fine dining background reads exactly like what we are looking for. Could you let us know your availability?' },
  { candidate_idx: 2, role_idx: 0, status: 'introduced', message: 'Your experience with children of similar ages stood out. Would love to introduce you to the family.' },
  { candidate_idx: 3, role_idx: 5, status: 'introduced', message: 'Your multi-property estate background is exactly the experience we need. Looking forward to connecting.' },
  { candidate_idx: 11, role_idx: 8, status: 'pending', message: 'Your mornings-only schedule and strength-and-mobility focus aligns perfectly with the principal\'s programme.' },
  { candidate_idx: 18, role_idx: 11, status: 'approved', message: 'Your newborn-specialist experience is exactly what we need ahead of the baby\'s arrival. Could we arrange an introduction?' },
]

// ---------- Helpers ----------

function pollinationsPhoto(seed, prompt) {
  const safe = encodeURIComponent(prompt)
  return `https://image.pollinations.ai/prompt/${safe}?width=600&height=600&seed=${seed}&nologo=true&model=flux`
}

function photoFor(c) {
  // Generic editorial portrait prompt — neutral background, professional lighting.
  // The site blurs photos publicly anyway, so what matters is they look like real people.
  const ageBracket = c.experience_years > 12 ? '40s' : c.experience_years > 6 ? '30s' : '20s'
  const gender = c.salutation === 'Mr.' ? 'man' : 'woman'
  const prompt = `professional editorial portrait photograph, ${ageBracket} ${gender}, warm natural lighting, neutral studio background, looking at camera, professional household staff, dignified expression, soft focus, magazine quality`
  return pollinationsPhoto(c.photo_seed, prompt)
}

async function findOrCreateUser(email) {
  // List users (paginate) to find by email — Supabase Admin API doesn't expose getUserByEmail directly.
  let page = 1
  while (page < 10) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const found = data.users.find(u => u.email === email)
    if (found) return { id: found.id, created: false }
    if (data.users.length < 200) break
    page++
  }
  const { data, error } = await sb.auth.admin.createUser({
    email,
    password: DEMO_PASSWORD,
    email_confirm: true,
  })
  if (error) throw error
  return { id: data.user.id, created: true }
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// ---------- Seeding ----------

async function seedEmployers() {
  const out = []
  for (const e of EMPLOYERS) {
    const { id, created } = await findOrCreateUser(e.email)
    console.log(`employer ${created ? 'created' : 'exists'}: ${e.email} (user_id ${id})`)

    // ensure profile row exists for this user (profiles.id == auth.users.id) + force values
    const { data: profileRow } = await sb.from('profiles').select('id').eq('id', id).maybeSingle()
    if (!profileRow) {
      const { error } = await sb.from('profiles').insert({
        id,
        role: 'employer',
        first_name: e.company,
        last_name: 'Demo',
        email: e.email,
      })
      if (error) console.warn(`  profile insert warning: ${error.message}`)
    } else {
      await sb.from('profiles').update({
        role: 'employer',
        first_name: e.company,
        last_name: 'Demo',
        email: e.email,
      }).eq('id', id)
    }

    // upsert employer_profile and capture its id (FK target for roles)
    let { data: existing } = await sb.from('employer_profiles').select('id').eq('user_id', id).maybeSingle()
    if (!existing) {
      const { data, error } = await sb.from('employer_profiles').insert({
        user_id: id,
        company_name: e.company,
        location: e.location,
        location_region: e.region,
        tier: 'basic',
      }).select('id').single()
      if (error) {
        console.warn(`  employer_profile insert warning: ${error.message}`)
        continue
      }
      existing = data
    } else {
      await sb.from('employer_profiles').update({
        company_name: e.company,
        location: e.location,
        location_region: e.region,
      }).eq('id', existing.id)
    }

    out.push({ ...e, user_id: id, employer_profile_id: existing.id })
  }
  return out
}

async function seedRoles(employers) {
  const out = []
  for (let i = 0; i < ROLES.length; i++) {
    const r = ROLES[i]
    const employer = employers[r.employer_idx]
    if (!employer || !employer.employer_profile_id) {
      console.warn(`role skipped (no employer profile): ${r.title}`)
      continue
    }
    // Idempotent: skip if a role with same title + employer already exists
    const { data: existing } = await sb.from('roles').select('id').eq('employer_id', employer.employer_profile_id).eq('title', r.title).maybeSingle()
    if (existing) {
      console.log(`role exists: ${r.title} (${employer.company})`)
      out.push({ id: existing.id, idx: i })
      continue
    }
    const { data, error } = await sb.from('roles').insert({
      employer_id: employer.employer_profile_id,
      title: r.title,
      role_type: r.role_type,
      position_type: r.position_type,
      location: r.location,
      location_region: r.region,
      responsibilities: r.responsibilities,
      experience_preferred: r.experience_preferred,
      employment_type: r.employment_type,
      languages: r.languages,
      hours_type: 'fixed',
      hours_per_week: r.hours_per_week,
      salary_band: r.salary_band,
      description: r.description,
      listing_tier: 'standard',
      status: 'active',
      plan: r.plan,
      plan_price: r.plan_price,
    }).select('id').single()
    if (error) {
      console.warn(`role insert failed for ${r.title}: ${error.message}`)
      continue
    }
    console.log(`role created: ${r.title} (${employer.company}) -> ${data.id}`)
    out.push({ id: data.id, idx: i })
  }
  return out
}

async function seedCandidates() {
  const out = []
  for (let i = 0; i < CANDIDATES.length; i++) {
    const c = CANDIDATES[i]
    const { id } = await findOrCreateUser(c.email)
    const photo = photoFor(c)
    const slug = slugify(`${c.salutation.replace('.', '')} ${c.last_initial} ${c.headline}-${i + 1}`)

    // ensure profile row exists (FK target for candidate_profiles.user_id) + update names
    const firstName = c.full_name.split(' ').slice(0, -1).join(' ') || c.full_name
    const lastName = c.full_name.split(' ').slice(-1)[0] || 'Demo'
    const { data: profileRow } = await sb.from('profiles').select('id').eq('id', id).maybeSingle()
    if (!profileRow) {
      const { error } = await sb.from('profiles').insert({
        id,
        role: 'candidate',
        first_name: firstName,
        last_name: lastName,
        email: c.email,
      })
      if (error) console.warn(`  profile insert warning: ${error.message}`)
    } else {
      await sb.from('profiles').update({
        role: 'candidate',
        first_name: firstName,
        last_name: lastName,
        email: c.email,
      }).eq('id', id)
    }

    const { data: existing } = await sb.from('candidate_profiles').select('id').eq('user_id', id).maybeSingle()
    if (existing) {
      // update with current demo values so re-runs refresh data
      const { error } = await sb.from('candidate_profiles').update({
        slug,
        full_name: c.full_name,
        salutation: c.salutation,
        headline: c.headline,
        bio: c.bio,
        roles: c.roles,
        skills: c.skills,
        languages: c.languages,
        location: c.location,
        experience_years: c.experience_years,
        photos: [photo],
        driving_licence: c.driving_licence,
        salary_min: c.salary_min,
        salary_max: c.salary_max,
        salary_expectation_min: c.salary_min,
        salary_expectation_max: c.salary_max,
        availability: '1_month',
        status: 'active',
        public_listing_consent: true,
        public_listing_consent_at: new Date().toISOString(),
      }).eq('id', existing.id)
      if (error) console.warn(`  candidate_profile update warning: ${error.message}`)
      console.log(`candidate updated: ${c.email}`)
      out.push({ id: existing.id, user_id: id, idx: i })
      continue
    }

    const { data, error } = await sb.from('candidate_profiles').insert({
      user_id: id,
      slug,
      full_name: c.full_name,
      salutation: c.salutation,
      headline: c.headline,
      bio: c.bio,
      roles: c.roles,
      skills: c.skills,
      languages: c.languages,
      location: c.location,
      experience_years: c.experience_years,
      photos: [photo],
      driving_licence: c.driving_licence,
      salary_min: c.salary_min,
      salary_max: c.salary_max,
      salary_expectation_min: c.salary_min,
      salary_expectation_max: c.salary_max,
      availability: '1_month',
      status: 'active',
      tier: 'free',
      public_listing_consent: true,
      public_listing_consent_at: new Date().toISOString(),
    }).select('id').single()
    if (error) {
      console.warn(`candidate insert failed for ${c.email}: ${error.message}`)
      continue
    }

    await sb.from('user_roles').upsert({ user_id: id, role: 'candidate' }, { onConflict: 'user_id,role' }).then(({ error }) => {
      if (error && !error.message.includes('does not exist')) console.warn(`  user_roles warning: ${error.message}`)
    })

    console.log(`candidate created: ${c.email} -> ${data.id}`)
    out.push({ id: data.id, user_id: id, idx: i })
  }
  return out
}

async function seedIntroductions(candidates, roles, employers) {
  for (const intro of INTRODUCTIONS) {
    const candidate = candidates[intro.candidate_idx]
    const roleEntry = roles.find(r => r.idx === intro.role_idx)
    if (!candidate || !roleEntry) continue
    const roleSpec = ROLES[intro.role_idx]
    const employer = employers[roleSpec.employer_idx]
    if (!employer || !employer.employer_profile_id) continue

    const { data: existing } = await sb.from('contact_requests')
      .select('id')
      .eq('employer_id', employer.employer_profile_id)
      .eq('candidate_id', candidate.id)
      .eq('role_id', roleEntry.id)
      .maybeSingle()
    if (existing) {
      await sb.from('contact_requests').update({ message: intro.message }).eq('id', existing.id)
      console.log(`intro exists (message updated): cand${intro.candidate_idx + 1} -> role${intro.role_idx + 1}`)
      continue
    }

    const row = {
      employer_id: employer.employer_profile_id,
      candidate_id: candidate.id,
      role_id: roleEntry.id,
      message: intro.message,
      status: intro.status === 'introduced' ? 'introduced' : (intro.status === 'approved' ? 'approved' : 'pending'),
    }
    if (intro.status === 'approved' || intro.status === 'introduced') {
      row.admin_approved_at = new Date(Date.now() - 86400000).toISOString()
      row.candidate_consent = intro.status === 'introduced' ? 'accepted' : 'pending'
      if (intro.status === 'introduced') {
        row.candidate_consent_at = new Date().toISOString()
        row.introduced_at = new Date().toISOString()
      }
    }
    const { error } = await sb.from('contact_requests').insert(row)
    if (error) {
      console.warn(`intro insert failed: ${error.message}`)
      continue
    }
    console.log(`intro created: cand${intro.candidate_idx + 1} -> role${intro.role_idx + 1} (${intro.status})`)
  }
}

// ---------- Main ----------

(async () => {
  console.log('Seeding demo data into', url)
  console.log('---')
  const employers = await seedEmployers()
  console.log('---')
  const roles = await seedRoles(employers)
  console.log('---')
  const candidates = await seedCandidates()
  console.log('---')
  await seedIntroductions(candidates, roles, employers)
  console.log('---')
  console.log('Done.')
})().catch(err => {
  console.error('FAILED:', err)
  process.exit(1)
})

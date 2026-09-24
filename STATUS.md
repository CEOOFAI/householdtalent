# HouseHoldTalent — Project Status

*Last updated: 2026-06-02*

## Where this project is right now

**Client:** Heinz (website copy uses her brand name "Yolanda" — same person, two names)
**Repo:** `projects/householdtalent/`
**Live preview:** https://householdtalent.vercel.app
**Custom domain:** `householdtalent.com` — NOT pointed at Vercel yet. Stays on holding setup until Heinz gives final sign-off.
**Supabase project ref:** `lfwleishyymbxynlcaik` (region: West Europe London)
**Admin account:** `gibppa@gmail.com` (Heinz's account)

---

## State as of 2026-06-02

### What shipped today

**Round 2 from Heinz (5 updates + Lead Housekeeper role):**

1. **Countdown timers** — all 12 placeholder roles had the same expiry date (all seeded 2026-05-07, no explicit deadline). Updated `application_deadline` in Supabase directly to spread them 10-42 days. Now look natural.

2. **Reference verification** — Heinz said "still outstanding" but it was fully built in the previous session. Clarified to her in email: Admin → Candidates → Verification column → "Manage" link opens the full modal (status, notes, Gold Verified toggle, police check viewer). No code change needed.

3. **Pricing subtitle** — "No commissions." → "No commission. Just curated introductions."

4. **Premium candidate button** — "Request Access" → "Upgrade My Profile"

5. **Contact dropdown** — "Recruitment Professional" added as option between "Candidate looking for work" and "Other"

6. **Lead Housekeeper Gibraltar role** — inserted directly into Supabase. Full description from Heinz's brief (Mon-Fri 11:15-7:15, Sat mornings, DOE, ASAP start). Live on /jobs with 30-day deadline.

**Bug fixes shipped today:**

- **404 on /jobs/[id]** — root cause: listing page bypasses RLS using service role key, but detail page used auth client → anon visitors got null → `notFound()`. Fixed detail page to use same service role client. Applies to ALL role detail pages, not just Lead Housekeeper.

- **"Starts Invalid Date"** — `start_date = 'ASAP'` was being passed to `new Date()`, returning Invalid Date object (no throw = catch never fired). Fixed `formatStartDate` to check `isNaN(parsed.getTime())` and return raw string if not a valid date.

**Round 3 from Heinz (pricing restructure):**

Heinz wants HHT to stay at the centre of all introductions (not release contact details — keeps premium positioning). Also restructured the three employer tiers:

- **Standard (£165):** 1 live role for 30 days. No replacement roles. Access to curated candidate network. Employer and candidate introduction requests. HHT-facilitated introductions.
- **Ongoing Hiring (£295):** Up to 2 live roles. 1 replacement role if position filled within 30 days. All Standard features.
- **Priority Search (£445):** Everything in Ongoing Hiring + priority visibility to suitable candidates + dedicated talent search + proactive candidate outreach + role-specific suitability questionnaire + professional referee feedback obtained and summarised + curated shortlist delivered.

Footer note on plan cards updated per-tier (Standard: "One active role for the full 30-day period. Upgrade to add replacement roles." Others: "Replacement roles available within your 30-day access period.")

**Pitch email rewrites:**
Heinz sent two outreach pitch drafts for candidate sourcing. Reviewed through Daniel G Sales Game framework. Both originals led with the platform not the person — failed rule one. Rewrote both. Heinz approved with one wording tweak (her "private households, family offices and estates" description incorporated, but selectivity signal preserved). Final versions in email chain.

**Stress test — all green:**
Full end-to-end Playwright test run. Candidate registration, application submission, DB record creation, dashboard "Pending Review" state, admin protection (non-admins redirected), employer registration, role detail pages, pricing page, contact page. All flows working. Test candidate cleaned up from DB.

---

## Open questions — waiting on Heinz

These were sent in the 2026-05-26 email. Still no answer on all four:

1. **Candidate references** — where do we capture contact details? Recommendation: post-acceptance in member dashboard (not application form).
2. **Employer vetting** — gated or async? Recommendation: gated (symmetric trust on both sides).
3. **Founding member count** — set a real number or keep vague? Recommendation: set internal target, surface "X of Y places remaining".
4. **Gold Verified expiry** — 12-month expiry with renewal nudge, or permanent? Recommendation: 12 months (DBS goes stale, permanent badge is indefensible in writing).

---

## Email infrastructure

**Built and ready, waiting on one credential.**

- Resend SDK installed
- `src/lib/email.ts` — HTML wrapper, plain-text footer, no-ops if `RESEND_API_KEY` missing
- `src/lib/candidate-status-emails.ts` — three locked templates (Accepted / Waitlisted / Declined) with Heinz's exact copy
- API route `src/app/api/admin/candidate-status/route.ts` triggers status update + matching email atomically
- Sender = `hello@householdtalent.com`

**Action required from Ethan (5 min) when Heinz gives the go-ahead:**
1. Sign in at resend.com
2. Add domain `householdtalent.com`, paste DNS records into Cloudflare
3. Create API key
4. Add to Vercel HHT project env vars: `RESEND_API_KEY`
5. Redeploy

---

## Next layer of work (queued behind Heinz's answers)

1. **Resend live** — one-shot when key arrives
2. **References workflow** — implementation depends on Q1 answer
3. **Employer vetting workflow** — depends on Q2 answer
4. **Founding member counter** — depends on Q3 answer
5. **Gold Verified expiry job** — depends on Q4 answer
6. **Lifecycle emails** — acceptance welcome, reference verification in progress, Gold Verified achieved, employer brief receipt + shortlist ready
7. **Domain switch** — point `householdtalent.com` at Vercel once Heinz signs off

---

## Known technical note — referee feedback bottleneck

Priority Search now promises "Professional referee feedback obtained and summarised." At £445 this is manageable at low volume. As client count grows, Heinz needs to know how long each referee call takes so she can price accordingly. Flag before launch if Priority Search volume starts picking up.

---

## Deploy method (do not deviate)

```
cd projects/householdtalent
vercel --prod --yes
```

Aliases automatically to `householdtalent.vercel.app`. Do NOT push to git remote and rely on auto-deploy.

## Schema migration deploy method

Migrations live in `supabase/migrations/`. Apply to production via Supabase Management API with `SUPABASE_ACCESS_TOKEN` from `.env`:

```js
node -e "
const fs = require('fs');
const sql = fs.readFileSync('supabase/migrations/0XX_name.sql', 'utf8');
fetch('https://api.supabase.com/v1/projects/lfwleishyymbxynlcaik/database/query', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + process.env.SUPABASE_ACCESS_TOKEN,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query: sql })
}).then(r => r.text()).then(console.log);
"
```

201 status with `[]` body = success on DDL.

---

## Files created or modified (2026-05-26 session)

- `supabase/migrations/018_reference_verification.sql`
- `src/lib/email.ts`
- `src/lib/candidate-status-emails.ts`
- `src/app/api/admin/candidate-status/route.ts`
- `src/app/api/admin/candidate-verification/route.ts`
- `src/app/api/admin/police-check-url/route.ts`
- `src/app/admin/candidates/verification-modal.tsx`
- `src/app/dashboard/candidate/verification-card.tsx`

## Files modified (2026-06-02 session)

- `src/app/(public)/pricing/page.tsx` — subtitle, button, full tier restructure, per-plan footer notes
- `src/app/(public)/contact/page.tsx` — "Recruitment Professional" dropdown option
- `src/app/(public)/jobs/[id]/page.tsx` — RLS bypass (service role client), Invalid Date fix

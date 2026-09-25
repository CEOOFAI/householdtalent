# HouseHoldTalent — Project Status

*Last updated: 2026-09-25*

## Where things live
- **Code:** GitHub `CEOOFAI/householdtalent` (`main` = production)
- **Hosting:** Vercel project `householdtalent` (team "ceoofai's projects"), auto-deploys from `main`
- **Live URL:** https://householdtalent.vercel.app (custom domain `householdtalent.com` not pointed yet)
- **Database/Auth/Storage:** Supabase project `lfwleishyymbxynlcaik` (London). Free plan: pauses after ~7 days without traffic.
- **Package manager:** pnpm (`pnpm-lock.yaml`)

## Environment variables (Vercel → Settings → Environment Variables)
| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lfwleishyymbxynlcaik.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase **publishable** key (`sb_publishable_…`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase **secret** key (`sb_secret_…`), server only |
| `NEXT_PUBLIC_APP_URL` | `https://householdtalent.vercel.app` (change when the domain goes live) |
| `ANTHROPIC_API_KEY` | AI role briefs / CV tooling |
| `RESEND_API_KEY` | not set yet: emails are skipped until it is |
| `STRIPE_*` | not wired yet (payments are the last launch item) |

Never commit `.env.local`. It is git-ignored.

## Database migrations
Files in `supabase/migrations/`, applied in order.
- 019 lock admin role: applied
- 020 guard self-service fields + ai_usage: applied
- 021 private candidate data: **apply right after the September 2026 deploy**
- 022 two-way consent + private admin notes + file paths: **apply right after the September 2026 deploy**

## How introductions work
1. Employer requests a candidate (from search) **or** an approved candidate expresses interest in a live role.
2. HHT (admin) approves or declines in `/admin/introductions`.
3. The other side confirms: candidate confirms employer requests; employer confirms candidate interest.
4. Status becomes `introduced`; the employer sees contact details and HHT facilitates.

Employers only ever see anonymised candidate cards (server-side, `src/lib/candidates/employer-view.ts`).

## Open items
1. **Stripe:** employer packages (£165 / £295 / £445), agency partner billing, CV services checkout.
2. **Email:** Resend domain + key; then switch off the auto-confirm signup trigger.
3. **Domain:** point `householdtalent.com` at Vercel, update `NEXT_PUBLIC_APP_URL`.
4. **Plan limits/expiry:** enforce live-role limits and 30-day expiry once payments exist.
5. **Supabase paid plan** (stops auto-pausing) and **Vercel Pro** (Hobby plan is non-commercial) before charging customers.
6. Owner to confirm: Terms "HHT Approved is not a background check" wording, CV refund line, showcase cards are illustrative.

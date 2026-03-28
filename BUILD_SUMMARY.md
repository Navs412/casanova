# Casanova PWA — Build Summary

**Built:** March 2026
**Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Supabase + Stripe + Framer Motion
**Build Status:** `npm run build` passes with zero errors

---

## Files Created

### Configuration
| File | Purpose |
|------|---------|
| `.env.local.example` | All required environment variables |
| `src/app/globals.css` | Tailwind v4 with Casanova design tokens |
| `public/manifest.json` | PWA manifest |
| `public/sw.js` | Service worker (cache-first static, network-first API) |
| `src/middleware.ts` | Auth guard for `/app/*` routes |

### Database
| File | Purpose |
|------|---------|
| `supabase/schema.sql` | Full schema: profiles, sessions, messages, daily_scenarios + RLS + functions |
| `supabase/seed.sql` | 6 aha moment scenarios |

### Types & Libraries
| File | Purpose |
|------|---------|
| `src/types/index.ts` | All TypeScript types (Archetype, Session, Message, Profile, etc.) |
| `src/types/speech.d.ts` | Web Speech API type declarations |
| `src/lib/supabase/client.ts` | Browser Supabase client |
| `src/lib/supabase/server.ts` | Server Supabase client (SSR) |
| `src/lib/system-prompt.ts` | Full Casanova system prompt V3.1 + Privacy Addendum + builder function |
| `src/lib/arts-detector.ts` | Regex-based arts detection from assistant responses |

### API Routes (13 endpoints)
| File | Methods | Purpose |
|------|---------|---------|
| `src/app/api/auth/signup/route.ts` | POST | Create account |
| `src/app/api/auth/login/route.ts` | POST | Sign in |
| `src/app/api/auth/logout/route.ts` | POST | Sign out |
| `src/app/api/profile/route.ts` | GET, PATCH | Read/update user profile |
| `src/app/api/sessions/route.ts` | GET, POST | List/create sessions (with limit check) |
| `src/app/api/sessions/[id]/route.ts` | GET, PATCH | Get session + messages / end session |
| `src/app/api/chat/route.ts` | POST | Core coaching endpoint with streaming |
| `src/app/api/scenario/random/route.ts` | GET | Random scenario (no auth) |
| `src/app/api/stripe/create-checkout/route.ts` | POST | Create Stripe checkout session |
| `src/app/api/stripe/webhook/route.ts` | POST | Stripe webhook handler |
| `src/app/api/stripe/portal/route.ts` | POST | Stripe customer portal |
| `src/app/api/data/sessions/[id]/route.ts` | DELETE | Delete single session |
| `src/app/api/data/all/route.ts` | DELETE | Delete all user data |

### UI Components (10 components)
| File | Purpose |
|------|---------|
| `src/components/ui/Button.tsx` | Primary button (4 variants, 3 sizes, loading state) |
| `src/components/ui/Input.tsx` | Text input with label and error |
| `src/components/ui/ChatBubble.tsx` | Message bubble (user/assistant variants, streaming cursor) |
| `src/components/ui/ModeCard.tsx` | Mode selection card (Prep/Pause/Debrief) |
| `src/components/ui/ArchetypeBadge.tsx` | Archetype display (small badge or large reveal) |
| `src/components/layout/BottomNav.tsx` | Mobile bottom navigation |
| `src/components/layout/AppShell.tsx` | Authenticated app wrapper |
| `src/components/chat/ChatInterface.tsx` | Full chat UI with streaming + voice input |
| `src/components/chat/VoiceInput.tsx` | Web Speech API microphone (on-device transcription) |
| `src/components/onboarding/ArchetypeQuiz.tsx` | 4-question archetype discovery flow |

### Pages (8 pages)
| File | Route | Purpose |
|------|-------|---------|
| `src/app/page.tsx` | `/` | Landing page (hero, how it works, pricing, testimonials) |
| `src/app/try/page.tsx` | `/try` | Aha moment — no-auth instant coaching demo |
| `src/app/onboarding/page.tsx` | `/onboarding` | Archetype discovery quiz |
| `src/app/app/page.tsx` | `/app` | Dashboard (mode cards, daily scenario, progress) |
| `src/app/app/session/[id]/page.tsx` | `/app/session/:id` | Chat interface |
| `src/app/app/history/page.tsx` | `/app/history` | Session history list |
| `src/app/app/profile/page.tsx` | `/app/profile` | Profile, subscription, data management |
| `src/app/app/upgrade/page.tsx` | `/app/upgrade` | Pricing comparison + Stripe checkout |

---

## TODOs for Real Integration

### Supabase
- [ ] Set up Supabase project and run `supabase/schema.sql`
- [ ] Run `supabase/seed.sql` to populate aha moment scenarios
- [ ] Add real Supabase URL and keys to `.env.local`
- [ ] Replace mock data in all API routes with real Supabase queries (marked with `// TODO: Connect to real Supabase instance`)

### AI / KRONA
- [ ] Connect `/api/chat` to real AI backend (marked with `// TODO: Replace with real AI API call (KRONA)`)
- [ ] Currently streams a mock coaching response; replace with actual API call

### Stripe
- [ ] Create Stripe products and prices in dashboard
- [ ] Add real Stripe keys to `.env.local`
- [ ] Replace mock checkout/webhook/portal with real Stripe SDK calls (marked with `// TODO`)
- [ ] Set up webhook endpoint in Stripe dashboard

### PWA
- [ ] Generate real app icons (192x192 and 512x512 PNG)
- [ ] Test service worker caching in production

### Auth
- [ ] Middleware currently checks Supabase auth — will work once real Supabase is connected
- [ ] Add social login (Google, Apple) to signup flow

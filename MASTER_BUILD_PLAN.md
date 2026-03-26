# Casanova — Master Build Plan
## For KRONA Orchestration Agent

**Version:** 3.1 (Broader Human Connection Vision)
**Date:** March 2026
**Architecture:** PWA (Next.js) + KRONA AI Backend + Supabase + Stripe

---

## Project Overview

Casanova is a personal emotional intelligence coaching app that teaches humans how to communicate better with other humans to achieve mutually beneficial outcomes. It works across ALL relationship types: romantic, professional, platonic, familial, transactional. The core insight: the principles that make someone compelling in one context are the same principles that work in every context.

**This is NOT a dating app. This is a human connection operating system.**

---

## Agent Responsibilities

| Agent | Tool | Responsibility |
|-------|------|---------------|
| KRONA | Orchestrator | Reads all docs, delegates tasks, tracks progress, resolves conflicts |
| Claude Code | Backend | Supabase schema, API routes, Stripe integration, KRONA agent connection, auth, session management |
| Antigravity | Frontend | Next.js PWA, UI/UX, responsive design, voice input, Tailwind CSS, animations |

---

## Build Order (Critical Path)

### Phase 1: Foundation (Week 1-2)
1. **Claude Code:** Set up Next.js project with Supabase auth + database schema → see `specs/DATABASE_SCHEMA.md`
2. **Claude Code:** Implement Stripe subscription (Free / Pro / Annual) → see `specs/STRIPE_CONFIG.md`
3. **Antigravity:** Build core UI shell (landing page, app shell, navigation) → see `specs/UI_SPEC.md`
4. **KRONA:** Deploy Casanova agent with V3.1 system prompt → see `prompts/SYSTEM_PROMPT_V3_1.md`

### Phase 2: Core Features (Week 3-4)
5. **Claude Code:** Build conversation API (send message to KRONA, receive coaching response, store session)
6. **Claude Code:** Implement session memory (user messages persist, other-person messages are ephemeral)
7. **Antigravity:** Build the three mode UIs (Prep, Pause, Debrief) → see `specs/UI_SPEC.md`
8. **Antigravity:** Implement the Aha Moment (first-time scenario simulation) → see `specs/AHA_MOMENT.md`

### Phase 3: Voice + Onboarding (Week 5-6)
9. **Antigravity:** Implement Web Speech API voice input (on-device transcription, no audio transmitted)
10. **Antigravity:** Build conversational onboarding flow (archetype discovery) → see `specs/ONBOARDING.md`
11. **Claude Code:** Build user profile storage (archetype, arts practiced, session count, growth data)
12. **Claude Code:** Implement ephemeral message purge (other-person messages deleted after session close)

### Phase 4: Polish + Launch (Week 7-8)
13. **Antigravity:** PWA manifest, service worker, install prompt, responsive design audit
14. **Antigravity:** Landing page with "What Would You Say?" demo → see `specs/LANDING_PAGE.md`
15. **Claude Code:** Rate limiting, error handling, cost monitoring per session
16. **Both:** End-to-end testing across all three modes
17. **Deploy:** Vercel (frontend) + Supabase (backend) + KRONA (AI)

---

## File Index

| File | Purpose | Consumer |
|------|---------|----------|
| `prompts/SYSTEM_PROMPT_V3_1.md` | Complete Casanova system prompt (paste into KRONA) | KRONA |
| `prompts/PRIVACY_ADDENDUM.md` | Privacy rules to append to system prompt | KRONA |
| `specs/DATABASE_SCHEMA.md` | Supabase tables, RLS policies, types | Claude Code |
| `specs/API_ROUTES.md` | All API endpoints with request/response shapes | Claude Code |
| `specs/STRIPE_CONFIG.md` | Subscription tiers, pricing, webhook handling | Claude Code |
| `specs/UI_SPEC.md` | Complete frontend specification for all screens | Antigravity |
| `specs/AHA_MOMENT.md` | First-time user experience specification | Antigravity |
| `specs/ONBOARDING.md` | Archetype discovery flow specification | Antigravity + Claude Code |
| `specs/LANDING_PAGE.md` | Marketing landing page specification | Antigravity |
| `docs/COMPETITOR_ANALYSIS.md` | Market context for product decisions | KRONA (reference) |
| `docs/RISK_REGISTER.md` | All identified risks with mitigations | KRONA (reference) |

---

## Key Design Decisions

1. **PWA, not native app** — Skip app store approval, avoid 30% tax, deploy in hours not months
2. **Web Speech API for voice** — On-device transcription, raw audio never leaves the device
3. **Supabase for everything** — Auth, database, realtime, storage. One platform = less complexity
4. **Stripe for payments** — Direct billing, no app store middleman on PWA
5. **Session-based memory** — User messages persist for coaching continuity. Other-person messages are ephemeral (purged on session close)
6. **Archetype-first coaching** — Every user discovers their natural archetype during onboarding. All subsequent coaching is filtered through this lens.
7. **Progressive skill introduction** — The Seven Arts are introduced one at a time over sessions, not all at once

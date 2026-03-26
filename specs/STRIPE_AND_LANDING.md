# Stripe Configuration
## For Claude Code Backend Agent

---

## Products & Prices

Create in Stripe Dashboard:

| Product | Price ID | Amount | Interval | Trial |
|---------|----------|--------|----------|-------|
| Casanova Pro | `price_pro_monthly` | $9.99 | Monthly | 7 days free |
| Casanova Annual | `price_pro_annual` | $79.99 | Yearly | 7 days free |

## Checkout Flow

1. User taps "Upgrade to Pro" in app
2. Frontend calls `POST /api/stripe/create-checkout` with `{ tier: "pro" }` or `{ tier: "annual" }`
3. Backend creates Stripe Checkout Session with:
   - `mode: "subscription"`
   - `success_url: "{APP_URL}/app?upgrade=success"`
   - `cancel_url: "{APP_URL}/app/upgrade"`
   - `subscription_data.trial_period_days: 7`
   - `customer_email` from Supabase auth
   - `metadata.user_id` for webhook matching
4. Frontend redirects to Stripe Checkout
5. After payment, Stripe fires webhook → backend updates `profiles.subscription_tier`

## Webhook Events to Handle

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Set `subscription_tier = 'pro'` or `'annual'`, store `stripe_customer_id` and `stripe_subscription_id` |
| `customer.subscription.updated` | Update tier if plan changed |
| `customer.subscription.deleted` | Set `subscription_tier = 'free'` |
| `invoice.payment_failed` | Send in-app notification, grace period 7 days, then downgrade |

## Customer Portal

For managing subscription (cancel, change plan, update payment):
- Backend creates portal session via `stripe.billingPortal.sessions.create()`
- Frontend opens the returned URL

---

# Landing Page Specification
## For Antigravity Frontend Agent

**Route:** `/` (root)
**Purpose:** Convert visitors → aha moment → signup → paid

---

## Sections (top to bottom)

### Hero
- **Headline:** "Most people hope good conversations happen to them."
- **Subheadline:** "Casanova teaches you how to make them happen — with anyone, anywhere."
- **CTA Button:** "Try your first session free →" → links to `/try`
- **Supporting text:** "No signup required. 60 seconds to your first coaching insight."

### How It Works
Three cards, horizontal on desktop, vertical stacked on mobile:

1. **Prep** — "Before any conversation, Casanova helps you prepare. Specific openers, questions, and strategies tailored to your situation."
2. **Pause** — "In the middle of it? Step away for 30 seconds, tell Casanova what's happening, and get instant coaching."
3. **Debrief** — "After, review what went well and what to improve. Casanova tracks your growth over time."

### Use Cases
Four cards showing breadth (NOT dating-only):
- 💼 "Nail the networking event you've been dreading"
- 💬 "Know exactly what to say when the conversation stalls"
- 🤝 "Build the kind of friendships where people actually open up"
- 🎯 "Walk into any room and leave a lasting impression"

### The Nine Dimensions (brief)
- "Casanova discovers your natural communication archetype and coaches you to master it."
- Visual: 9 archetype icons/names in a grid
- "Which one are you? Find out in 2 minutes →" → links to `/try`

### Pricing
| | Free | Pro — $9.99/mo | Annual — $79.99/yr |
|---|---|---|---|
| Coaching sessions | 3/month | Unlimited | Unlimited |
| Voice mode | ❌ | ✅ | ✅ |
| All three modes | Prep only | Prep + Pause + Debrief | Prep + Pause + Debrief |
| Session memory | ❌ | ✅ | ✅ |
| Progress tracking | ❌ | ✅ | ✅ |
| | Free forever | 7-day free trial | Save 33% — 7-day free trial |

### Social Proof (placeholder)
- "Join [X] people who are becoming better communicators"
- 3 testimonial cards (use placeholder quotes initially, replace with real ones from beta)

### Footer
- Privacy Policy | Terms of Service | Contact
- "Your conversations with Casanova are private. We don't read them, we don't sell them, and you can delete them anytime."
- © 2026 Casanova

---

## SEO

```html
<title>Casanova — Your Personal EQ Coach</title>
<meta name="description" content="Learn the art of human connection. Casanova is an AI coach that helps you communicate better with anyone — in dating, at work, in friendships, everywhere." />
<meta property="og:title" content="Casanova — The Confidence You Wish You Had" />
<meta property="og:description" content="An AI coach that teaches you how to genuinely connect with anyone. Try it free." />
```

# UI Specification — Casanova PWA
## For Antigravity Frontend Agent

**Stack:** Next.js 14+ (App Router) + Tailwind CSS + Framer Motion
**Design System:** Minimal, warm, confident. Think: premium meditation app meets smart messaging app.
**Typography:** Inter (primary), JetBrains Mono (code/highlights)
**Color Palette:** Warm neutrals + one accent color

---

## Design Principles

1. **Warm, not clinical** — This is a personal coaching app, not a SaaS dashboard. Rounded corners, warm colors, breathing room.
2. **Fast, not fancy** — Every screen loads instantly. No unnecessary animations. Pause Mode must go from app-open to response in under 30 seconds.
3. **Text-first** — The product IS the conversation. The UI should get out of the way and let the coaching shine.
4. **Mobile-first** — 80%+ of usage will be on phones. Design for mobile, adapt for desktop.
5. **Accessible** — WCAG 2.1 AA minimum. High contrast text, focus indicators, screen reader support.

---

## Color Tokens (Tailwind config)

```js
colors: {
  casanova: {
    bg: '#FEFCF9',        // warm off-white background
    surface: '#FFF8F0',    // card/surface background
    text: '#1A1A2E',       // primary text
    muted: '#6B7280',      // secondary text
    accent: '#E94560',     // primary accent (warm red-pink)
    accentSoft: '#FEE2E8', // accent background
    blue: '#0F3460',       // secondary accent (deep blue)
    gold: '#D4A843',       // tertiary accent (warm gold)
    success: '#27AE60',
    border: '#E5E0D8',     // warm gray border
  }
}
```

Dark mode: invert to dark warm grays (#1A1A1E bg, #2A2A2E surface, #F5F0E8 text).

---

## Screens

### 1. Landing Page (`/`)
**Purpose:** Convert visitors to signups. No auth required.

**Layout:**
- Hero: Tagline + "Try it now" button → drops into aha moment simulation
- How it works: 3-step visual (Prep → Pause → Debrief)
- Social proof: Testimonials (placeholder initially)
- Pricing: Free / Pro / Annual comparison
- Footer: Privacy policy, terms, contact

**Hero copy:**
- Headline: "Most people hope good conversations happen to them."
- Subheadline: "Casanova teaches you how to make them happen — with anyone, anywhere."
- CTA: "Try your first coaching session free →"

### 2. Aha Moment (`/try`)
**Purpose:** Hook first-time users in 60 seconds. No signup required.

**Layout:**
- Full-screen chat interface with warm background
- Casanova presents a scenario (fetched from `/api/scenario/random?type=aha_moment`)
- User types their response
- Casanova coaches them with a better approach + reasoning
- After 2-3 exchanges: "Want to discover your communication style? Create a free account."
- Signup modal (email + Google + Apple)

**Critical UX:** NO friction before the aha moment. No signup, no email capture, no cookie consent modal blocking the experience. The user must feel the value before being asked for anything.

### 3. Onboarding (`/onboarding`)
**Purpose:** Discover user's archetype through conversational Q&A.

**Layout:**
- Chat-style interface (Casanova asks, user selects or types)
- 4-5 questions, each with 2-4 tappable answer options
- Progress indicator (dots, not percentage)
- Final reveal: "You're a [Archetype]" with brief description
- Transition: "Let's start with your first coaching session →"

**Questions flow:** See `ONBOARDING.md` for exact question sequence.

### 4. Home / Dashboard (`/app`)
**Purpose:** Main hub. Choose mode, see progress, access daily scenario.

**Layout:**
- Greeting: "Hey [name]. What's happening today?" (warm, not corporate)
- Three mode cards (large, tappable):
  - 🎯 **Prep** — "Help me get ready for something"
  - ⚡ **Pause** — "Help me right now"  (prominent, single-tap access)
  - 📝 **Debrief** — "How did it go?"
- Daily scenario card: "Today's challenge" with scenario preview
- Progress section: Archetype badge, Arts practiced (visual), Session count
- Bottom nav: Home | History | Profile

### 5. Chat Interface (`/app/session/:id`)
**Purpose:** The core coaching experience. Used for all three modes.

**Layout:**
- Top bar: Mode label (Prep/Pause/Debrief) + end session button
- Messages: Chat bubble style. User = right-aligned, accent color. Casanova = left-aligned, surface color.
- Input area: Text input + microphone button + send button
- Pause Mode variant: Larger text input, "Quick response" label, simplified UI

**Microphone button behavior:**
1. Tap to start recording (Web Speech API)
2. Real-time transcription appears in text input
3. User reviews transcript, edits if needed, taps send
4. No audio is transmitted — only the text transcript

**Streaming:** Assistant messages stream in token-by-token for natural feel.

### 6. Session History (`/app/history`)
**Purpose:** Review past coaching sessions.

**Layout:**
- List of sessions, newest first
- Each card shows: Mode icon, date, context preview, arts used (as small tags)
- Tap to open full session transcript
- "Delete session" swipe action

### 7. Profile (`/app/profile`)
**Purpose:** User settings, subscription, data management.

**Layout:**
- Archetype display (large badge with name and description)
- Arts progress: Visual grid showing which arts have been practiced and how often
- Subscription status + manage/upgrade button
- Privacy section: "Download my data" + "Delete all my data" (with confirmation)
- Sign out

### 8. Subscription / Paywall (`/app/upgrade`)
**Purpose:** Convert free users to Pro.

**Layout:**
- Comparison table: Free (3 sessions/mo, text only) vs Pro ($9.99/mo, unlimited, voice, all modes, memory) vs Annual ($79.99/yr, save 33%)
- "Start Pro" button → Stripe Checkout
- After checkout: redirect back to app with Pro badge celebration

---

## PWA Configuration

```json
// manifest.json
{
  "name": "Casanova",
  "short_name": "Casanova",
  "description": "Your personal EQ coach",
  "start_url": "/app",
  "display": "standalone",
  "background_color": "#FEFCF9",
  "theme_color": "#E94560",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- Service worker: Cache app shell + static assets. Chat messages always fetched fresh.
- Install prompt: Show after 2nd visit or after aha moment completion.
- Offline: Show "You're offline. Casanova needs internet to coach you." with cached history view.

---

## Responsive Breakpoints

- Mobile: < 768px (primary design target)
- Tablet: 768-1024px
- Desktop: > 1024px (chat centered, max-width 640px, comfortable reading width)

---

## Animations (Framer Motion)

- Page transitions: Subtle slide + fade (200ms)
- Chat bubbles: Slide up + fade in (150ms)
- Mode cards: Scale on tap (100ms)
- Archetype reveal: Fade in with gentle scale (500ms)
- Keep all animations under 300ms except celebratory moments

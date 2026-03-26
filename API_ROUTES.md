# API Routes — Next.js API Routes
## For Claude Code Backend Agent

Base path: `/api/`

---

## Authentication

Uses Supabase Auth. All routes except `/api/auth/*` and `/api/scenario/random` require a valid session cookie.

### POST /api/auth/signup
Create account with email + password or social login (Google, Apple).
```json
// Request
{ "email": "user@example.com", "password": "..." }
// Response 200
{ "user": { "id": "uuid", "email": "..." }, "session": { "access_token": "..." } }
```

### POST /api/auth/login
```json
// Request
{ "email": "user@example.com", "password": "..." }
// Response 200
{ "user": { "id": "uuid" }, "session": { "access_token": "..." } }
```

### POST /api/auth/logout
Invalidates the current session.

---

## Profile

### GET /api/profile
Returns the authenticated user's profile.
```json
// Response 200
{
  "id": "uuid",
  "display_name": "...",
  "archetype": "enigma",
  "subscription_tier": "pro",
  "sessions_this_month": 7,
  "arts_practiced": ["question", "suggestion", "rhythm"],
  "total_sessions": 23,
  "onboarding_completed": true
}
```

### PATCH /api/profile
Update profile fields (archetype, display_name, onboarding_completed).
```json
// Request
{ "archetype": "charmer", "onboarding_completed": true }
// Response 200
{ "success": true }
```

---

## Sessions

### POST /api/sessions
Create a new coaching session. Checks session limits before creating.
```json
// Request
{ "mode": "prep", "context": "I have a networking event tomorrow...", "relationship_type": "professional" }
// Response 200
{ "session_id": "uuid" }
// Response 403 (limit reached)
{ "error": "session_limit_reached", "message": "You've reached your monthly session limit. Upgrade to Pro for more." }
```

### GET /api/sessions
List user's sessions (paginated, newest first).
```json
// Query params: ?limit=20&offset=0
// Response 200
{
  "sessions": [
    { "id": "uuid", "mode": "prep", "context": "...", "arts_used": ["question"], "created_at": "...", "summary": "..." }
  ],
  "total": 23
}
```

### GET /api/sessions/:id
Get a single session with its non-ephemeral messages.
```json
// Response 200
{
  "session": { "id": "uuid", "mode": "debrief", ... },
  "messages": [
    { "id": "uuid", "role": "user", "content": "...", "created_at": "..." },
    { "id": "uuid", "role": "assistant", "content": "...", "created_at": "..." }
  ]
}
```

### PATCH /api/sessions/:id
End a session (sets ended_at, triggers ephemeral message purge, increments session count).
```json
// Request
{ "action": "end", "rating": 4 }
// Response 200
{ "success": true }
```

---

## Chat (Core Coaching Endpoint)

### POST /api/chat
Send a message to the Casanova agent and receive coaching. This is the heart of the app.

```json
// Request
{
  "session_id": "uuid",
  "message": "I'm at a networking event and I don't know anyone...",
  "is_ephemeral": false  // set true if user is pasting other person's messages
}
// Response 200 (streamed)
{
  "message_id": "uuid",
  "content": "Let me help you with this. First, a couple of questions...",
  "arts_referenced": ["question", "attunement"]
}
```

**Backend logic for this endpoint:**
1. Validate session belongs to user and is not ended
2. Store user message in messages table (with is_ephemeral flag)
3. Retrieve all non-ephemeral messages from this session for context
4. Retrieve user profile (archetype, arts_practiced, total_sessions) for personalization
5. Construct messages array for KRONA: system prompt + user context + conversation history
6. If mode is "pause", append instruction: "Respond in under 150 words. Lead with the action."
7. Stream response from KRONA
8. Store assistant message in messages table
9. Parse arts_referenced from response and update session.arts_used and profile.arts_practiced

---

## Scenarios

### GET /api/scenario/random
Returns a random scenario for the aha moment or daily practice. Does not require auth.
```json
// Query params: ?type=aha_moment OR ?type=daily&context=professional
// Response 200
{
  "id": "uuid",
  "scenario_text": "You're at a friend's birthday party. You notice someone by the drinks table who just laughed at something on their phone. You want to talk to them. What's your opening line?",
  "context_type": "general",
  "difficulty": "beginner"
}
```

---

## Stripe / Subscriptions

### POST /api/stripe/create-checkout
Creates a Stripe Checkout session for Pro or Annual subscription.
```json
// Request
{ "tier": "pro" }  // or "annual"
// Response 200
{ "checkout_url": "https://checkout.stripe.com/..." }
```

### POST /api/stripe/webhook
Stripe webhook handler. Handles: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted.

Updates profile.subscription_tier accordingly. **Must verify Stripe signature.**

### POST /api/stripe/portal
Creates a Stripe Customer Portal session for managing subscription.
```json
// Response 200
{ "portal_url": "https://billing.stripe.com/..." }
```

---

## Data Management

### DELETE /api/data/sessions/:id
Delete a single session and all its messages.

### DELETE /api/data/all
Delete ALL user data (sessions, messages, profile). Irreversible. Requires confirmation.
```json
// Request
{ "confirm": "DELETE_ALL_MY_DATA" }
// Response 200
{ "success": true, "message": "All data has been permanently deleted." }
```

---

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
KRONA_API_URL=https://api.krona.ai/v1/chat  # or wherever KRONA is hosted
KRONA_API_KEY=xxxxx
STRIPE_SECRET_KEY=sk_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxxxx
STRIPE_PRO_PRICE_ID=price_xxxxx
STRIPE_ANNUAL_PRICE_ID=price_xxxxx
```

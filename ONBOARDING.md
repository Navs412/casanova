# Onboarding — Archetype Discovery
## Conversational Flow for New Users

---

## Design Principle

This is a conversation, not a form. Casanova asks questions in chat-bubble style. User selects from tappable options (not typing). Each answer narrows the archetype. Takes under 2 minutes.

---

## Question Flow

### Q1: Energy Source
**Casanova:** "Let's figure out your natural style. Quick question — when you're at your social best, what's usually happening?"

**Options:**
- A) "I'm one-on-one, talking about something I genuinely care about" → +Natural, +Ideal
- B) "I'm in a group and I've somehow become the center of attention" → +Magnetic, +Bold
- C) "I'm listening closely and making the other person feel amazing" → +Charmer, +Ideal
- D) "I've created some kind of experience or moment that surprised people" → +Alchemist, +Aesthete

### Q2: Superpower
**Casanova:** "If people were to describe your secret social superpower, what would it be?"

**Options:**
- A) "I notice things about people that others miss" → +Ideal, +Aesthete, +Detail
- B) "I'm funny or surprising — I say things people don't expect" → +Bold, +Natural
- C) "People feel comfortable and safe around me" → +Charmer, +Natural
- D) "I'm hard to read — people find me intriguing" → +Enigma, +Magnetic

### Q3: Challenge
**Casanova:** "And what's the thing that trips you up the most in conversations?"

**Options:**
- A) "I overthink everything and freeze up" → +Natural (needs development), -Analyzer pattern
- B) "I'm fine talking but I struggle to make lasting impressions" → +Enigma, +Absence art needed
- C) "I can connect one-on-one but groups drain me" → +Ideal, +Charmer
- D) "I tend to play it too safe and conversations stay surface-level" → +Bold, +Vulnerability art needed

### Q4: Context
**Casanova:** "Where do you feel this the most?"

**Options:**
- A) "Dating and romantic situations"
- B) "Work — meetings, networking, presentations"
- C) "Friendships and social gatherings"
- D) "Honestly, everywhere"

*(This question doesn't affect archetype — it personalizes the first coaching session's context.)*

---

## Scoring

Each option adds points to 1-2 archetypes. After Q3, tally the top archetype. In case of tie, use Q2 as tiebreaker (it most directly maps to core identity).

**Scoring matrix:**

| Option | Charmer | Magnetic | Enigma | Ideal | Bold | Natural | Aesthete | Luminary | Alchemist |
|--------|---------|----------|--------|-------|------|---------|----------|----------|-----------|
| Q1-A   |         |          |        | +2    |      | +2      |          |          |           |
| Q1-B   |         | +2       |        |       | +2   |         |          |          |           |
| Q1-C   | +2      |          |        | +2    |      |         |          |          |           |
| Q1-D   |         |          |        |       |      |         | +2       |          | +2        |
| Q2-A   |         |          |        | +2    |      |         | +2       |          |           |
| Q2-B   |         |          |        |       | +2   | +2      |          |          |           |
| Q2-C   | +2      |          |        |       |      | +2      |          |          |           |
| Q2-D   |         | +1       | +2     |       |      |         |          | +1       |           |
| Q3-A   |         |          |        |       |      | +1      |          |          |           |
| Q3-B   |         |          | +2     |       |      |         |          | +1       |           |
| Q3-C   | +1      |          |        | +1    |      |         |          |          |           |
| Q3-D   |         |          |        |       | +2   |         |          |          |           |

If no archetype reaches 3+ points, default to **Natural** (the most universally applicable starting point for introverts/overthinkers).

---

## Reveal

**Casanova:** "I see it. You're a **[Archetype Name]**."

Then: 2-3 sentence description of what this means for them, framed positively. Example:

> "You're an **Enigma**. You have a natural depth that most people only scratch the surface of. Your quietness isn't a weakness — it's mystique. The people who get to know you are fascinated precisely because you don't give everything away at once. I'm going to teach you how to turn that into your greatest asset."

**Transition:** "Ready for your first real coaching session? Tell me about a conversation coming up that you want to nail."

→ Route to `/app/session/new?mode=prep`

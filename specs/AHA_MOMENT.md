# Aha Moment Specification
## First-Time User Hook — Must Convert in 60 Seconds

---

## Flow

1. User lands on `/try` (linked from landing page CTA or direct link)
2. NO signup wall. NO tutorial. NO cookie consent modal blocking the chat.
3. Casanova presents a scenario immediately:

**Default aha scenario:**
> "You're at a friend's gathering. You've been talking to someone interesting for a few minutes, and the conversation is going well — but you can feel it starting to drift toward surface-level territory. You want to take it deeper without it feeling forced. What do you say next?"

4. User types their instinctive response
5. Casanova responds with:
   - Acknowledgment of what's good about their approach
   - A reframe with a better version using one of the Seven Arts
   - The reasoning: WHY the better version works (this is where the learning happens)
6. One more exchange to deepen the coaching
7. Then: "I already have a sense of how you connect with people. Want to discover your natural style? It takes 2 minutes."
8. Signup modal appears (email / Google / Apple)

**Critical metric:** Time from page load to "wow" reaction should be under 60 seconds.

---

## Scenario Pool for Aha Moment

Rotate these to keep the experience fresh for returning visitors:

| # | Scenario | Context | Art Demonstrated |
|---|----------|---------|-----------------|
| 1 | Friend's gathering, conversation drifting to surface level | General | Art of the Question |
| 2 | Networking event, standing alone, want to approach someone | Professional | Art of Suggestion |
| 3 | Text conversation going flat, one-word replies | General | Art of Rhythm |
| 4 | Meeting someone impressive, feel intimidated | Professional | Art of Vulnerability |
| 5 | Group dinner, want to connect with one specific person | Social | Art of Detail |
| 6 | Just had a great conversation, want to follow up memorably | General | Art of Absence |

Seed these into the `daily_scenarios` table with `is_aha_moment = TRUE`.

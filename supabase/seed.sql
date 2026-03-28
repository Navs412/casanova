-- Seed data: Aha Moment scenarios from the scenario pool
INSERT INTO public.daily_scenarios (scenario_text, context_type, difficulty, is_aha_moment) VALUES
(
  'You''re at a friend''s gathering. You''ve been talking to someone interesting for a few minutes, and the conversation is going well — but you can feel it starting to drift toward surface-level territory. You want to take it deeper without it feeling forced. What do you say next?',
  'general',
  'beginner',
  TRUE
),
(
  'You''re at a networking event. You''ve been standing alone for a few minutes, drink in hand, and you notice someone nearby who looks approachable. You want to start a conversation that doesn''t feel like a forced networking pitch. What''s your move?',
  'professional',
  'beginner',
  TRUE
),
(
  'You''re texting someone you like, but the conversation has gone flat — they''re giving one-word replies. You don''t want to seem desperate, but you don''t want to let it die either. What do you send?',
  'general',
  'beginner',
  TRUE
),
(
  'You''re at a dinner party and you''ve just been introduced to someone who is clearly accomplished and impressive. You feel a bit intimidated. You want to hold your own without trying too hard. How do you start?',
  'professional',
  'intermediate',
  TRUE
),
(
  'You''re at a group dinner and there''s one person at the table you want to get to know better. The conversation is flowing in the group, but you haven''t had a chance to connect with them directly. How do you create that moment?',
  'general',
  'intermediate',
  TRUE
),
(
  'You just had a great conversation with someone — maybe the best you''ve had in a while. You exchanged numbers. Now it''s the next day and you want to follow up in a way that stands out from the usual "nice meeting you" text. What do you send?',
  'general',
  'beginner',
  TRUE
);

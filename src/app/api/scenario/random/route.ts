import { NextRequest, NextResponse } from 'next/server';

interface Scenario {
  id: string;
  scenario_text: string;
  context_type: 'professional' | 'social' | 'romantic' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'daily' | 'aha_moment';
}

// Mock scenario data
const SCENARIOS: Scenario[] = [
  {
    id: 'sc-001',
    scenario_text:
      'You run into an old colleague at a coffee shop. They seem distracted and check their phone twice during your conversation. Instead of taking it personally, how could you create a moment of genuine connection that cuts through the noise?',
    context_type: 'professional',
    difficulty: 'beginner',
    type: 'daily',
  },
  {
    id: 'sc-002',
    scenario_text:
      'At a dinner party, the person across from you shares a controversial opinion. The table goes quiet. You disagree, but you also sense vulnerability behind their words. How do you respond in a way that honors both truth and connection?',
    context_type: 'social',
    difficulty: 'intermediate',
    type: 'daily',
  },
  {
    id: 'sc-003',
    scenario_text:
      'You realize that every time someone compliments you, you deflect with humor. Today, someone tells you they admire your calm under pressure. What would it look like to truly receive that — and let it change how you see yourself?',
    context_type: 'general',
    difficulty: 'intermediate',
    type: 'aha_moment',
  },
  {
    id: 'sc-004',
    scenario_text:
      'During a team meeting, a junior colleague presents an idea that is clearly flawed but shows real creative thinking. Your manager looks skeptical. How do you champion their potential without being dishonest about the idea itself?',
    context_type: 'professional',
    difficulty: 'advanced',
    type: 'daily',
  },
  {
    id: 'sc-005',
    scenario_text:
      'You catch yourself rehearsing what to say on a first date instead of being present. The other person asks you something unexpected: "What are you afraid people will find out about you?" How do you respond authentically without oversharing?',
    context_type: 'romantic',
    difficulty: 'advanced',
    type: 'daily',
  },
  {
    id: 'sc-006',
    scenario_text:
      'You notice that your most meaningful conversations happen when you stop trying to be interesting and start being interested. Think of the last time you felt truly heard — what did the other person do differently?',
    context_type: 'general',
    difficulty: 'beginner',
    type: 'aha_moment',
  },
  {
    id: 'sc-007',
    scenario_text:
      'You are at a networking event and someone asks what you do. You give your standard answer and watch their eyes glaze over slightly. You have 10 seconds to recover. What do you say?',
    context_type: 'professional',
    difficulty: 'intermediate',
    type: 'aha_moment',
  },
  {
    id: 'sc-008',
    scenario_text:
      'You have been texting someone you like for two weeks. The conversation is good but never seems to go anywhere. They just sent you another one-word reply. What do you do differently?',
    context_type: 'romantic',
    difficulty: 'intermediate',
    type: 'aha_moment',
  },
  {
    id: 'sc-009',
    scenario_text:
      'Your manager gives you public praise in a meeting. You deflect with humor and immediately redirect to your team. Later you wonder if you made yourself smaller than you needed to. How would you handle it differently?',
    context_type: 'professional',
    difficulty: 'advanced',
    type: 'aha_moment',
  },
  {
    id: 'sc-010',
    scenario_text:
      'You are at a house party and end up in the kitchen with someone you have never met. They seem interesting but guarded. The small talk is going nowhere. You have one shot to make this conversation worth remembering. What do you try?',
    context_type: 'social',
    difficulty: 'intermediate',
    type: 'aha_moment',
  },
  {
    id: 'sc-011',
    scenario_text:
      'Your parent calls to catch up. Within two minutes it turns into the same script — "How is work? Are you eating well?" — and you feel the familiar distance. You want something real this time. What do you say to break the pattern?',
    context_type: 'general',
    difficulty: 'advanced',
    type: 'aha_moment',
  },
  {
    id: 'sc-012',
    scenario_text:
      'You are in a group chat that used to be fun but has gone flat. Nobody posts anything real anymore — just memes and one-liners. You want to revive it without being the person who "makes it weird." What do you send?',
    context_type: 'social',
    difficulty: 'beginner',
    type: 'aha_moment',
  },
  {
    id: 'sc-013',
    scenario_text:
      'You are on a video call with a potential client. They seem distracted — camera off, short answers. You can feel the deal slipping. You have 30 seconds before they say "let me think about it." What do you do?',
    context_type: 'professional',
    difficulty: 'advanced',
    type: 'aha_moment',
  },
  {
    id: 'sc-014',
    scenario_text:
      'You are catching up with an old friend over coffee. They ask how you are and you say "good, busy." You watch yourself do it — the automatic deflection. You actually want to tell them something real. What do you say instead?',
    context_type: 'social',
    difficulty: 'beginner',
    type: 'aha_moment',
  },
  {
    id: 'sc-015',
    scenario_text:
      'You matched with someone on a dating app. Their profile is interesting but their opening message is just "hey." You want to respond in a way that makes the conversation actually go somewhere. What do you write?',
    context_type: 'romantic',
    difficulty: 'beginner',
    type: 'aha_moment',
  },
  {
    id: 'sc-016',
    scenario_text:
      'You are at a dinner with your partner\'s friends. You do not know anyone well. The conversation keeps circling topics you cannot contribute to — inside jokes, shared memories. You feel invisible. How do you find your way in without forcing it?',
    context_type: 'social',
    difficulty: 'intermediate',
    type: 'aha_moment',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'daily' | 'aha_moment'
    const context = searchParams.get('context'); // 'professional' | 'social' | 'romantic' | 'general'

    let filtered = [...SCENARIOS];

    // Filter by type if provided
    if (type) {
      filtered = filtered.filter((s) => s.type === type);
    }

    // Filter by context if provided
    if (context) {
      filtered = filtered.filter((s) => s.context_type === context);
    }

    if (filtered.length === 0) {
      return NextResponse.json(
        { error: 'No scenarios found for the given filters' },
        { status: 404 }
      );
    }

    // Pick a random scenario
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const scenario = filtered[randomIndex];

    return NextResponse.json({
      id: scenario.id,
      scenario_text: scenario.scenario_text,
      context_type: scenario.context_type,
      difficulty: scenario.difficulty,
    });
  } catch (error) {
    console.error('Scenario API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

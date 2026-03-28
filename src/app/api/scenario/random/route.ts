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

'use client';

import { useRouter } from 'next/navigation';
import ArchetypeQuiz from '@/components/onboarding/ArchetypeQuiz';
import { Archetype } from '@/types';

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = async (archetype: Archetype, context: string) => {
    try {
      // Save archetype to profile
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          archetype,
          onboarding_completed: true,
        }),
      });

      // Create first session
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'prep',
          relationship_type: context || 'unspecified',
        }),
      });

      const data = await res.json();
      router.push(`/app/session/${data.session_id}`);
    } catch {
      router.push('/app');
    }
  };

  return (
    <div className="min-h-screen bg-casanova-bg flex flex-col">
      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
        <ArchetypeQuiz onComplete={handleComplete} />
      </div>
    </div>
  );
}

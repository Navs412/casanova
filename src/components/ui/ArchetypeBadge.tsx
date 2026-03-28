'use client';

import { Archetype } from '@/types';

const archetypeConfig: Record<Archetype, { emoji: string; color: string; description: string }> = {
  charmer: { emoji: '💫', color: 'bg-pink-100 text-pink-800', description: 'Makes others feel like the most important person in the room' },
  magnetic: { emoji: '🧲', color: 'bg-purple-100 text-purple-800', description: 'Radiates quiet confidence and purpose' },
  enigma: { emoji: '🌙', color: 'bg-indigo-100 text-indigo-800', description: 'Masters strategic self-revelation' },
  ideal: { emoji: '🪞', color: 'bg-blue-100 text-blue-800', description: 'Intuitively senses what others dream of' },
  bold: { emoji: '⚡', color: 'bg-amber-100 text-amber-800', description: 'Breaks social scripts with electric honesty' },
  natural: { emoji: '🌿', color: 'bg-green-100 text-green-800', description: 'Disarms through spontaneity and openness' },
  aesthete: { emoji: '🎨', color: 'bg-rose-100 text-rose-800', description: 'Creates worlds others want to inhabit' },
  luminary: { emoji: '✨', color: 'bg-violet-100 text-violet-800', description: 'Stands out through distinctive style' },
  alchemist: { emoji: '🔮', color: 'bg-teal-100 text-teal-800', description: 'Transforms ordinary moments into meaningful ones' },
};

interface ArchetypeBadgeProps {
  archetype: Archetype;
  size?: 'sm' | 'lg';
  showDescription?: boolean;
}

export default function ArchetypeBadge({ archetype, size = 'sm', showDescription }: ArchetypeBadgeProps) {
  const config = archetypeConfig[archetype];

  if (size === 'lg') {
    return (
      <div className="text-center">
        <span className="text-5xl mb-3 block">{config.emoji}</span>
        <h2 className="text-2xl font-bold text-casanova-text capitalize mb-1">The {archetype}</h2>
        {showDescription && (
          <p className="text-casanova-muted text-sm max-w-xs mx-auto">{config.description}</p>
        )}
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      <span>{config.emoji}</span>
      <span className="capitalize">{archetype}</span>
    </span>
  );
}

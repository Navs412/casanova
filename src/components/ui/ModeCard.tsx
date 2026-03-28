'use client';

import { motion } from 'framer-motion';

interface ModeCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
  prominent?: boolean;
}

export default function ModeCard({ icon, title, description, onClick, prominent }: ModeCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={`
        w-full p-5 rounded-2xl text-left transition-all duration-200 flex items-center gap-4 group
        ${prominent
          ? 'bg-casanova-accent text-white shadow-lg shadow-casanova-accent/25 pulse-glow'
          : 'bg-casanova-surface border border-casanova-border hover:border-casanova-accent/40 hover:shadow-md hover:shadow-casanova-accent/5'
        }
      `}
    >
      <span className={`text-3xl flex-shrink-0 ${prominent ? '' : 'group-hover:scale-110 transition-transform duration-200'}`}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className={`text-lg font-semibold mb-0.5 ${prominent ? 'text-white' : 'text-casanova-text'}`}>
          {title}
        </h3>
        <p className={`text-sm ${prominent ? 'text-white/80' : 'text-casanova-muted'}`}>
          {description}
        </p>
      </div>
      <svg
        className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 ${
          prominent ? 'text-white/60' : 'text-casanova-muted/40'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </motion.button>
  );
}

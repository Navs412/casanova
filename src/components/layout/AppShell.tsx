'use client';

import { ReactNode } from 'react';
import BottomNav from './BottomNav';

interface AppShellProps {
  children: ReactNode;
  hideNav?: boolean;
}

export default function AppShell({ children, hideNav }: AppShellProps) {
  return (
    <div className="min-h-screen bg-casanova-bg">
      <main className={`max-w-2xl mx-auto px-5 ${hideNav ? '' : 'pb-24'}`}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}

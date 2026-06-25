import type { ReactNode } from 'react';

import compactLogo from '../../assets/logos/RaceTracker logo compact alt.svg';

import { useAuthStore } from '../../store/auth.store';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="flex items-center justify-between border-b border-white/20 bg-slate-800 px-4 py-3">
        <button className="flex items-center">
          <img
            src={compactLogo}
            alt="RaceTracker"
            className="h-10"
          />
        </button>

        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black font-bold">
          {user?.username?.charAt(0).toUpperCase()}
        </button>
      </header>

      <main className="p-4">
        {children}
      </main>
    </div>
  );
}

import type { ReactNode } from 'react';

import compactLogo from '../../assets/logos/RaceTracker logo compact alt.svg';

import { useAuthStore } from '../../store/auth.store';

import { useNavigate } from 'react-router-dom';

import { useState, useEffect, useRef } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();

  const [profileMenuOpen, setProfileMenuOpen] =
    useState(false);

  const [logoMenuOpen, setLogoMenuOpen] =
    useState(false);

  const logoMenuRef =
  useRef<HTMLDivElement>(null);

  const profileMenuRef =
  useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        logoMenuRef.current &&
        !logoMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setLogoMenuOpen(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      );
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="flex items-center justify-between border-b border-white/20 bg-slate-800 px-4 py-3">
        <div
          ref={logoMenuRef}
          className="relative"
        >
          <button
            onClick={() => {
              setProfileMenuOpen(false);
              setLogoMenuOpen(
                !logoMenuOpen,
              );
            }}
            className="flex items-center"
          >
            <img
              src={compactLogo}
              alt="RaceTracker"
              className="h-10"
            />
          </button>

          {logoMenuOpen && (
            <div className="absolute left-0 z-50 mt-2 w-52 rounded-lg border border-slate-700 bg-slate-800 shadow-lg">
              <button
                onClick={() => {
                  setLogoMenuOpen(
                    false,
                  );
                  navigate('/');
                }}
                className="w-full px-4 py-3 text-left hover:bg-slate-700"
              >
                Dashboard
              </button>

              <button
                onClick={() => {
                  setLogoMenuOpen(
                    false,
                  );
                  navigate(
                    '/create-league',
                  );
                }}
                className="w-full px-4 py-3 text-left hover:bg-slate-700"
              >
                Create League
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setLogoMenuOpen(false);
              setProfileMenuOpen(
                !profileMenuOpen,
              );
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white font-bold text-black"
          >
            {user?.username
              ?.charAt(0)
              .toUpperCase()}
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 z-50 mt-2 w-40 rounded-lg border border-slate-700 bg-slate-800 shadow-lg">
              <button
                onClick={() => {
                  setProfileMenuOpen(
                    false,
                  );
                  navigate(
                    '/profile',
                  );
                }}
                className="w-full px-4 py-3 text-left hover:bg-slate-700"
              >
                Profile
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate(
                    '/login',
                  );
                }}
                className="w-full px-4 py-3 text-left text-red-400 hover:bg-slate-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="p-4">
        {children}
      </main>
    </div>
  );
}
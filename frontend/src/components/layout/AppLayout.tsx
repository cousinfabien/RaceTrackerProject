import type { ReactNode } from 'react';

import compactLogo from '../../assets/logos/RaceTracker logo compact alt.svg';

import { useAuthStore } from '../../store/auth.store';

import { useNavigate, useLocation } from 'react-router-dom';

import { useState, useEffect, useRef } from 'react';

import {
  FiHome,
  FiCompass,
  FiPlusCircle,
  FiUser,
  FiChevronDown,
  FiLogOut,
} from 'react-icons/fi';

interface AppLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();
  const location = useLocation();

  const [profileMenuOpen, setProfileMenuOpen] =
    useState(false);

  const [logoMenuOpen, setLogoMenuOpen] =
    useState(false);

  const logoMenuRef =
  useRef<HTMLDivElement>(null);

  const profileMenuRef =
  useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/',
      icon: <FiHome size={18} />,
    },
    {
      label: 'Browse Championships',
      path: '/leagues',
      icon: <FiCompass size={18} />,
    },
    {
      label: 'Create League',
      path: '/create-league',
      icon: <FiPlusCircle size={18} />,
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: <FiUser size={18} />,
    },
  ];

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
      <header className="flex items-center justify-between border-b border-white/20 bg-slate-800 px-4 py-3 sm:px-6">
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
            aria-label="Open navigation menu"
            aria-expanded={logoMenuOpen}
            className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 transition hover:bg-slate-700/60"
          >
            <img
              src={compactLogo}
              alt="RaceTracker"
              className="h-8 sm:h-10"
            />

            <FiChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-200 ${
                logoMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {logoMenuOpen && (
            <div className="absolute left-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 py-2 shadow-xl">
              <p className="px-4 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Navigation
              </p>

              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      setLogoMenuOpen(false);
                      navigate(item.path);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-400'
                        : 'text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <span
                      className={
                        isActive
                          ? 'text-blue-400'
                          : 'text-slate-400'
                      }
                    >
                      {item.icon}
                    </span>

                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => {
              setLogoMenuOpen(false);
              setProfileMenuOpen(
                !profileMenuOpen,
              );
            }}
            aria-label="Open profile menu"
            aria-expanded={profileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-black sm:h-12 sm:w-12"
          >
            {user?.username
              ?.charAt(0)
              .toUpperCase()}
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 py-2 shadow-xl">
              <button
                onClick={() => {
                  setProfileMenuOpen(
                    false,
                  );
                  navigate(
                    '/profile',
                  );
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-slate-200 hover:bg-slate-700"
              >
                <FiUser size={18} className="text-slate-400" />
                Profile
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate(
                    '/login',
                  );
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-slate-700"
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}

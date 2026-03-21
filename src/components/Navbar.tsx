'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, BarChart3, ClipboardList, History, Layers, TrendingUp, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthContext';

const links = [
  { href: '/', label: 'DASHBOARD', icon: BarChart3 },
  { href: '/log', label: 'LOG', icon: ClipboardList },
  { href: '/templates', label: 'TEMPLATES', icon: Layers },
  { href: '/history', label: 'HISTORY', icon: History },
  { href: '/progress', label: 'PROGRESS', icon: TrendingUp },
];

import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, nickname, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  const isLoggingFullScreen = pathname?.startsWith('/log') || pathname?.includes('/edit');

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Dumbbell size={20} className="text-accent group-hover:rotate-12 transition-transform" />
              </div>
              <span className="font-display text-xl tracking-tighter text-foreground font-bold">
                GYM<span className="text-accent">.</span>LOG
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-2">
              {links.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`
                      px-4 py-2 text-[11px] font-display font-medium tracking-[0.2em] rounded-lg transition-all
                      ${active
                        ? 'text-accent bg-accent/5'
                        : 'text-muted hover:text-foreground hover:bg-surface-hover'
                      }
                    `}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Auth Status */}
          <div className="flex items-center gap-4">
            {mounted && (
              user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-surface-hover/50 px-3 py-1.5 rounded-full border border-border/50">
                    <UserIcon size={14} className="text-accent" />
                    <span className="text-[10px] font-display font-bold tracking-widest text-foreground">@{nickname?.toUpperCase() || user?.email?.split('@')[0]?.toUpperCase() || 'USER'}</span>
                  </div>
                  <button 
                    onClick={() => signOut()}
                    className="p-2 text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-all active:scale-95"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link 
                  href="/auth/login"
                  className="flex items-center gap-2 bg-accent text-bg px-5 py-2 rounded-xl text-[11px] font-display font-bold tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20"
                >
                  <LogIn size={16} />
                  LOGIN
                </Link>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Bottom Nav (Mobile Only) */}
      {!isLoggingFullScreen && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur border-t border-border sm:hidden">
          <div className="grid grid-cols-5 h-16">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    flex flex-col items-center justify-center gap-1 transition-colors
                    ${active ? 'text-accent' : 'text-muted hover:text-foreground'}
                  `}
                >
                  <Icon size={18} />
                  <span className="font-display text-micro tracking-wider">{label}</span>
                </Link>
              );
            })}
          </div>
          <div style={{ height: 'env(safe-area-inset-bottom)' }} />
        </nav>
      )}
    </>
  );
}

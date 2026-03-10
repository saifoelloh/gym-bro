'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, BarChart3, ClipboardList, History, Layers, TrendingUp } from 'lucide-react';

const links = [
  { href: '/', label: 'DASHBOARD', icon: BarChart3 },
  { href: '/log', label: 'LOG', icon: ClipboardList },
  { href: '/templates', label: 'TEMPLATES', icon: Layers },
  { href: '/history', label: 'HISTORY', icon: History },
  { href: '/progress', label: 'PROGRESS', icon: TrendingUp },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Top Navbar (Desktop + Logo Mobile) */}
      <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Dumbbell size={20} className="text-accent group-hover:rotate-12 transition-transform" />
            <span className="font-display text-xl tracking-widest text-foreground">
              GYM<span className="text-accent">.</span>LOG
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden sm:flex items-center gap-1">
            {links.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    px-3 py-1.5 text-xs font-display tracking-widest rounded transition-colors
                    ${active
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-muted hover:text-foreground'
                    }
                  `}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="accent-line" />
      </nav>

      {/* Bottom Nav (Mobile Only) */}
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
        <div className="h-safe-bottom" /> {/* Handle home indicator area if needed */}
      </nav>
    </>
  );
}

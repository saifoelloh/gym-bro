import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

import { BottomNav } from '@/components/ui/BottomNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GYM.LOG',
  description: 'Personal gym tracker',
}

const NAV = [
  { href: '/', label: 'Dashboard' },
  { href: '/log', label: 'Log' },
  { href: '/templates', label: 'Templates' },
  { href: '/history', label: 'History' },
  { href: '/progress', label: 'Progress' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-bg text-foreground min-h-screen pb-20 sm:pb-0`}>
        <nav className="border-b border-border bg-surface sticky top-0 z-50">
          <div className="max-w-2xl mx-auto px-4 flex gap-1 h-14 items-center">
            <span className="font-bold text-foreground mr-4">🏋️ GYM.LOG</span>
            <div className="hidden sm:flex gap-1">
              {NAV.map(({ href, label }) => (
                <Link key={href} href={href}
                  className="px-3 py-1.5 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        {children}
        <BottomNav />
      </body>
    </html>
  )
}

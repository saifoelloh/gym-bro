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
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen pb-20 sm:pb-0`}>
        <nav className="border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 flex gap-1 h-14 items-center">
            <span className="font-bold text-white mr-4">🏋️ GYM.LOG</span>
            <div className="hidden sm:flex gap-1">
              {NAV.map(({ href, label }) => (
                <Link key={href} href={href}
                  className="px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
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

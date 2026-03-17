import type { Metadata } from 'next'
import { Inter, Oswald, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthContext'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const oswald = Oswald({ 
  subsets: ['latin'], 
  variable: '--font-oswald', 
  weight: ['400', '500', '600', '700'] 
})
const ibmMono = IBM_Plex_Mono({ 
  subsets: ['latin'], 
  variable: '--font-ibm-mono', 
  weight: ['400', '500', '700'] 
})

export const metadata: Metadata = {
  title: 'GYM.LOG',
  description: 'Personal gym tracker',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${oswald.variable} ${ibmMono.variable} font-sans bg-bg text-foreground min-h-screen pb-20 sm:pb-0`}>
        <AuthProvider>
          <Navbar />
          <div className="max-w-5xl mx-auto px-4 py-8">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

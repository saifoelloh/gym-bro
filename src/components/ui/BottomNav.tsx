'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, PlusSquare, Clock, LineChart, Layers } from 'lucide-react'

const NAV = [
    { href: '/', label: 'Home', icon: LayoutDashboard },
    { href: '/log', label: 'Log', icon: PlusSquare },
    { href: '/templates', label: 'Templates', icon: Layers },
    { href: '/history', label: 'History', icon: Clock },
    { href: '/progress', label: 'Progress', icon: LineChart },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 pb-safe z-50">
            <div className="flex justify-around items-center h-16">
                {NAV.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href
                    return (
                        <Link key={href} href={href}
                            className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${isActive ? 'text-blue-500' : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}

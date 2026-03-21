import { Dumbbell } from 'lucide-react'

interface AuthCardProps {
    title: string
    highlight: string
    subtitle: string
    children: React.ReactNode
}

export function AuthCard({ title, highlight, subtitle, children }: AuthCardProps) {
    return (
        <div className="max-w-md mx-auto mt-4 sm:mt-8 px-4 pb-safe-auth">
            <div className="bg-surface/40 backdrop-blur-xl p-5 sm:p-8 rounded-[2.5rem] border-brand-subtle shadow-2xl relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/5 blur-[80px] rounded-full" />
                
                <div className="text-center mb-4 sm:mb-6 relative">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-accent/10 rounded-2xl mb-3 sm:mb-4 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Dumbbell size={28} className="text-accent" />
                    </div>
                    <h1 className="text-3xl font-display font-black tracking-tighter mb-2 italic">
                        {title} <span className="text-accent underline decoration-accent/30 underline-offset-8">{highlight}</span>
                    </h1>
                    <p className="text-sm text-muted font-medium leading-relaxed max-w-[24ch] mx-auto mb-0">
                        {subtitle}
                    </p>
                </div>

                {children}
            </div>
        </div>
    )
}

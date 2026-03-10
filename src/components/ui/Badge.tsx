import { MUSCLE_COLORS } from '@/types'
import type { MuscleGroup } from '@/types'

export function Badge({ children, variant = 'default', className = '' }: { children: React.ReactNode; variant?: string; className?: string }) {
  const isMuscle = variant !== 'default' && MUSCLE_COLORS[variant as MuscleGroup]
  const color = isMuscle ? MUSCLE_COLORS[variant as MuscleGroup] : undefined

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${!isMuscle ? 'bg-surface border border-border text-muted' : ''} ${className}`}
      style={isMuscle ? { backgroundColor: `${color}1A`, color: color } : undefined}
    >
      {children}
    </span>
  )
}

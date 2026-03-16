import { MUSCLE_COLORS } from '@/types'
import type { MuscleGroup } from '@/types'

export function Badge({ children, variant = 'default', className = '' }: { children: React.ReactNode; variant?: string; className?: string }) {
  const isMuscle = variant !== 'default' && variant !== 'assisted' && MUSCLE_COLORS[variant as MuscleGroup]
  const color = isMuscle ? MUSCLE_COLORS[variant as MuscleGroup] : undefined

  let baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'
  let dynamicStyles = {}

  if (variant === 'assisted') {
    baseStyles += ' bg-assisted/10 text-assisted border border-assisted/20'
  } else if (isMuscle) {
    dynamicStyles = { backgroundColor: `${color}1A`, color: color }
  } else {
    baseStyles += ' bg-surface border border-border text-muted'
  }

  return (
    <span className={`${baseStyles} ${className} transition-colors`} style={dynamicStyles}>
      {children}
    </span>
  )
}

const variants: Record<string, string> = {
  default: 'bg-gray-800 text-gray-300',
  Chest: 'bg-red-900/50 text-red-300',
  Back: 'bg-blue-900/50 text-blue-300',
  Shoulders: 'bg-yellow-900/50 text-yellow-300',
  Arms: 'bg-purple-900/50 text-purple-300',
  Core: 'bg-orange-900/50 text-orange-300',
  Legs: 'bg-green-900/50 text-green-300',
  Cardio: 'bg-pink-900/50 text-pink-300',
}

export function Badge({ children, variant = 'default', className = '' }: { children: React.ReactNode; variant?: string; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant] ?? variants.default} ${className}`}>
      {children}
    </span>
  )
}

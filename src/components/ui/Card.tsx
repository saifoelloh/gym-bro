import type { HTMLAttributes } from 'react'

export function Card({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-xl border border-gray-800 bg-gray-900 p-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

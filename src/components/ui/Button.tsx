import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
const styles: Record<Variant, string> = {
  primary:   'bg-blue-600 hover:bg-blue-500 text-white',
  secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
  danger:    'bg-red-700 hover:bg-red-600 text-white',
  ghost:     'bg-transparent hover:bg-gray-800 text-gray-300',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant; loading?: boolean }

export function Button({ variant = 'primary', loading, children, className = '', disabled, ...props }: Props) {
  return (
    <button disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}>
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  )
}

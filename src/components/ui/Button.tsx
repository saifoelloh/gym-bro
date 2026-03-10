import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
const styles: Record<Variant, string> = {
  primary: 'bg-info hover:bg-info/90 text-foreground font-black uppercase italic tracking-widest shadow-lg shadow-info/20 active:scale-95',
  secondary: 'bg-surface hover:bg-surface-hover text-subtle border border-border transition-all active:scale-95',
  danger: 'bg-error/10 hover:bg-error/20 text-error border border-error/20 active:scale-95',
  ghost: 'bg-transparent hover:bg-surface text-muted hover:text-foreground active:scale-95',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant; loading?: boolean }

export function Button({ variant = 'primary', loading, children, className = '', disabled, ...props }: Props) {
  return (
    <button disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all disabled:opacity-50 ${styles[variant]} ${className}`}
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

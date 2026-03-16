interface AuthErrorBannerProps {
    error: string | null
}

export function AuthErrorBanner({ error }: AuthErrorBannerProps) {
    if (!error) return null

    return (
        <div className="bg-error/10 border border-error/20 text-error p-4 rounded-2xl mb-8 text-xs font-bold flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <span className="mt-0.5">⚠️</span>
            {error}
        </div>
    )
}

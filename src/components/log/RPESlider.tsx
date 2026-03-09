import React from 'react'

interface Props {
    value: number | undefined
    onChange: (val: number) => void
}

const RPE_DATA: Record<number, { emoji: string; label: string; color: string }> = {
    1: { emoji: '😴', label: 'Very Easy', color: 'rgb(34, 197, 94)' },
    2: { emoji: '🙂', label: 'Easy', color: 'rgb(34, 197, 94)' },
    3: { emoji: '😊', label: 'Moderate', color: 'rgb(132, 204, 22)' },
    4: { emoji: '💪', label: 'Good Effort', color: 'rgb(234, 179, 8)' },
    5: { emoji: '😤', label: 'Hard', color: 'rgb(245, 158, 11)' },
    6: { emoji: '🔥', label: 'Very Hard', color: 'rgb(249, 115, 22)' },
    7: { emoji: '⚡', label: 'Max Effort', color: 'rgb(239, 68, 68)' },
    8: { emoji: '🥵', label: 'Beyond Limits', color: 'rgb(220, 38, 38)' },
    9: { emoji: '💀', label: 'Near Failure', color: 'rgb(185, 28, 28)' },
    10: { emoji: '👻', label: 'Absolute Max', color: 'rgb(153, 27, 27)' },
}

export function RPESlider({ value, onChange }: Props) {
    const current = value ? RPE_DATA[value] : null

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-8 bg-card rounded-2xl border border-border relative overflow-hidden group">
                {/* Animated Background Glow */}
                <div
                    className="absolute inset-0 opacity-10 transition-colors duration-500"
                    style={{ backgroundColor: current?.color || 'transparent' }}
                />

                {/* Emoji and Label */}
                <div className="relative z-10 flex flex-col items-center">
                    <span className="text-6xl mb-4 transform transition-all duration-300 hover:scale-125 hover:rotate-6 inline-block">
                        {current?.emoji || '❔'}
                    </span>
                    <div className="text-center px-4">
                        <h3 className="text-2xl font-bold text-text tracking-tight uppercase italic">
                            {value || 'How hard?'}
                        </h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 italic mt-1" style={{ color: current?.color || '#555555' }}>
                            {current?.label || 'Select RPE intensity'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-2 pb-2">
                <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={value ?? 5}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-blue-500"
                    style={{
                        background: `linear-gradient(to right, #22c55e, #eab308, #ef4444)`
                    }}
                />
            </div>
        </div>
    )
}

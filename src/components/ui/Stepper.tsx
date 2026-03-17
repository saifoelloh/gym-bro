import React from 'react'

interface Props {
    currentStep: number
    totalSteps: number
}

export function Stepper({ currentStep, totalSteps }: Props) {
    return (
        <div className="sticky top-16 z-40 bg-bg pt-4 pb-4 mb-4 px-1 flex items-center justify-between border-b border-border/10">
            <div className="flex-1 max-w-[60%] h-1 bg-surface rounded-full overflow-hidden mr-4">
                <div
                    className="h-full bg-info shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
            </div>
            <span className="text-xs uppercase font-black text-muted tracking-widest italic shrink-0">
                Step {currentStep + 1} OF {totalSteps}
            </span>
        </div>
    )
}

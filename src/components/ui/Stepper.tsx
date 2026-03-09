import React from 'react'

interface Props {
    currentStep: number
    totalSteps: number
}

export function Stepper({ currentStep, totalSteps }: Props) {
    return (
        <div className="flex items-center justify-between mb-8 px-1">
            <div className="flex gap-2">
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-500 ease-out ${i === currentStep
                                ? 'w-10 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                : i < currentStep
                                    ? 'w-4 bg-blue-500/40'
                                    : 'w-4 bg-gray-800'
                            }`}
                    />
                ))}
            </div>
            <span className="text-[10px] uppercase font-black text-gray-500 tracking-widest italic">
                Step {currentStep + 1} of {totalSteps}
            </span>
        </div>
    )
}

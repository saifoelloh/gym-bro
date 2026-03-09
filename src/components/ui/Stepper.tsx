import React from 'react'

interface Props {
    currentStep: number
    totalSteps: number
}

export function Stepper({ currentStep, totalSteps }: Props) {
    return (
        <div className="flex items-center justify-between mb-8 px-1">
            <div className="flex-1 max-w-[60%] h-1 bg-gray-800 rounded-full overflow-hidden mr-4">
                <div
                    className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
            </div>
            <span className="text-[10px] uppercase font-black text-gray-500 tracking-widest italic shrink-0">
                Step {currentStep + 1} OF {totalSteps}
            </span>
        </div>
    )
}

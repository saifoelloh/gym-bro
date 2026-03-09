import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Props {
    currentStep: number
    isFinalStep: boolean
    onPrev: () => void
    onNext: () => void
    onSubmit: () => void
    saving: boolean
    canNext: boolean
    canSubmit: boolean
}

export function WorkoutFooter({
    currentStep,
    isFinalStep,
    onPrev,
    onNext,
    onSubmit,
    saving,
    canNext,
    canSubmit
}: Props) {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom)+4.5rem)] sm:pb-4 bg-gradient-to-t from-bg via-bg/95 to-transparent z-40 md:relative md:bg-transparent md:p-0 md:mt-12">
            <div className="max-w-2xl mx-auto flex gap-3 pointer-events-auto">
                {currentStep > 0 && (
                    <button
                        className="px-5 h-12 rounded-xl bg-surface border border-border text-muted hover:text-text hover:border-subtle active:scale-95 transition-all flex items-center justify-center shrink-0"
                        onClick={onPrev}
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}

                {isFinalStep ? (
                    <Button
                        className="flex-1 h-12 rounded-xl text-[11px] uppercase italic tracking-widest font-black"
                        loading={saving}
                        disabled={!canSubmit}
                        onClick={onSubmit}
                    >
                        Finish Workout
                        <Check size={16} className="ml-2" />
                    </Button>
                ) : (
                    <Button
                        variant="secondary"
                        className="flex-1 h-12 rounded-xl text-[11px] uppercase italic tracking-widest font-black bg-surface border border-border text-text hover:bg-gray-800"
                        disabled={!canNext}
                        onClick={onNext}
                    >
                        {currentStep === 0 ? 'Start session' : 'Next Exercise'}
                        <ChevronRight size={16} className="ml-2" />
                    </Button>
                )}
            </div>
        </div>
    )
}

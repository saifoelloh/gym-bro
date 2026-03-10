import { Card } from '@/components/ui/Card'
import { FormLabel } from '@/components/ui/FormLabel'
import { RPESlider } from './RPESlider'

interface Props {
    rpe: number | undefined
    onRpeChange: (val: number) => void
    notes: string
    onNotesChange: (val: string) => void
}

export function WorkoutSummary({ rpe, onRpeChange, notes, onNotesChange }: Props) {
    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground uppercase italic tracking-tight">Session Complete!</h2>
                <p className="text-muted text-micro font-bold uppercase tracking-widest italic mt-1">Rate your relative effort</p>
            </div>

            <RPESlider value={rpe} onChange={onRpeChange} />

            <Card className="space-y-4">
                <div>
                    <FormLabel>Workout Notes</FormLabel>
                    <textarea
                        value={notes}
                        onChange={e => onNotesChange(e.target.value)}
                        placeholder="How was the session? Any new PRs?"
                        rows={4}
                        className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-sm text-foreground placeholder-muted focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none font-medium"
                    />
                </div>
            </Card>
        </div>
    )
}

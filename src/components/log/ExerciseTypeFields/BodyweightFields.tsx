import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { X } from 'lucide-react'

interface S { reps?: number }
interface Props { sets: S[]; onChange: (s: S[]) => void }

export function BodyweightFields({ sets, onChange }: Props) {
  return (
    <div className="space-y-4">
      {sets.map((s, i) => (
        <div key={i} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${i * 50}ms` }}>
          <div className="flex-1 flex gap-2 items-center">
            <div className="relative flex-1">
              <Input
                type="number"
                step="any"
                inputMode="numeric"
                placeholder="0"
                value={s.reps ?? ''}
                onChange={e => onChange(sets.map((x, idx) => idx === i ? { reps: e.target.value === '' ? undefined : Number(e.target.value) } : x))}
                className="text-center font-bold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-nano font-black text-muted uppercase italic pointer-events-none">reps</span>
            </div>
          </div>
          <button
            onClick={() => onChange(sets.filter((_, idx) => idx !== i))}
            className="flex-none w-10 h-10 flex items-center justify-center rounded-xl text-muted hover:text-error hover:bg-error/10 transition-all"
          >
            <X size={16} />
          </button>
        </div>
      ))}
      <Button
        variant="secondary"
        className="w-full border-dashed py-3 italic"
        onClick={() => onChange([...sets, {}])}
      >
        + Add Set
      </Button>
    </div>
  )
}

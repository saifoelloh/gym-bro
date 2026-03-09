interface S { reps?: number }
interface Props { sets: S[]; onChange: (s: S[]) => void }

export function BodyweightFields({ sets, onChange }: Props) {
  return (
    <div className="space-y-2">
      {sets.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-6">#{i+1}</span>
          <input type="number" placeholder="reps" value={s.reps ?? ''}
            onChange={e => onChange(sets.map((x,idx)=>idx===i?{reps:e.target.value===''?undefined:Number(e.target.value)}:x))}
            className="w-20 rounded bg-gray-800 px-2 py-1 text-sm text-white" />
          <span className="text-gray-500 text-xs">reps</span>
          <button onClick={() => onChange(sets.filter((_,idx)=>idx!==i))} className="text-gray-600 hover:text-red-400 text-xs">✕</button>
        </div>
      ))}
      <button onClick={() => onChange([...sets,{}])} className="text-xs text-blue-400 hover:text-blue-300">+ Add set</button>
    </div>
  )
}

interface S { weight_kg?: number; reps?: number }
interface Props { sets: S[]; onChange: (s: S[]) => void }

export function WeightedFields({ sets, onChange }: Props) {
  const upd = (i: number, f: keyof S, v: string) =>
    onChange(sets.map((s, idx) => idx === i ? { ...s, [f]: v === '' ? undefined : Number(v) } : s))
  return (
    <div className="space-y-3">
      {sets.map((s, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="flex-none w-8 text-center text-xs font-bold text-gray-600">
            {i + 1}
          </div>
          <div className="flex-1 grid grid-cols-2 gap-2">
            <input type="number" inputMode="decimal" placeholder="kg" value={s.weight_kg ?? ''} onChange={e => upd(i, 'weight_kg', e.target.value)}
              className="w-full rounded-lg bg-gray-800 border-gray-700 px-3 py-2.5 text-sm text-white text-center focus:ring-1 focus:ring-blue-500 outline-none" />
            <input type="number" inputMode="numeric" placeholder="reps" value={s.reps ?? ''} onChange={e => upd(i, 'reps', e.target.value)}
              className="w-full rounded-lg bg-gray-800 border-gray-700 px-3 py-2.5 text-sm text-white text-center focus:ring-1 focus:ring-blue-500 outline-none" />
          </div>
          <button onClick={() => onChange(sets.filter((_, idx) => idx !== i))} className="flex-none p-2 text-gray-600 hover:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...sets, {}])} className="w-full py-2.5 text-sm font-medium text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 rounded-lg border border-dashed border-blue-500/20 transition-colors">
        + Add Set
      </button>
    </div>
  )
}

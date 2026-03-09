interface S { duration_seconds?: number }
interface Props { sets: S[]; onChange: (s: S[]) => void }

export function TimedFields({ sets, onChange }: Props) {
  return (
    <div className="space-y-3">
      {sets.map((s, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="flex-none w-8 text-center text-xs font-bold text-gray-600">
            {i + 1}
          </div>
          <div className="flex-1 flex gap-2 items-center">
            <input type="number" inputMode="numeric" placeholder="seconds" value={s.duration_seconds ?? ''}
              onChange={e => onChange(sets.map((x, idx) => idx === i ? { duration_seconds: e.target.value === '' ? undefined : Number(e.target.value) } : x))}
              className="flex-1 rounded-lg bg-gray-800 border-gray-700 px-3 py-2.5 text-sm text-white text-center focus:ring-1 focus:ring-blue-500 outline-none" />
            <span className="text-gray-500 text-xs font-medium pr-2">sec</span>
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

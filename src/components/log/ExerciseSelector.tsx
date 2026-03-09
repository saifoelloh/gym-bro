import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import type { Exercise } from '@/types'

const GROUPS = ['Chest','Back','Shoulders','Arms','Core','Legs','Cardio']

interface Props { exercises: Exercise[]; onSelect: (ex: Exercise) => void }

export function ExerciseSelector({ exercises, onSelect }: Props) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = exercises.filter(ex =>
    (filter === 'all' || ex.muscle_group === filter) &&
    ex.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-3">
      <input type="text" placeholder="Search exercise..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full rounded-lg bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500" />
      <div className="flex flex-wrap gap-1">
        {['all',...GROUPS].map(g => (
          <button key={g} onClick={() => setFilter(g)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${filter===g?'bg-blue-600 text-white':'bg-gray-800 text-gray-400'}`}>
            {g}
          </button>
        ))}
      </div>
      <ul className="max-h-64 overflow-y-auto space-y-1 pr-1">
        {filtered.map(ex => (
          <li key={ex.id}>
            <button onClick={() => onSelect(ex)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-gray-800 text-left">
              <div>
                <span className="text-white">{ex.name}</span>
                {ex.sub_category && <span className="text-xs text-gray-500 ml-2">{ex.sub_category}</span>}
              </div>
              <Badge variant={ex.muscle_group}>{ex.muscle_group}</Badge>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

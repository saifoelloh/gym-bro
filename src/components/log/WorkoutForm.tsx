import { useState } from 'react'
import { ExerciseSelector } from './ExerciseSelector'
import { SetLogger }        from './SetLogger'
import { Card }             from '@/components/ui/Card'
import { Button }           from '@/components/ui/Button'
import { Badge }            from '@/components/ui/Badge'
import type { Exercise, ExercisePayload, CreateWorkoutPayload } from '@/types'

interface LoggedExercise { exercise: Exercise; sets: any[] }
interface Props { exercises: Exercise[]; onSubmit: (p: CreateWorkoutPayload) => Promise<void> }

export function WorkoutForm({ exercises, onSubmit }: Props) {
  const [name, setName]       = useState('')
  const [date, setDate]       = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes]     = useState('')
  const [rpe, setRpe]         = useState<number|undefined>()
  const [logged, setLogged]   = useState<LoggedExercise[]>([])
  const [picking, setPicking] = useState(false)
  const [saving, setSaving]   = useState(false)

  const handleSubmit = async () => {
    if (!name.trim() || !logged.length) return
    setSaving(true)
    try {
      await onSubmit({
        name: name.trim(), date, notes, rpe,
        exercises: logged.map((l, i): ExercisePayload => ({
          exerciseId: l.exercise.id, exerciseOrder: i,
          sets: l.sets.map((s, si) => ({ ...s, set_number: si + 1 })),
        })),
      })
      setName(''); setNotes(''); setRpe(undefined); setLogged([])
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <div>
          <label className="text-xs text-gray-400">Workout Name *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Push Day A"
            className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-600" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label className="text-xs text-gray-400">RPE (1–10)</label>
            <input type="number" min={1} max={10} value={rpe??''} onChange={e=>setRpe(e.target.value?Number(e.target.value):undefined)}
              placeholder="optional" className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-600" />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400">Notes (optional)</label>
          <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. PR day..."
            className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-600" />
        </div>
      </Card>

      {logged.map((l, i) => (
        <Card key={i} className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-white">{l.exercise.name}</p>
              <Badge variant={l.exercise.muscle_group}>{l.exercise.muscle_group}</Badge>
            </div>
            <button onClick={() => setLogged(prev=>prev.filter((_,idx)=>idx!==i))} className="text-gray-600 hover:text-red-400 text-xs">Remove</button>
          </div>
          <SetLogger exercise={l.exercise} sets={l.sets}
            onChange={sets => setLogged(prev=>prev.map((x,idx)=>idx===i?{...x,sets}:x))} />
        </Card>
      ))}

      {picking ? (
        <Card>
          <ExerciseSelector exercises={exercises} onSelect={ex => { setLogged(p=>[...p,{exercise:ex,sets:[]}]); setPicking(false) }} />
          <button onClick={() => setPicking(false)} className="mt-3 text-xs text-gray-500">Cancel</button>
        </Card>
      ) : (
        <Button variant="secondary" className="w-full" onClick={() => setPicking(true)}>+ Add Exercise</Button>
      )}

      {logged.length > 0 && (
        <Button className="w-full" loading={saving} disabled={!name.trim()} onClick={handleSubmit}>Save Workout</Button>
      )}
    </div>
  )
}

import { WeightedFields }           from './ExerciseTypeFields/WeightedFields'
import { TimedFields }              from './ExerciseTypeFields/TimedFields'
import { BodyweightFields }         from './ExerciseTypeFields/BodyweightFields'
import { WeightedBodyweightFields } from './ExerciseTypeFields/WeightedBodyweightFields'
import type { Exercise } from '@/types'

interface Props { exercise: Exercise; sets: any[]; onChange: (s: any[]) => void }

export function SetLogger({ exercise, sets, onChange }: Props) {
  const p = { sets, onChange }
  switch (exercise.exercise_type) {
    case 'weighted':            return <WeightedFields {...p} />
    case 'timed':               return <TimedFields {...p} />
    case 'bodyweight_variable': return <BodyweightFields {...p} />
    case 'weighted_bodyweight': return <WeightedBodyweightFields {...p} />
    case 'assisted':            return <WeightedFields {...p} />
    default:                    return <BodyweightFields {...p} />
  }
}

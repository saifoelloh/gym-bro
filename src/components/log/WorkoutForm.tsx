import { useState, useEffect } from 'react'
import { ExerciseSelector } from './ExerciseSelector'
import { Card } from '@/components/ui/Card'
import { Stepper } from '@/components/ui/Stepper'
import { api } from '@/lib/api/client'
import { WorkoutSummary } from './WorkoutSummary'
import { WorkoutSetup } from './WorkoutSetup'
import { WorkoutStep } from './WorkoutStep'
import { WorkoutFooter } from './WorkoutFooter'
import { Plus } from 'lucide-react'
import type { Exercise, ExercisePayload, CreateWorkoutPayload, WorkoutTemplate, TemplateExercise } from '@/types'

interface LoggedExercise { exercise: Exercise; sets: any[] }
interface Props {
  exercises: Exercise[];
  templateId?: string | null;
  onSubmit: (p: CreateWorkoutPayload) => Promise<void>
}

export function WorkoutForm({ exercises, templateId, onSubmit }: Props) {
  const [currentStep, setCurrentStep] = useState(0) // 0: Setup, 1..N: Exercises, N+1: Summary
  const [name, setName] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [rpe, setRpe] = useState<number | undefined>()
  const [logged, setLogged] = useState<LoggedExercise[]>([])
  const [picking, setPicking] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (templateId) {
      api.templates.get(templateId)
        .then((data) => {
          if (data) {
            setName(data.name);
            if (data.template_exercises) {
              const restored = data.template_exercises
                .sort((a: TemplateExercise, b: TemplateExercise) => a.exercise_order - b.exercise_order)
                .map((te: TemplateExercise) => ({
                  exercise: te.exercise as Exercise,
                  sets: Array(te.target_sets || 3).fill(null).map((_, idx) => ({
                    set_number: idx + 1,
                    reps: '', weight_kg: '', duration_seconds: '', rest_seconds: 90, notes: ''
                  }))
                }));
              setLogged(restored);
            }
          }
        })
        .catch(console.error);
    }
  }, [templateId]);

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
      setCurrentStep(0)
    } finally { setSaving(false) }
  }

  const totalSteps = logged.length + 2
  const isFinalStep = currentStep === logged.length + 1

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  return (
    <div className="flex flex-col min-h-screen pb-40">
      <Stepper currentStep={currentStep} totalSteps={totalSteps} />

      <div className="flex-1 space-y-6">
        {currentStep === 0 && (
          <WorkoutSetup
            name={name} setName={setName}
            date={date} setDate={setDate}
            logged={logged} setLogged={setLogged}
            onAddExercise={() => setPicking(true)}
          />
        )}

        {currentStep > 0 && currentStep <= logged.length && (
          <WorkoutStep
            loggedExercise={logged[currentStep - 1]}
            index={currentStep - 1}
            onSetsChange={sets => setLogged(prev => prev.map((x, idx) => idx === currentStep - 1 ? { ...x, sets } : x))}
            onAddExercise={() => setPicking(true)}
          />
        )}

        {isFinalStep && (
          <WorkoutSummary
            rpe={rpe} onRpeChange={setRpe}
            notes={notes} onNotesChange={setNotes}
          />
        )}
      </div>

      <WorkoutFooter
        currentStep={currentStep}
        isFinalStep={isFinalStep}
        onPrev={prevStep}
        onNext={nextStep}
        onSubmit={handleSubmit}
        saving={saving}
        canNext={currentStep === 0 ? (logged.length > 0 && name.trim().length > 0) : true}
        canSubmit={name.trim().length > 0}
      />

      {picking && (
        <div className="fixed inset-0 z-[110] p-4 flex items-center justify-center bg-bg/90 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-xl max-h-[85vh] flex flex-col p-0 shadow-2xl relative border-border overflow-hidden">
            <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-border bg-card/80 backdrop-blur-xl">
              <div>
                <h2 className="text-sm font-bold text-text uppercase tracking-tight italic">Choose Exercise</h2>
                <p className="text-[10px] text-muted font-bold tracking-widest mt-0.5 uppercase italic">Select from library</p>
              </div>
              <button
                onClick={() => setPicking(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border text-muted hover:text-text transition-all"
              >
                <Plus size={20} className="rotate-45" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <ExerciseSelector
                exercises={exercises}
                onSelect={ex => { setLogged(p => [...p, { exercise: ex, sets: [] }]); setPicking(false) }}
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

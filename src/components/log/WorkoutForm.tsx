import { useState, useEffect } from 'react'
import { ExerciseSelector } from './ExerciseSelector'
import { Card } from '@/components/ui/Card'
import { Stepper } from '@/components/ui/Stepper'
import { api } from '@/lib/api/client'
import { WorkoutSummary } from './WorkoutSummary'
import { WorkoutSetup } from './WorkoutSetup'
import { WorkoutStep } from './WorkoutStep'
import { WorkoutFooter } from './WorkoutFooter'
import { Plus, X, AlertCircle } from 'lucide-react'
import type { Exercise, ExercisePayload, CreateWorkoutPayload, WorkoutTemplate, TemplateExercise, ActiveWorkoutExercise } from '@/types'

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
  const [logged, setLogged] = useState<ActiveWorkoutExercise[]>([])
  const [picking, setPicking] = useState(false)
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

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
                  notes: te.notes,
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
      const validExercises = logged
        .map((l, i): ExercisePayload => {
          const validSets = l.sets
            .filter(s =>
              (s.weight_kg !== undefined && s.weight_kg !== '') ||
              (s.reps !== undefined && s.reps !== '') ||
              (s.duration_seconds !== undefined && s.duration_seconds !== '')
            )
            .map((s, si) => ({
              set_number: si + 1,
              weight_kg: (s.weight_kg === '' || s.weight_kg === undefined) ? undefined : Number(s.weight_kg),
              reps: (s.reps === '' || s.reps === undefined) ? undefined : Number(s.reps),
              duration_seconds: (s.duration_seconds === '' || s.duration_seconds === undefined) ? undefined : Number(s.duration_seconds),
              rest_seconds: Number(s.rest_seconds),
              notes: s.notes || ''
            }));

          return {
            exerciseId: l.exercise.id,
            exerciseOrder: i,
            notes: l.notes,
            sets: validSets
          };
        })
        .filter(e => e.sets.length > 0);

      if (validExercises.length === 0) {
        setSaving(false);
        return;
      }

      setSubmitError(null)
      await onSubmit({
        name: name.trim(), date, notes, rpe,
        exercises: validExercises,
      })
      setName(''); setNotes(''); setRpe(undefined); setLogged([])
      setCurrentStep(0)
    } catch (err: any) {
      let msg = err.message || 'An error occurred while saving the workout. Please try again.'
      if (msg.includes('invalid input syntax') || msg.includes('integer') || msg.includes('numeric')) {
        msg = 'Invalid or empty numbers detected. Please double-check your set inputs (reps, weight, or duration).'
      }
      setSubmitError(msg)
    } finally { setSaving(false) }
  }

  const totalSteps = logged.length + 2
  const isFinalStep = currentStep === logged.length + 1

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  return (
    <div className="flex flex-col min-h-screen pb-40">
      <Stepper currentStep={currentStep} totalSteps={totalSteps} />

      <div className="flex-1 space-y-6 pt-2 px-2">
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
                <h2 className="text-sm font-bold text-foreground uppercase tracking-tight italic">Choose Exercise</h2>
                <p className="text-micro text-muted font-bold tracking-widest mt-0.5 uppercase italic">Select from library</p>
              </div>
              <button
                onClick={() => setPicking(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border text-muted hover:text-foreground transition-all"
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

      {submitError && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-bg border border-error/50 p-6 rounded-2xl shadow-2xl scale-in duration-200 relative">
            <button
              onClick={() => setSubmitError(null)}
              className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center text-center space-y-3 mt-2">
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error mb-2">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground uppercase tracking-tight">Submission Failed</h3>
              <p className="text-xs text-muted leading-relaxed max-w-[250px] mx-auto">{submitError}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

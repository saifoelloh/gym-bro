'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Exercise, ActiveWorkout, ActiveExercise, WorkoutTemplate, LastSessionData, MuscleGroup, MUSCLE_COLORS } from '@/types';
import { supabase } from '@/lib/supabase';
import ExercisePicker from '@/components/ExercisePicker';
import SetLogger from '@/components/SetLogger';
import { Plus, Save, Loader2, Layers, Dumbbell, ChevronRight, ChevronLeft, Play, CheckCircle2, Info } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

function newExerciseEntry(ex: Exercise, order: number): ActiveExercise {
  return {
    exercise: ex,
    exercise_order: order,
    notes: '',
    sets: [{ set_number: 1, reps: '', weight_kg: '', duration_seconds: '', rest_seconds: 90, notes: '' }],
  };
}

function newSetFromSuggestion(setNumber: number, suggestedWeight: number | null): ActiveExercise['sets'][0] {
  return {
    set_number: setNumber,
    reps: '',
    weight_kg: suggestedWeight ?? '',
    duration_seconds: '',
    rest_seconds: 90,
    notes: '',
  };
}

function LogPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get('template');

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loadingTemplate, setLoadingTemplate] = useState(!!templateId);
  const [template, setTemplate] = useState<WorkoutTemplate | null>(null);
  const [lastSessions, setLastSessions] = useState<Record<string, LastSessionData>>({});

  // Stepping State
  // 0: Overview, 1 to N: Exercises, N+1: Summary
  const [activeStep, setActiveStep] = useState(0);
  const [isStepMode, setIsStepMode] = useState(!!templateId);

  const [workout, setWorkout] = useState<ActiveWorkout>({
    name: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
    rpe: null,
    exercises: [],
  });

  useEffect(() => {
    supabase.from('exercises').select('*').order('muscle_group').then(({ data }) => {
      if (data) setExercises(data as Exercise[]);
    });
  }, []);

  const fetchLastSessions = useCallback(async (exerciseIds: string[]) => {
    if (!exerciseIds.length) return {};
    const results: Record<string, LastSessionData> = {};
    await Promise.all(
      exerciseIds.map(async (exId) => {
        const { data } = await supabase
          .from('workout_exercises')
          .select('workout:workouts(date), sets(set_number, reps, weight_kg, duration_seconds)')
          .eq('exercise_id', exId)
          .order('workout(date)', { ascending: false })
          .limit(1)
          .single();

        if (data && (data as any).workout) {
          const sets = ((data as any).sets ?? []).sort((a: any, b: any) => a.set_number - b.set_number);
          const weights = sets.map((s: any) => Number(s.weight_kg ?? 0)).filter((w: number) => w > 0);
          results[exId] = {
            exercise_id: exId,
            date: (data as any).workout.date,
            sets,
            suggested_weight: weights.length ? Math.max(...weights) : null,
          };
        }
      })
    );
    return results;
  }, []);

  useEffect(() => {
    if (!templateId) return;
    setLoadingTemplate(true);

    supabase
      .from('workout_templates')
      .select('*, template_exercises(*, exercise:exercises(*))')
      .eq('id', templateId)
      .single()
      .then(async ({ data }) => {
        if (!data) { setLoadingTemplate(false); return; }

        const t = data as WorkoutTemplate;
        const sorted = [...(t.template_exercises ?? [])].sort((a, b) => a.exercise_order - b.exercise_order);
        setTemplate(t);

        const exIds = sorted.map((te) => te.exercise_id);
        const lastData = await fetchLastSessions(exIds);
        setLastSessions(lastData);

        const activeExercises: ActiveExercise[] = sorted.map((te, i) => {
          const last = lastData[te.exercise_id];
          const suggestedWeight = last?.suggested_weight ?? null;
          const sets = Array.from({ length: te.target_sets }, (_, idx) =>
            newSetFromSuggestion(idx + 1, suggestedWeight)
          );
          return { exercise: te.exercise!, exercise_order: i, notes: te.notes ?? '', sets };
        });

        setWorkout((w) => ({ ...w, name: t.name, exercises: activeExercises }));
        setLoadingTemplate(false);
        setIsStepMode(true);
        setActiveStep(0);
      });
  }, [templateId, fetchLastSessions]);

  const addExercise = async (ex: Exercise) => {
    const lastData = await fetchLastSessions([ex.id]);
    setLastSessions((prev) => ({ ...prev, ...lastData }));
    const last = lastData[ex.id];
    const entry = newExerciseEntry(ex, workout.exercises.length);
    if (last?.suggested_weight) {
      entry.sets = entry.sets.map((s) => ({ ...s, weight_kg: last.suggested_weight! }));
    }
    setWorkout((w) => ({ ...w, exercises: [...w.exercises, entry] }));
  };

  const updateExercise = (i: number, updated: ActiveExercise) => {
    setWorkout((w) => {
      const ex = [...w.exercises];
      ex[i] = updated;
      return { ...w, exercises: ex };
    });
  };

  const removeExercise = (i: number) => {
    setWorkout((w) => ({
      ...w,
      exercises: w.exercises.filter((_, idx) => idx !== i).map((e, idx) => ({ ...e, exercise_order: idx })),
    }));
  };

  const saveWorkout = async () => {
    if (!workout.name.trim()) { setError('Session name is required'); return; }
    if (workout.exercises.length === 0) { setError('Add at least one exercise'); return; }
    setSaving(true);
    setError('');

    try {
      const { data: savedWorkout, error: wErr } = await supabase
        .from('workouts')
        .insert({ name: workout.name, date: workout.date, notes: workout.notes || null, rpe: workout.rpe || null })
        .select().single();

      if (wErr || !savedWorkout) throw wErr;

      for (const we of workout.exercises) {
        const { data: savedWE, error: weErr } = await supabase
          .from('workout_exercises')
          .insert({ workout_id: savedWorkout.id, exercise_id: we.exercise.id, exercise_order: we.exercise_order, notes: we.notes || null })
          .select().single();

        if (weErr || !savedWE) throw weErr;

        const setsToInsert = we.sets
          .filter((s) => s.reps !== '' || s.weight_kg !== '' || s.duration_seconds !== '')
          .map((s) => ({
            workout_exercise_id: savedWE.id,
            set_number: s.set_number,
            reps: s.reps !== '' ? Number(s.reps) : null,
            weight_kg: s.weight_kg !== '' ? Number(s.weight_kg) : null,
            duration_seconds: s.duration_seconds !== '' ? Number(s.duration_seconds) : null,
            rest_seconds: s.rest_seconds !== '' ? Number(s.rest_seconds) : null,
            notes: s.notes || null,
          }));

        if (setsToInsert.length > 0) {
          const { error: sErr } = await supabase.from('sets').insert(setsToInsert);
          if (sErr) throw sErr;
        }
      }

      router.push(`/history?id=${savedWorkout.id}`);
    } catch (e) {
      console.error(e);
      setError('Failed to save. Check console.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingTemplate) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <Loader2 size={32} className="animate-spin text-accent" />
      <p className="font-mono text-[10px] text-muted animate-pulse uppercase tracking-[0.3em]">SYNCHRONIZING PROGRAM...</p>
    </div>
  );

  if (!templateId && workout.exercises.length === 0) {
    return (
      <ModeSelector
        onFree={() => { setIsStepMode(false); setShowPicker(true); }}
        exercises={exercises}
        onAdd={addExercise}
        showPicker={showPicker}
        setShowPicker={setShowPicker}
      />
    );
  }

  // --- RENDERING STEP MODE ---
  if (isStepMode) {
    // Overview Step
    if (activeStep === 0) {
      return (
        <div className="space-y-6 fade-up max-w-2xl mx-auto px-1 sm:px-0">
          <div className="flex items-center gap-4">
            <Link href="/templates" className="p-2 -ml-2 text-muted hover:text-text transition-colors rounded-full hover:bg-surface/50">
              <ChevronLeft size={24} />
            </Link>
            <h1 className="font-display text-4xl tracking-widest uppercase">WORKOUT<br /><span className="text-accent">READY.</span></h1>
          </div>

          <div className="card p-6 space-y-6 border-accent/20 bg-accent/[0.02]">
            <div>
              <span className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] block mb-2">ACTIVE PROGRAM</span>
              <h2 className="font-display text-2xl tracking-widest uppercase mb-2">{template?.name || workout.name}</h2>
              {template?.description && <p className="font-mono text-xs text-muted leading-relaxed italic border-l-2 border-accent/20 pl-3">{template.description}</p>}
            </div>

            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-[11px] tracking-widest text-muted uppercase">SESSION STRUCTURE</h3>
                <span className="font-mono text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded">{workout.exercises.length} EXERCISES</span>
              </div>
              <div className="space-y-3">
                {workout.exercises.map((we, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-surface/40 border border-border/40 hover:border-accent/40 transition-colors group">
                    <span className="font-mono text-[10px] text-muted group-hover:text-accent transition-colors w-4">{i + 1}</span>
                    <div className="flex-1">
                      <p className="font-mono text-xs text-text uppercase tracking-wider">{we.exercise.name}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="font-mono text-[9px] text-muted uppercase">{we.sets.length} TARGET SETS</span>
                        <span className="w-1 h-1 rounded-full bg-border/60 self-center" />
                        <span className="font-mono text-[9px] text-accent uppercase tracking-tighter" style={{ color: MUSCLE_COLORS[we.exercise.muscle_group as MuscleGroup] }}>{we.exercise.muscle_group}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveStep(1)}
            className="btn-primary w-full py-5 flex items-center justify-center gap-4 shadow-2xl shadow-accent/20 border-t border-white/10"
          >
            <Play size={20} fill="currentColor" />
            <span className="font-display tracking-[0.3em] text-sm font-bold">START SESSION</span>
          </button>
        </div>
      );
    }

    // Summary Step
    if (activeStep > workout.exercises.length) {
      return (
        <div className="space-y-6 fade-up max-w-2xl mx-auto px-1 sm:px-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveStep(workout.exercises.length)} className="p-2 -ml-2 text-muted hover:text-text transition-colors rounded-full hover:bg-surface/50">
              <ChevronLeft size={24} />
            </button>
            <h1 className="font-display text-4xl tracking-widest uppercase">SESSION<br /><span className="text-accent">DONE.</span></h1>
          </div>

          <div className="card p-8 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.05] rotate-12">
              <CheckCircle2 size={120} />
            </div>

            <div className="flex flex-col items-center text-center space-y-4 relative z-10">
              <div className="p-4 bg-accent/10 rounded-full text-accent shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-1">
                <h2 className="font-display text-2xl tracking-[0.2em] uppercase">VICTORY.</h2>
                <p className="font-mono text-[10px] text-muted uppercase tracking-widest">Great session, brader. Lock in the progress.</p>
              </div>
            </div>

            <div className="space-y-6 border-t border-border pt-8 relative z-10">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="font-mono text-[10px] text-muted uppercase tracking-[0.2em]">INTENSITY (RPE)</label>
                  <span className="font-mono text-[9px] text-accent/60 italic uppercase tracking-widest">Rate of Perceived Exertion</span>
                </div>
                <div className="flex gap-2 justify-between">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setWorkout((w) => ({ ...w, rpe: num }))}
                      className={`flex-1 aspect-square rounded text-xs font-mono transition-all border ${workout.rpe === num ? 'bg-accent text-primary border-accent shadow-lg shadow-accent/40' : 'bg-surface/50 border-border/40 text-muted'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <p className="font-mono text-[9px] text-muted text-center italic tracking-widest opacity-80 pt-1">
                  {workout.rpe ? (
                    workout.rpe >= 9 ? 'MAX EFFORT - TO FAILURE' :
                      workout.rpe >= 7 ? 'HIGH INTENSITY - SWEATING' :
                        workout.rpe >= 5 ? 'MODERATE - CONTROLLED' : 'WARMUP / ACTIVE RECOVERY'
                  ) : 'PICK RPE 1-10'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[10px] text-muted uppercase tracking-[0.2em]">POST-SESSION NOTES</label>
                <textarea
                  placeholder="How was the energy? Any new PRs?"
                  value={workout.notes}
                  onChange={(e) => setWorkout((w) => ({ ...w, notes: e.target.value }))}
                  className="input-field min-h-[140px] py-4 text-sm px-4 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {error && <p className="font-mono text-xs text-red-400 text-center animate-shake">{error}</p>}

          <button
            onClick={saveWorkout}
            disabled={saving}
            className="btn-primary w-full py-6 flex items-center justify-center gap-4 shadow-2xl shadow-accent/20 border-t border-white/10"
          >
            {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
            <span className="font-display tracking-[0.4em] text-sm font-bold uppercase">
              {saving ? 'RECORDING DATA...' : 'FINISH & SAVE'}
            </span>
          </button>
        </div>
      );
    }

    // Active Exercise Step
    const currentExIndex = activeStep - 1;
    const we = workout.exercises[currentExIndex];
    const lastData = lastSessions[we.exercise.id];

    return (
      <div className="space-y-6 fade-up pb-32 px-1 sm:px-0">
        {/* Progress System */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-end px-1">
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest">SESSION PROGRESS</span>
            <span className="font-display text-[10px] text-accent tracking-widest uppercase">{activeStep} / {workout.exercises.length} EXERCISES</span>
          </div>
          <div className="w-full bg-card h-1 sm:h-2 rounded-full overflow-hidden flex gap-1 border border-white/[0.03]">
            {workout.exercises.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-full transition-all duration-700 ease-out ${i < activeStep - 1 ? 'bg-accent/40 shadow-inner' : i === activeStep - 1 ? 'bg-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]' : 'bg-border/20'}`}
              />
            ))}
          </div>
        </div>

        {/* Dynamic Exercise Header */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <button onClick={() => setActiveStep(activeStep - 1)} className="p-3 -ml-3 text-muted hover:text-text transition-colors rounded-full hover:bg-surface/50 active:scale-95">
            <ChevronLeft size={28} />
          </button>
          <div className="text-center flex-1 min-w-0">
            <h2 className="font-display text-2xl sm:text-3xl tracking-widest uppercase truncate leading-tight">{we.exercise.name}</h2>
            <div className="flex items-center justify-center gap-3 mt-1">
              <span className="font-mono text-[9px] text-accent uppercase px-1.5 py-0.5 bg-accent/10 border border-accent/20 rounded-sm">
                {we.exercise.muscle_group}
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="font-mono text-[9px] text-muted uppercase">STEP {activeStep}</span>
            </div>
          </div>
          <div className="w-10" />
        </div>

        {/* Reference Board */}
        {lastData && (
          <div className="card p-4 sm:p-5 bg-accent/[0.04] border-accent/20 shadow-md transform hover:scale-[1.01] transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Info size={14} className="text-accent" />
                <span className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] font-bold">LAST SESSION REFERENCE</span>
              </div>
              <span className="font-mono text-[9px] text-muted uppercase tracking-widest px-2 py-0.5 bg-surface/50 rounded">{format(new Date(lastData.date), 'dd MMMM yyyy')}</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
              {lastData.sets.length > 0 ? (
                lastData.sets.map((s, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 min-w-[70px] bg-surface/60 p-3 rounded-lg border border-border/40 shadow-sm first:border-accent/40">
                    <span className="font-mono text-[9px] text-muted uppercase">SET {s.set_number}</span>
                    <span className="font-mono text-sm text-text font-bold">
                      {s.weight_kg ? s.weight_kg + 'kg' : 'BW'}
                    </span>
                    <span className="font-mono text-[10px] text-accent/80">× {s.reps ?? '?'}</span>
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-2 italic font-mono text-[10px] text-muted uppercase">No data for last workout</div>
              )}
            </div>
          </div>
        )}

        {/* Controller View */}
        <div className="pb-12 animate-in slide-in-from-bottom duration-300">
          <SetLogger
            exerciseEntry={we}
            index={currentExIndex}
            onChange={(updated) => updateExercise(currentExIndex, updated)}
            onRemove={() => removeExercise(currentExIndex)}
          />
        </div>

        {/* Step Navigation Bar */}
        <div className="fixed bottom-20 sm:bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-background via-background/95 to-transparent z-50 pointer-events-none sm:border-t sm:border-border/40">
          <div className="max-w-2xl mx-auto flex gap-4 pointer-events-auto">
            <button
              onClick={() => setActiveStep(activeStep + 1)}
              className="btn-primary flex-1 py-5 flex items-center justify-center gap-3 shadow-2xl shadow-accent/30 rounded-xl hover:scale-[1.02] active:scale-95 transition-all text-sm group"
            >
              <span className="font-display tracking-[0.3em] font-bold uppercase transition-all group-hover:tracking-[0.4em]">
                {activeStep === workout.exercises.length ? 'REVIEW SUMMARY' : 'NEXT EXERCISE'}
              </span>
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERING LIST MODE (FREE WORKOUT) ---
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="fade-up px-1 sm:px-0">
        <h1 className="font-display text-4xl sm:text-5xl tracking-widest uppercase leading-tight">FREE<br /><span className="text-accent text-3xl sm:text-4xl">SESSION.</span></h1>
        <p className="font-mono text-[10px] text-muted mt-2 tracking-[0.3em] uppercase border-l border-border pl-3">Track real-time performance</p>
      </div>

      <div className="card p-6 space-y-6 fade-up bg-surface/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-muted block ml-1 tracking-widest uppercase opacity-70">SESSION ID</label>
            <input type="text" placeholder="e.g. MORNING GRIND" value={workout.name}
              onChange={(e) => setWorkout((w) => ({ ...w, name: e.target.value }))} className="input-field py-4 px-4 text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-muted block ml-1 tracking-widest uppercase opacity-70">DATE</label>
            <input type="date" value={workout.date}
              onChange={(e) => setWorkout((w) => ({ ...w, date: e.target.value }))} className="input-field py-4 px-4 text-sm" />
          </div>
        </div>
      </div>

      <div className="space-y-6 fade-up">
        {workout.exercises.map((we, i) => {
          const last = lastSessions[we.exercise.id];
          return (
            <div key={`${we.exercise.id}-${i}`} className="space-y-1">
              {last && (
                <div className="flex items-center gap-3 px-4 mb-2 overflow-x-auto no-scrollbar py-1">
                  <span className="font-mono text-[9px] text-accent/80 bg-accent/5 px-2 py-0.5 rounded whitespace-nowrap uppercase tracking-widest">
                    HISTO {format(new Date(last.date), 'dd MMM')}
                  </span>
                  {last.sets.slice(0, 4).map((s, idx) => (
                    <span key={idx} className="font-mono text-[10px] text-subtle opacity-70 bg-card px-2 py-1 rounded-sm border border-border/40 whitespace-nowrap">
                      {s.weight_kg ? s.weight_kg + 'kg' : 'BW'} × {s.reps ?? '?'}
                    </span>
                  ))}
                  {last.sets.length > 4 && <span className="text-[9px] text-muted font-mono">+ {last.sets.length - 4}</span>}
                </div>
              )}
              <SetLogger
                exerciseEntry={we}
                index={i}
                onChange={(updated) => updateExercise(i, updated)}
                onRemove={() => removeExercise(i)}
              />
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setShowPicker(true)}
        className="w-full h-24 card border-dashed border-2 flex flex-col items-center justify-center gap-4 hover:border-accent/40 hover:bg-accent/[0.02] transition-all group fade-up"
      >
        <div className="p-2 bg-muted/10 rounded-full group-hover:bg-accent/10 transition-colors">
          <Plus size={24} className="text-muted group-hover:text-accent transition-colors" />
        </div>
        <span className="font-display tracking-[0.4em] text-[10px] text-muted group-hover:text-accent uppercase">APPEND EXERCISE</span>
      </button>

      {error && <p className="font-mono text-xs text-red-400 text-center py-2 bg-red-500/10 rounded animate-shake">{error}</p>}

      <div className="sticky bottom-20 sm:bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-background via-background/95 to-transparent z-40 pointer-events-none sm:border-t sm:border-border/40">
        <div className="max-w-3xl mx-auto flex justify-end pointer-events-auto">
          <button onClick={saveWorkout} disabled={saving}
            className="btn-primary flex items-center gap-4 shadow-2xl shadow-accent/20 px-10 py-5 rounded-xl group overflow-hidden relative">
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <div className="relative z-10 flex items-center gap-3">
              {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
              <span className="font-display tracking-[0.2em] font-bold text-sm uppercase">{saving ? 'STORING...' : 'FINISH WORKOUT'}</span>
            </div>
          </button>
        </div>
      </div>

      {showPicker && (
        <ExercisePicker
          exercises={exercises}
          onAdd={addExercise}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

function ModeSelector({
  onFree, exercises, onAdd, showPicker, setShowPicker,
}: {
  onFree: () => void;
  exercises: Exercise[];
  onAdd: (ex: Exercise) => void;
  showPicker: boolean;
  setShowPicker: (v: boolean) => void;
}) {
  return (
    <div className="space-y-8 fade-up py-4 px-1 sm:px-0 max-w-2xl mx-auto">
      <div className="text-center sm:text-left space-y-2">
        <h1 className="font-display text-5xl sm:text-6xl tracking-tighter uppercase leading-[0.9] font-black">LOG<br /><span className="text-accent">READY?</span></h1>
        <p className="font-mono text-[10px] text-muted tracking-[0.4em] uppercase opacity-70 pl-1">Choose your objective</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
        <button onClick={onFree}
          className="card p-10 text-left hover:border-accent transition-all group relative overflow-hidden bg-surface/30 border-border/40 shadow-xl">
          <div className="relative z-10 flex flex-col h-full">
            <div className="p-4 bg-accent/10 rounded-xl w-fit mb-8 shadow-inner border border-accent/20">
              <Dumbbell size={32} className="text-accent" />
            </div>
            <h2 className="font-display tracking-[0.2em] text-2xl mb-3 uppercase leading-none">FREE<br />PLAY</h2>
            <p className="font-mono text-[10px] text-muted leading-relaxed mb-10 flex-1 uppercase tracking-widest opacity-80">
              Ad-hoc training. pick exercises as you move through the gym floor.
            </p>
            <div className="flex items-center gap-3 text-accent text-[11px] font-display tracking-[0.3em] mt-auto font-bold border-t border-accent/10 pt-4">
              INTUITION MODE <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-[0.02] text-accent rotate-12 scale-150 pointer-events-none">
            <Dumbbell size={160} />
          </div>
        </button>

        <Link href="/templates"
          className="card p-10 text-left hover:border-gold transition-all group relative overflow-hidden bg-surface/30 border-border/40 shadow-xl">
          <div className="relative z-10 flex flex-col h-full">
            <div className="p-4 bg-gold/10 rounded-xl w-fit mb-8 shadow-inner border border-gold/20">
              <Layers size={32} className="text-gold" />
            </div>
            <h2 className="font-display tracking-[0.2em] text-2xl mb-3 uppercase leading-none">LOAD<br />PROGRAM</h2>
            <p className="font-mono text-[10px] text-muted leading-relaxed mb-10 flex-1 uppercase tracking-widest opacity-80">
              Strict execution. uses your pre-defined templates with milestone targets.
            </p>
            <div className="flex items-center gap-3 text-gold text-[11px] font-display tracking-[0.3em] mt-auto font-bold border-t border-gold/10 pt-4">
              PRECISION MODE <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-[0.02] text-gold rotate-12 scale-150 pointer-events-none">
            <Layers size={160} />
          </div>
        </Link>
      </div>

      {showPicker && (
        <ExercisePicker
          exercises={exercises}
          onAdd={onAdd}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

export default function LogPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-screen -mt-20 gap-4">
        <div className="relative">
          <Loader2 size={48} className="animate-spin text-accent opacity-20" />
          <Loader2 size={48} className="animate-spin text-accent absolute inset-0 [animation-delay:-0.5s] [stroke-dasharray:10,32]" />
        </div>
        <p className="font-mono text-[9px] text-muted animate-pulse uppercase tracking-[0.5em] ml-2">SYSTEM PREPARING...</p>
      </div>
    }>
      <LogPageInner />
    </Suspense>
  );
}

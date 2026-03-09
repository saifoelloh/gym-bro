'use client';
import { useState, useEffect } from 'react';
import { WorkoutTemplate, TemplateExercise, Exercise, MUSCLE_COLORS, MuscleGroup } from '@/types';
import { supabase } from '@/lib/supabase';
import ExercisePicker from './ExercisePicker';
import { Plus, Trash2, Save, GripVertical, Loader2, X, ChevronUp, ChevronDown } from 'lucide-react';

interface Props {
  template?: WorkoutTemplate | null; // null = create new
  onSaved: (t: WorkoutTemplate) => void;
  onCancel: () => void;
}

interface DraftExercise {
  tempId: string; // client-only ID before save
  exercise: Exercise;
  target_sets: number;
  notes: string;
  order: number;
}

export default function TemplateEditor({ template, onSaved, onCancel }: Props) {
  const [name, setName] = useState(template?.name ?? '');
  const [description, setDescription] = useState(template?.description ?? '');
  const [exercises, setExercises] = useState<DraftExercise[]>([]);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.from('exercises').select('*').order('muscle_group').then(({ data }) => {
      if (data) setAllExercises(data as Exercise[]);
    });

    // If editing, load existing template exercises
    if (template?.id) {
      supabase
        .from('template_exercises')
        .select('*, exercise:exercises(*)')
        .eq('template_id', template.id)
        .order('exercise_order')
        .then(({ data }) => {
          if (data) {
            setExercises((data as TemplateExercise[]).map((te, i) => ({
              tempId: te.id,
              exercise: te.exercise!,
              target_sets: te.target_sets,
              notes: te.notes ?? '',
              order: i,
            })));
          }
        });
    }
  }, [template]);

  const addExercise = (ex: Exercise) => {
    setExercises((prev) => [
      ...prev,
      { tempId: crypto.randomUUID(), exercise: ex, target_sets: 3, notes: '', order: prev.length },
    ]);
  };

  const removeExercise = (tempId: string) => {
    setExercises((prev) =>
      prev.filter((e) => e.tempId !== tempId).map((e, i) => ({ ...e, order: i }))
    );
  };

  const updateExercise = (tempId: string, field: 'target_sets' | 'notes', value: string | number) => {
    setExercises((prev) =>
      prev.map((e) => (e.tempId === tempId ? { ...e, [field]: value } : e))
    );
  };

  const moveExercise = (tempId: string, dir: -1 | 1) => {
    setExercises((prev) => {
      const idx = prev.findIndex((e) => e.tempId === tempId);
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr.map((e, i) => ({ ...e, order: i }));
    });
  };

  const save = async () => {
    if (!name.trim()) { setError('Template name is required'); return; }
    if (exercises.length === 0) { setError('Add at least one exercise'); return; }

    setSaving(true);
    setError('');

    try {
      let templateId = template?.id;

      if (templateId) {
        // Update existing
        await supabase
          .from('workout_templates')
          .update({ name: name.trim(), description: description || null })
          .eq('id', templateId);

        // Delete old exercises and re-insert
        await supabase.from('template_exercises').delete().eq('template_id', templateId);
      } else {
        // Create new
        const { data: newT, error: tErr } = await supabase
          .from('workout_templates')
          .insert({ name: name.trim(), description: description || null })
          .select()
          .single();
        if (tErr || !newT) throw tErr;
        templateId = newT.id;
      }

      // Insert exercises
      await supabase.from('template_exercises').insert(
        exercises.map((e, i) => ({
          template_id: templateId,
          exercise_id: e.exercise.id,
          exercise_order: i,
          target_sets: e.target_sets,
          notes: e.notes || null,
        }))
      );

      // Fetch fresh template
      const { data: saved } = await supabase
        .from('workout_templates')
        .select('*, template_exercises(*, exercise:exercises(*))')
        .eq('id', templateId)
        .single();

      onSaved(saved as WorkoutTemplate);
    } catch (e) {
      console.error(e);
      setError('Failed to save template.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display tracking-widest text-base sm:text-lg">
            {template ? 'EDIT TEMPLATE' : 'NEW TEMPLATE'}
          </h2>
          <button onClick={onCancel} className="text-muted hover:text-text transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Template Name + Description */}
          <div className="space-y-3">
            <div>
              <label className="font-mono text-xs text-muted block mb-1.5 tracking-widest">TEMPLATE NAME</label>
              <input
                type="text"
                placeholder="e.g. Push Day A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-muted block mb-1.5 tracking-widest">DESCRIPTION (optional)</label>
              <input
                type="text"
                placeholder="e.g. Chest, Shoulders, Triceps focus"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Exercise List */}
          {exercises.length > 0 && (
            <div className="space-y-2">
              <p className="font-mono text-xs text-muted tracking-widest">EXERCISES ({exercises.length})</p>
              {exercises.map((de) => {
                const color = MUSCLE_COLORS[de.exercise.muscle_group as MuscleGroup];
                return (
                  <div key={de.tempId} className="card p-3 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Reorder and Exercise Info */}
                      <div className="flex items-center gap-2 flex-grow min-w-0">
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => moveExercise(de.tempId, -1)}
                            className="text-muted hover:text-text transition-colors p-0.5"
                          >
                            <ChevronUp size={12} />
                          </button>
                          <button
                            onClick={() => moveExercise(de.tempId, 1)}
                            className="text-muted hover:text-text transition-colors p-0.5"
                          >
                            <ChevronDown size={12} />
                          </button>
                        </div>
                        <div className="flex-1 truncate">
                          <span className="font-mono text-sm text-text block truncate">{de.exercise.name}</span>
                          <span
                            className="font-mono text-[10px] px-1.5 py-0.5 rounded inline-block"
                            style={{ backgroundColor: `${color}20`, color }}
                          >
                            {de.exercise.muscle_group}
                          </span>
                        </div>
                      </div>

                      {/* Actions (Sets and Delete) */}
                      <div className="flex items-center gap-3 w-full sm:w-auto sm:justify-end border-t sm:border-t-0 border-border/50 pt-2 sm:pt-0">
                        <div className="flex items-center gap-1.5">
                          <label className="font-mono text-[10px] text-muted tracking-widest uppercase">SETS</label>
                          <input
                            type="number"
                            min={1}
                            max={20}
                            value={de.target_sets}
                            onChange={(e) => updateExercise(de.tempId, 'target_sets', Number(e.target.value))}
                            className="input-field w-14 text-center py-1 text-xs"
                          />
                        </div>

                        <button
                          onClick={() => removeExercise(de.tempId)}
                          className="ml-auto text-muted hover:text-red-400 transition-colors p-1.5 rounded-full hover:bg-red-400/10"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Notes/cue per exercise */}
                    <input
                      type="text"
                      placeholder="Coaching notes / cues (optional)"
                      value={de.notes}
                      onChange={(e) => updateExercise(de.tempId, 'notes', e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Add Exercise */}
          <button
            onClick={() => setShowPicker(true)}
            className="w-full flex items-center justify-center gap-2 border border-dashed border-border hover:border-accent/50 rounded py-3 font-mono text-xs text-muted hover:text-accent transition-colors"
          >
            <Plus size={12} />
            ADD EXERCISE
          </button>

          {error && <p className="font-mono text-xs text-red-400 text-center">{error}</p>}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border flex justify-end gap-3">
          <button onClick={onCancel} className="btn-ghost">CANCEL</button>
          <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'SAVING...' : 'SAVE TEMPLATE'}
          </button>
        </div>
      </div>

      {showPicker && (
        <ExercisePicker
          exercises={allExercises}
          onAdd={addExercise}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { WorkoutTemplate, Exercise, MUSCLE_COLORS, MuscleGroup, CreateTemplatePayload } from '@/types';
import { api } from '@/lib/api/client';
import ExercisePicker from './ExercisePicker';
import { Plus, Trash2, Save, Loader2, X, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Props {
  template?: WorkoutTemplate | null;
  onSaved: () => void;
  onCancel: () => void;
}

interface DraftExercise {
  tempId: string;
  exercise: Exercise;
  target_sets: number;
  notes: string;
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
    api.exercises.list().then(setAllExercises);

    if (template?.template_exercises) {
      setExercises(template.template_exercises.map((te) => ({
        tempId: te.id,
        exercise: te.exercise!,
        target_sets: te.target_sets,
        notes: te.notes ?? '',
      })));
    }
  }, [template]);

  const addExercise = (ex: Exercise) => {
    setExercises((prev) => [
      ...prev,
      { tempId: crypto.randomUUID(), exercise: ex, target_sets: 3, notes: '' },
    ]);
  };

  const removeExercise = (tempId: string) => {
    setExercises((prev) => prev.filter((e) => e.tempId !== tempId));
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
      return [...arr];
    });
  };

  const save = async () => {
    if (!name.trim()) { setError('Template name is required'); return; }
    if (exercises.length === 0) { setError('Add at least one exercise'); return; }

    setSaving(true);
    setError('');

    try {
      const payload: CreateTemplatePayload = {
        name: name.trim(),
        description: description || undefined,
        exercises: exercises.map((e, i) => ({
          exercise_id: e.exercise.id,
          exercise_order: i,
          target_sets: e.target_sets,
          notes: e.notes || undefined,
        })),
      };

      if (template?.id) {
        await api.templates.update(template.id, payload);
      } else {
        await api.templates.create(payload);
      }

      onSaved();
    } catch (e: any) {
      setError(e.message || 'Failed to save template.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col sm:items-center sm:justify-center animate-in fade-in duration-300">
      <div className="bg-bg border-t sm:border border-border sm:rounded-2xl w-full max-w-2xl h-full sm:h-auto sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative transition-all">

        {/* Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-5 border-b border-border bg-bg/80 backdrop-blur-xl">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight uppercase">
              {template ? 'Edit Template' : 'New Template'}
            </h2>
            <p className="text-micro text-muted font-mono tracking-widest mt-0.5 uppercase">
              {exercises.length} {exercises.length === 1 ? 'Exercise' : 'Exercises'} Selected
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border text-muted hover:text-foreground hover:bg-surface transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-8 scrollbar-hide pb-32 sm:pb-6">

          {/* Metadata Section */}
          <div className="space-y-4">
            <div>
              <label className="text-micro font-bold text-muted tracking-widest uppercase mb-1.5 block">Template Info</label>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Template Name (e.g. Pull Day A)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-info/50 transition-all font-medium"
                />
                <input
                  type="text"
                  placeholder="Short Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-surface/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-info/50 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Exercises Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-micro font-bold text-muted tracking-widest uppercase italic">Workout Plan</label>
              {exercises.length > 0 && (
                <span className="text-micro text-info font-bold tracking-widest uppercase">
                  Sortable List
                </span>
              )}
            </div>

            {exercises.length === 0 ? (
              <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mx-auto text-muted">
                  <Plus size={20} />
                </div>
                <p className="text-muted text-sm">No exercises added yet.<br /><span className="text-micro">Start by adding some below.</span></p>
              </div>
            ) : (
              <div className="space-y-3">
                {exercises.map((de, idx) => {
                  const color = MUSCLE_COLORS[de.exercise.muscle_group as MuscleGroup];
                  return (
                    <div key={de.tempId} className="group animate-in slide-in-from-bottom-2 duration-300 fill-mode-both" style={{ animationDelay: `${idx * 50}ms` }}>
                      <Card className="!p-3 sm:!p-4 border-border/80 hover:border-border transition-all relative overflow-hidden group-hover:shadow-xl group-hover:shadow-blue-500/5">
                        <div className="flex items-start gap-4">
                          {/* Order Controls */}
                          <div className="flex flex-col gap-1 items-center justify-center pt-1.5 flex-shrink-0">
                            <button
                              onClick={() => moveExercise(de.tempId, -1)}
                              disabled={idx === 0}
                              className="text-gray-600 hover:text-info disabled:opacity-0 transition-all p-1"
                            >
                              <ChevronUp size={16} />
                            </button>
                            <span className="text-micro font-bold text-muted font-mono">{idx + 1}</span>
                            <button
                              onClick={() => moveExercise(de.tempId, 1)}
                              disabled={idx === exercises.length - 1}
                              className="text-gray-600 hover:text-info disabled:opacity-0 transition-all p-1"
                            >
                              <ChevronDown size={16} />
                            </button>
                          </div>

                          {/* Exercise Info */}
                          <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <h4 className="text-sm font-bold text-foreground truncate">{de.exercise.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant={de.exercise.muscle_group} className="text-nano px-1.5 py-0">
                                    {de.exercise.muscle_group.toUpperCase()}
                                  </Badge>
                                  <span className="text-micro text-gray-600 uppercase font-bold tracking-tight">{de.exercise.exercise_type}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => removeExercise(de.tempId)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:text-error hover:bg-error/10 transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            <div className="grid grid-cols-5 gap-3 items-center">
                              <div className="col-span-2 space-y-1">
                                <label className="text-nano font-bold text-muted tracking-widest uppercase pl-1">Target Sets</label>
                                <input
                                  type="number"
                                  min={1}
                                  max={20}
                                  value={de.target_sets}
                                  onChange={(e) => updateExercise(de.tempId, 'target_sets', Number(e.target.value))}
                                  className="w-full bg-black/40 border border-border rounded-lg px-2 py-1.5 text-center text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/40 font-bold"
                                />
                              </div>
                              <div className="col-span-3 space-y-1">
                                <label className="text-nano font-bold text-muted tracking-widest uppercase pl-1">Quick Note</label>
                                <input
                                  type="text"
                                  placeholder="Form cues, goals..."
                                  value={de.notes}
                                  onChange={(e) => updateExercise(de.tempId, 'notes', e.target.value)}
                                  className="w-full bg-black/40 border border-border rounded-lg px-3 py-1.5 text-xs text-foreground placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Style Accent */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 opacity-20" style={{ backgroundColor: color }}></div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add Exercise Trigger */}
            <button
              onClick={() => setShowPicker(true)}
              className="group w-full flex items-center justify-center gap-2 border-2 border-dashed border-border hover:border-info/40 hover:bg-info/5 rounded-2xl py-4 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-surface flex items-center justify-center text-muted group-hover:text-info group-hover:scale-110 transition-all">
                <Plus size={14} />
              </div>
              <span className="text-xs font-bold text-muted group-hover:text-info tracking-widest uppercase">Add Another Exercise</span>
            </button>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/30 rounded-xl p-3 flex items-center gap-3 animate-in shake">
              <span className="text-error text-xs font-medium text-center w-full">{error}</span>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 border-t border-border bg-bg/90 backdrop-blur-xl flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 sm:py-3 text-xs font-bold text-muted tracking-widest hover:text-foreground hover:bg-surface rounded-xl transition-all uppercase"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving || !name.trim() || exercises.length === 0}
            className="flex-[2] bg-info hover:bg-info disabled:opacity-50 disabled:hover:bg-info text-foreground py-3.5 sm:py-3 rounded-xl font-bold text-xs tracking-widest transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 uppercase"
          >
            {saving ? <Loader2 size={16} className="animate-spin text-foreground/50" /> : <Save size={16} />}
            {saving ? 'Saving...' : (template ? 'Update Template' : 'Create Template')}
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

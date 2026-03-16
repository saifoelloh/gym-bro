'use client';
import { ActiveExercise, ActiveSet, REST_PRESETS, MUSCLE_COLORS, MuscleGroup } from '@/types';
import { Plus, Trash2, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useState } from 'react';

interface Props {
  exerciseEntry: ActiveExercise;
  index: number;
  onChange: (updated: ActiveExercise) => void;
  onRemove: () => void;
}

function newSet(setNumber: number): ActiveSet {
  return {
    set_number: setNumber,
    reps: '',
    weight_kg: '',
    duration_seconds: '',
    rest_seconds: 90,
    notes: '', // Keeping in type for compatibility, but moving UI
  };
}

export default function SetLogger({ exerciseEntry, index, onChange, onRemove }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const { sets, notes, muscle_group, exercise_type, name } = exerciseEntry;
  const type = exercise_type;
  const color = MUSCLE_COLORS[muscle_group as MuscleGroup];

  const updateSet = (i: number, field: keyof ActiveSet, value: string | number) => {
    const newSets = [...sets];
    newSets[i] = { ...newSets[i], [field]: value };
    onChange({ ...exerciseEntry, sets: newSets });
  };

  const updateExerciseNotes = (val: string) => {
    onChange({ ...exerciseEntry, notes: val });
  };

  const addSet = () => {
    const prev = sets[sets.length - 1];
    const next = newSet(sets.length + 1);
    if (prev) {
      next.weight_kg = prev.weight_kg;
      next.rest_seconds = prev.rest_seconds;
    }
    onChange({ ...exerciseEntry, sets: [...sets, next] });
  };

  const removeSet = (i: number) => {
    const newSets = sets
      .filter((_, idx) => idx !== i)
      .map((s, idx) => ({ ...s, set_number: idx + 1 }));
    onChange({ ...exerciseEntry, sets: newSets });
  };

  return (
    <div className="card overflow-hidden">
      {/* Exercise Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer select-none bg-surface/50"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-micro font-mono px-2 py-0.5 rounded border"
            style={{ backgroundColor: `${color}10`, color, borderColor: `${color}40` }}
          >
            {index + 1}
          </span>
          <div>
            <p className="font-display tracking-widest text-sm uppercase">{name}</p>
            <p className="font-mono text-micro text-muted uppercase">
              {muscle_group}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="font-mono text-micro text-muted block uppercase">{sets.length} sets</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="text-muted hover:text-error transition-colors p-2 rounded-full hover:bg-error/10"
          >
            <Trash2 size={16} />
          </button>
          {collapsed ? <ChevronDown size={20} className="text-muted" /> : <ChevronUp size={20} className="text-muted" />}
        </div>
      </div>

      {!collapsed && (
        <div className="px-3 sm:px-4 pb-4 space-y-4 border-t border-border pt-4">
          {/* Set Rows */}
          <div className="space-y-3">
            {sets.map((set, i) => (
              <div key={i} className="relative flex flex-col sm:flex-row sm:items-end gap-3 p-3 rounded-lg bg-card/30 border border-border/40">
                {/* Set number & Remove Button (Mobile Header) */}
                <div className="flex items-center justify-between sm:hidden border-b border-border/40 pb-2 mb-1">
                  <span className="font-mono text-xs text-muted uppercase tracking-widest">SET {set.set_number}</span>
                  <button
                    onClick={() => removeSet(i)}
                    className="text-muted hover:text-error p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Set number (Desktop) */}
                <div className="hidden sm:flex w-8 h-10 items-center justify-center font-mono text-xs text-muted flex-shrink-0">
                  {set.set_number}
                </div>

                {/* Fields Grid */}
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-none gap-3" style={{
                  gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))'
                }}>
                  {/* Duration (timed) */}
                  {type === 'timed' && (
                    <div>
                      <label className="font-mono text-micro text-muted block mb-1 uppercase tracking-tighter">SECONDS</label>
                      <input
                        type="number"
                        placeholder="30"
                        value={set.duration_seconds}
                        onChange={(e) => updateSet(i, 'duration_seconds', e.target.value)}
                        className="input-field py-3 text-base sm:text-sm text-center"
                        min={0}
                      />
                    </div>
                  )}

                  {/* Reps (non-timed) */}
                  {type !== 'timed' && (
                    <div>
                      <label className="font-mono text-micro text-muted block mb-1 uppercase tracking-tighter">REPS</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={set.reps}
                        onChange={(e) => updateSet(i, 'reps', e.target.value)}
                        className="input-field py-3 text-base sm:text-sm text-center"
                        min={0}
                      />
                    </div>
                  )}

                  {/* Weight (weighted / weighted_bodyweight) */}
                  {(type === 'weighted' || type === 'weighted_bodyweight') && (
                    <div>
                      <label className="font-mono text-micro text-muted block mb-1 uppercase tracking-tighter">
                        {type === 'weighted_bodyweight' ? '+KG' : 'KG'}
                      </label>
                      <input
                        type="number"
                        placeholder={type === 'weighted_bodyweight' ? 'BW' : '0'}
                        value={set.weight_kg}
                        onChange={(e) => updateSet(i, 'weight_kg', e.target.value)}
                        className="input-field py-3 text-base sm:text-sm text-center"
                        min={0}
                        step={0.5}
                      />
                    </div>
                  )}

                  {/* Assist KG (assisted) */}
                  {type === 'assisted' && (
                    <div>
                      <label className="font-mono text-micro text-assisted block mb-1 uppercase tracking-tighter">
                        ASSIST KG
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={set.weight_kg}
                        onChange={(e) => updateSet(i, 'weight_kg', e.target.value)}
                        className="input-field py-3 text-base sm:text-sm text-center border-assisted/40 focus:border-assisted"
                        min={0}
                        step={0.5}
                      />
                    </div>
                  )}

                  {/* Rest time */}
                  <div>
                    <label className="font-mono text-micro text-muted block mb-1 uppercase tracking-tighter">REST</label>
                    <select
                      value={set.rest_seconds}
                      onChange={(e) => updateSet(i, 'rest_seconds', Number(e.target.value))}
                      className="input-field py-3 text-base sm:text-sm appearance-none text-center bg-transparent"
                    >
                      <option value={0}>NONE</option>
                      {REST_PRESETS.map((r) => (
                        <option key={r} value={r}>{r}S</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Remove set (Desktop) */}
                <button
                  onClick={() => removeSet(i)}
                  className="hidden sm:flex text-muted hover:text-error transition-colors p-2 mb-1 rounded-full hover:bg-error/10"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Exercise Notes & Add Set */}
          <div className="space-y-4 pt-2 border-t border-border/30 mt-2">
            <div className="relative">
              <div className="flex items-center gap-2 mb-2 px-1">
                <FileText size={12} className="text-muted" />
                <label className="font-mono text-micro text-muted uppercase tracking-widest">EXERCISE NOTES</label>
              </div>
              <textarea
                placeholder="How did this exercise feel? Any technique cues?"
                value={notes}
                onChange={(e) => updateExerciseNotes(e.target.value)}
                className="input-field min-h-[80px] py-3 text-xs bg-surface/20"
              />
            </div>

            <button
              onClick={addSet}
              className="w-full h-12 flex items-center justify-center gap-3 border border-dashed border-border/60 hover:border-accent/40 hover:bg-accent/5 rounded-lg active:scale-95 transition-all text-micro text-muted hover:text-accent font-black italic uppercase tracking-widest"
            >
              <Plus size={16} />
              ADD SET
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

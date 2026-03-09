'use client';
import { useState, useMemo, useEffect } from 'react';
import { Exercise, MuscleGroup, MUSCLE_GROUPS, MUSCLE_COLORS } from '@/types';
import { Search, Plus, X, Check } from 'lucide-react';

interface Props {
  exercises: Exercise[];
  onAdd: (ex: Exercise) => void;
  onClose: () => void;
}

export default function ExercisePicker({ exercises, onAdd, onClose }: Props) {
  const [search, setSearch] = useState('');
  const [muscle, setMuscle] = useState<MuscleGroup | 'All'>('All');
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    if (addedId) {
      const timer = setTimeout(() => setAddedId(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [addedId]);

  const filtered = useMemo(() => {
    return exercises.filter((e) => {
      const matchMuscle = muscle === 'All' || e.muscle_group === muscle;
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
      return matchMuscle && matchSearch;
    });
  }, [exercises, muscle, search]);

  const grouped = useMemo(() => {
    const map: Partial<Record<MuscleGroup, Exercise[]>> = {};
    for (const ex of filtered) {
      if (!map[ex.muscle_group]) map[ex.muscle_group] = [];
      map[ex.muscle_group]!.push(ex);
    }
    return map;
  }, [filtered]);

  const handleAdd = (ex: Exercise) => {
    onAdd(ex);
    setAddedId(ex.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display tracking-widest text-lg">SELECT EXERCISE</h2>
          <button onClick={onClose} className="text-muted hover:text-text transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field !pl-10"
            />
          </div>

          {/* Muscle filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setMuscle('All')}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${muscle === 'All' ? 'bg-accent text-white' : 'bg-card text-muted hover:text-text'
                }`}
            >
              ALL
            </button>
            {MUSCLE_GROUPS.map((m) => (
              <button
                key={m}
                onClick={() => setMuscle(m)}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${muscle === m ? 'text-bg' : 'bg-card text-muted hover:text-text'
                  }`}
                style={muscle === m ? { backgroundColor: MUSCLE_COLORS[m] } : {}}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise list */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {Object.entries(grouped).map(([group, exList]) => (
            <div key={group}>
              <p className="font-display tracking-widest text-xs mb-2" style={{ color: MUSCLE_COLORS[group as MuscleGroup] }}>
                {group.toUpperCase()}
              </p>
              <div className="space-y-1">
                {exList!.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => handleAdd(ex)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded border border-border hover:border-accent/50 hover:bg-card/80 transition-colors text-left"
                  >
                    <div>
                      <span className="font-mono text-sm text-text">{ex.name}</span>
                      <span className="font-mono text-xs text-muted ml-2">
                        {ex.sub_category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted opacity-60">
                        {ex.exercise_type === 'weighted' && 'WEIGHT'}
                        {ex.exercise_type === 'timed' && 'TIME'}
                        {ex.exercise_type === 'bodyweight_variable' && 'BW'}
                        {ex.exercise_type === 'weighted_bodyweight' && 'BW+W'}
                        {ex.exercise_type === 'assisted' && 'ASSISTED'}
                      </span>
                      {addedId === ex.id ? (
                        <span className="text-accent text-xs font-mono animate-pulse flex items-center gap-1">
                          <Check size={12} />
                          ADDED!
                        </span>
                      ) : (
                        <Plus size={14} className="text-muted" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

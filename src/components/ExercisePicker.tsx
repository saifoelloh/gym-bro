import { useState, useMemo, useEffect } from 'react';
import { Exercise, MuscleGroup, MUSCLE_COLORS, MUSCLE_GROUPS } from '@/types';
import { Search, Plus, X, Check, Dumbbell, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

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
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.sub_category?.toLowerCase().includes(search.toLowerCase());
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
    <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex flex-col sm:items-center sm:justify-center animate-in fade-in duration-300">
      <div className="bg-gray-950 border-t sm:border border-gray-800 sm:rounded-2xl w-full max-w-xl h-[95vh] sm:h-auto sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative transition-all">

        {/* Header */}
        <div className="sticky top-0 z-10 p-4 sm:p-5 border-b border-gray-800 bg-gray-950/90 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight leading-none uppercase">Exercises</h2>
              <p className="text-[10px] text-gray-500 font-mono tracking-widest mt-1 uppercase">Select to add to plan</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Search movements or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/40 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-gray-600"
              />
            </div>

            {/* Muscle Filter Pills */}
            <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-hide -mx-1 px-1">
              <button
                onClick={() => setMuscle('All')}
                className={`py-1.5 px-4 rounded-full text-[10px] font-bold tracking-widest transition-all whitespace-nowrap border ${muscle === 'All'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-gray-900 border-gray-800 text-gray-500 hover:text-white hover:border-gray-700'
                  }`}
              >
                ALL
              </button>
              {MUSCLE_GROUPS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMuscle(m)}
                  className={`py-1.5 px-4 rounded-full text-[10px] font-bold tracking-widest transition-all whitespace-nowrap border ${muscle === m
                      ? 'text-white'
                      : 'bg-gray-900 border-gray-800 text-gray-500 hover:text-white hover:border-gray-700'
                    }`}
                  style={muscle === m ? { backgroundColor: MUSCLE_COLORS[m], borderColor: MUSCLE_COLORS[m] } : {}}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-10 scrollbar-hide">
          {Object.entries(grouped).length === 0 ? (
            <div className="py-20 text-center">
              <Dumbbell size={40} className="mx-auto text-gray-800 mb-4 animate-bounce" />
              <p className="text-gray-500 text-sm">No exercises match your search.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([group, exList], groupIdx) => (
              <div key={group} className="animate-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${groupIdx * 100}ms` }}>
                <div className="flex items-center gap-3 mb-3 pl-1">
                  <div className="h-4 w-1 rounded-full" style={{ backgroundColor: MUSCLE_COLORS[group as MuscleGroup] }}></div>
                  <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase italic">{group}</h3>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {exList!.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => handleAdd(ex)}
                      className={`group relative flex items-center justify-between p-3.5 rounded-xl border border-gray-900 bg-gray-900/40 hover:bg-blue-600/10 hover:border-blue-500/30 transition-all text-left overflow-hidden ${addedId === ex.id ? 'border-blue-500 bg-blue-600/20' : ''
                        }`}
                    >
                      <div className="min-w-0 pr-10">
                        <p className="text-sm font-bold text-white group-hover:text-blue-100 transition-colors uppercase tracking-tight">{ex.name}</p>
                        <p className="text-[10px] font-medium text-gray-600 group-hover:text-blue-300/60 transition-colors mt-0.5 uppercase tracking-wide italic">{ex.sub_category || 'General'}</p>
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-3">
                        <span className="text-[9px] font-mono text-gray-500 opacity-60 uppercase tracking-tighter">
                          {ex.exercise_type}
                        </span>

                        {addedId === ex.id ? (
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white scale-110 animate-in zoom-in duration-200">
                            <Check size={16} strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-600 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all">
                            <Plus size={16} />
                          </div>
                        )}
                      </div>

                      {/* Highlight Bar */}
                      {addedId === ex.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

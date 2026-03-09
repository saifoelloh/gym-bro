'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Workout, MUSCLE_COLORS, MuscleGroup } from '@/types';
import { format } from 'date-fns';
import { Download, FileJson, FileText, Trash2, ChevronDown, ChevronUp, AlertCircle, Clock, Trophy, ChevronRight } from 'lucide-react';
import { exportToJSON, exportToMarkdown, downloadFile } from '@/lib/export';

export default function HistoryPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  async function fetchWorkouts() {
    setLoading(true);
    const { data } = await supabase
      .from('workouts')
      .select(`
        *,
        workout_exercises (
          *,
          exercise:exercises(*),
          sets(*)
        )
      `)
      .order('date', { ascending: false });

    if (data) {
      const sorted = data.map((w: Workout) => ({
        ...w,
        workout_exercises: w.workout_exercises?.map((we) => ({
          ...we,
          sets: [...(we.sets ?? [])].sort((a, b) => a.set_number - b.set_number),
        })).sort((a, b) => a.exercise_order - b.exercise_order),
      }));
      setWorkouts(sorted as Workout[]);
    }
    setLoading(false);
  }

  const toggleSelect = (id: string) => {
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const selectAll = () => {
    setSelected(selected.size === workouts.length
      ? new Set()
      : new Set(workouts.map((w) => w.id))
    );
  };

  const exportTarget = workouts.filter((w) => selected.size === 0 || selected.has(w.id));

  const handleExportJSON = () => {
    downloadFile(exportToJSON(exportTarget), `gym_log_${format(new Date(), 'yyyyMMdd')}.json`, 'application/json');
  };

  const handleExportMD = () => {
    downloadFile(exportToMarkdown(exportTarget), `gym_log_${format(new Date(), 'yyyyMMdd')}.md`, 'text/markdown');
  };

  const confirmDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const processDelete = async () => {
    if (!deleteConfirmId) return;
    await supabase.from('workouts').delete().eq('id', deleteConfirmId);
    setWorkouts((w) => w.filter((x) => x.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="font-mono text-sm text-muted animate-pulse uppercase tracking-[0.2em]">SYNCHRONIZING HISTORY...</span>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 sm:pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 fade-up fade-up-1">
        <div>
          <h1 className="font-display text-4xl tracking-widest uppercase mb-1">HISTORY</h1>
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest">{workouts.length} total sessions recorded</p>
        </div>

        {/* Export Controls */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-muted mr-1">
            {selected.size > 0 ? `${selected.size} SEL` : 'ALL'}
          </span>
          <button onClick={handleExportJSON} className="btn-ghost flex items-center gap-2 text-[10px] font-mono px-3 py-2 border-border/40" title="Export JSON">
            <FileJson size={14} className="text-gold" />
            <span className="hidden sm:inline uppercase">JSON</span>
          </button>
          <button onClick={handleExportMD} className="btn-ghost flex items-center gap-2 text-[10px] font-mono px-3 py-2 border-border/40" title="Export MD">
            <FileText size={14} className="text-gold" />
            <span className="hidden sm:inline uppercase">MARKDOWN</span>
          </button>
        </div>
      </div>

      {/* Select All */}
      {workouts.length > 0 && (
        <button onClick={selectAll} className="font-mono text-[10px] text-muted hover:text-accent transition-colors uppercase tracking-[0.2em] px-1">
          {selected.size === workouts.length ? '↩ DESELECT ALL' : '↗ SELECT ALL FOR EXPORT'}
        </button>
      )}

      {/* Workout List */}
      {workouts.length === 0 ? (
        <div className="card p-12 text-center bg-surface/20 border-dashed">
          <p className="font-mono text-xs text-muted uppercase tracking-widest">No sessions yet. Lock in your first grind.</p>
        </div>
      ) : (
        <div className="space-y-4 fade-up fade-up-2">
          {workouts.map((w) => (
            <div
              key={w.id}
              className={`card overflow-hidden transition-all duration-300 ${selected.has(w.id) ? 'border-accent/40 bg-accent/[0.03]' : 'bg-surface/30'} ${expanded === w.id ? 'ring-1 ring-border shadow-2xl' : ''}`}
            >
              {/* Workout Header */}
              <div className="flex items-stretch">
                {/* Selection Area */}
                <div
                  className="flex items-center px-4 cursor-pointer hover:bg-accent/5 transition-colors border-r border-border/20"
                  onClick={(e) => { e.stopPropagation(); toggleSelect(w.id); }}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selected.has(w.id) ? 'bg-accent border-accent' : 'border-border/60'}`}>
                    {selected.has(w.id) && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
                  </div>
                </div>

                <div
                  className="flex-1 cursor-pointer select-none p-4 sm:p-5"
                  onClick={() => setExpanded(expanded === w.id ? null : w.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display tracking-widest text-base sm:text-lg leading-tight uppercase">{w.name}</h3>
                        {expanded !== w.id && <ChevronRight size={14} className="text-muted/40" />}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-muted" />
                          <span className="font-mono text-[10px] text-muted uppercase">
                            {format(new Date(w.date), 'dd MMM yyyy')}
                          </span>
                        </div>
                        {w.duration_minutes && (
                          <span className="font-mono text-[10px] text-muted uppercase">· {w.duration_minutes} MIN</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {w.rpe && (
                        <div className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Trophy size={14} className="text-accent" />
                            <span className="font-display text-2xl text-accent">{w.rpe}</span>
                          </div>
                          <p className="font-mono text-[8px] text-muted uppercase tracking-[0.2em]">INTENSITY</p>
                        </div>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); confirmDelete(w.id); }}
                        className="text-muted hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Muscle tags */}
                  <div className="flex gap-1.5 mt-4 flex-wrap">
                    {[...Array.from(new Set(w.workout_exercises?.map((we) => we.exercise?.muscle_group).filter(Boolean)))].map((mg) => (
                      <span
                        key={mg}
                        className="font-mono text-[9px] px-2 py-0.5 rounded shadow-sm border border-border/20 uppercase"
                        style={{ backgroundColor: `${MUSCLE_COLORS[mg as MuscleGroup]}15`, color: MUSCLE_COLORS[mg as MuscleGroup] }}
                      >
                        {mg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expanded Detail */}
              {expanded === w.id && (
                <div className="border-t border-border/40 bg-surface/10 px-4 pb-6 pt-5 animate-in slide-in-from-top duration-300">
                  {w.notes && (
                    <div className="mb-6 p-4 rounded-lg bg-card/40 border border-border/30 relative">
                      <div className="absolute -top-2 left-3 bg-primary px-2 font-mono text-[9px] text-muted uppercase">SESSION NOTES</div>
                      <p className="font-mono text-xs text-subtle leading-relaxed italic">{w.notes}</p>
                    </div>
                  )}

                  <div className="space-y-6">
                    {w.workout_exercises?.map((we, idx) => (
                      <div key={we.id} className="relative pl-4 border-l-2" style={{ borderColor: `${MUSCLE_COLORS[we.exercise?.muscle_group as MuscleGroup]}40` }}>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-mono text-[10px] text-muted">{idx + 1}</span>
                          <h4 className="font-display tracking-widest text-sm uppercase">{we.exercise?.name}</h4>
                        </div>

                        <div className="space-y-2 ml-1">
                          {we.sets.map((s) => (
                            <div key={s.id} className="flex items-center gap-3 bg-surface/40 p-2.5 rounded border border-border/20 group hover:border-accent/30 transition-colors">
                              <span className="font-mono text-[10px] text-muted w-8 uppercase">S{s.set_number}</span>
                              <div className="flex gap-4 flex-1">
                                {we.exercise?.exercise_type === 'timed' ? (
                                  <span className="font-mono text-xs text-text">{s.duration_seconds}s</span>
                                ) : (
                                  <>
                                    {s.weight_kg && <span className="font-mono text-xs text-accent">{s.weight_kg}kg</span>}
                                    {s.reps && <span className="font-mono text-xs text-text">× {s.reps} reps</span>}
                                  </>
                                )}
                              </div>
                              {s.rest_seconds && (
                                <span className="font-mono text-[9px] text-muted uppercase tracking-tighter sm:tracking-normal">
                                  REST: {s.rest_seconds}S
                                </span>
                              )}
                            </div>
                          ))}
                          {we.notes && (
                            <div className="ml-2 mt-2 flex items-start gap-2 opacity-80">
                              <div className="w-1 h-1 rounded-full bg-border mt-1.5" />
                              <p className="font-mono text-[10px] text-muted italic leading-relaxed">{we.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="card w-full max-w-sm p-6 space-y-6 shadow-2xl border-red-900/30 scale-in duration-200">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-2">
                <AlertCircle size={24} />
              </div>
              <h1 className="font-display tracking-[0.2em] text-lg uppercase font-bold text-red-400">DELETE SESSION?</h1>
              <p className="font-mono text-xs text-muted leading-relaxed uppercase tracking-wider opacity-80">
                This physical record will be purged permanently. Are you sure?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-ghost py-3 font-display tracking-widest text-[10px] uppercase border-border/40"
              >
                CANCEL
              </button>
              <button
                onClick={processDelete}
                className="bg-red-500 hover:bg-red-600 text-white py-3 rounded font-display tracking-widest text-[10px] uppercase transition-colors shadow-lg shadow-red-500/20"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

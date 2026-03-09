'use client';
import { useEffect, useState } from 'react';
import { WorkoutTemplate, MUSCLE_COLORS, MuscleGroup } from '@/types';
import { supabase } from '@/lib/supabase';
import TemplateEditor from '@/components/TemplateEditor';
import Link from 'next/link';
import { Plus, Copy, Pencil, Trash2, Play, Dumbbell, ChevronDown, ChevronUp, AlertCircle, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editTarget, setEditTarget] = useState<WorkoutTemplate | null>(null);
  const [expandedTemplates, setExpandedTemplates] = useState<Set<string>>(new Set());
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  useEffect(() => { fetchTemplates(); }, []);

  async function fetchTemplates() {
    setLoading(true);
    const { data } = await supabase
      .from('workout_templates')
      .select('*, template_exercises(*, exercise:exercises(*))')
      .order('updated_at', { ascending: false });

    if (data) {
      setTemplates(
        data.map((t: WorkoutTemplate) => ({
          ...t,
          template_exercises: [...(t.template_exercises ?? [])].sort(
            (a, b) => a.exercise_order - b.exercise_order
          ),
        }))
      );
    }
    setLoading(false);
  }

  const openCreate = () => { setEditTarget(null); setShowEditor(true); };
  const openEdit = (t: WorkoutTemplate) => { setEditTarget(t); setShowEditor(true); setOpenActionMenuId(null); };

  const handleSaved = (saved: WorkoutTemplate) => {
    setTemplates((prev) => {
      const exists = prev.find((t) => t.id === saved.id);
      return exists
        ? prev.map((t) => (t.id === saved.id ? saved : t))
        : [saved, ...prev];
    });
    setShowEditor(false);
  };

  const duplicate = async (t: WorkoutTemplate) => {
    setOpenActionMenuId(null);
    const { data: newT } = await supabase
      .from('workout_templates')
      .insert({ name: `${t.name} (Copy)`, description: t.description })
      .select()
      .single();

    if (newT && t.template_exercises?.length) {
      await supabase.from('template_exercises').insert(
        t.template_exercises.map((te) => ({
          template_id: newT.id,
          exercise_id: te.exercise_id,
          exercise_order: te.exercise_order,
          target_sets: te.target_sets,
          notes: te.notes,
        }))
      );
    }
    fetchTemplates();
  };

  const confirmDelete = (id: string) => {
    setDeleteConfirmId(id);
    setOpenActionMenuId(null);
  };

  const processDelete = async () => {
    if (!deleteConfirmId) return;
    await supabase.from('workout_templates').delete().eq('id', deleteConfirmId);
    setTemplates((prev) => prev.filter((t) => t.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedTemplates((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleActionMenu = (id: string) => {
    setOpenActionMenuId(openActionMenuId === id ? null : id);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="font-mono text-sm text-muted animate-pulse">LOADING...</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 fade-up fade-up-1">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl tracking-widest uppercase">TEMPLATES</h1>
          <p className="font-mono text-xs text-muted mt-1 uppercase">
            {templates.length} saved program{templates.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
          <Plus size={16} />
          NEW TEMPLATE
        </button>
      </div>

      {/* Template Cards */}
      <div className="space-y-4 fade-up fade-up-2 pb-10">
        {templates.map((t) => {
          const muscleGroups = [
            ...new Set(
              t.template_exercises?.map((te) => te.exercise?.muscle_group).filter(Boolean)
            ),
          ] as MuscleGroup[];

          const totalSets = t.template_exercises?.reduce(
            (acc, te) => acc + te.target_sets, 0
          ) ?? 0;

          const allExercises = t.template_exercises ?? [];
          const isExpanded = expandedTemplates.has(t.id);
          const visibleExercises = isExpanded ? allExercises : allExercises.slice(0, 3);
          const hasMore = allExercises.length > 3;

          return (
            <div key={t.id} className="card p-4 sm:p-5 hover:border-border/80 transition-colors relative group">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
                <div className="flex-1 min-w-0">
                  {/* Name + meta */}
                  <h3 className="font-display tracking-wider text-lg leading-tight uppercase">{t.name}</h3>
                  {t.description && (
                    <p className="font-mono text-[11px] text-muted mt-0.5">{t.description}</p>
                  )}

                  {/* Stats row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
                    <span className="font-mono text-[10px] text-subtle tracking-tighter sm:tracking-normal">
                      {allExercises.length} EXERCISES
                    </span>
                    <span className="font-mono text-[10px] text-subtle tracking-tighter sm:tracking-normal">
                      ~{totalSets} TOTAL SETS
                    </span>
                    <span className="font-mono text-[10px] text-muted tracking-tighter sm:tracking-normal">
                      {format(new Date(t.updated_at), 'dd MMM yyyy')}
                    </span>
                  </div>

                  {/* Muscle tags */}
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {muscleGroups.map((mg) => (
                      <span
                        key={mg}
                        className="font-mono text-[9px] px-1.5 py-0.5 rounded uppercase"
                        style={{
                          backgroundColor: `${MUSCLE_COLORS[mg]}20`,
                          color: MUSCLE_COLORS[mg],
                        }}
                      >
                        {mg}
                      </span>
                    ))}
                  </div>

                  {/* Exercise list preview */}
                  <div className="mt-4 space-y-1.5 sm:space-y-1 border-t border-border/40 pt-3">
                    {visibleExercises.map((te) => (
                      <div key={te.id} className="flex items-center gap-2">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: MUSCLE_COLORS[te.exercise?.muscle_group as MuscleGroup] }}
                        />
                        <span className="font-mono text-[11px] text-subtle truncate max-w-[150px] sm:max-w-none">
                          {te.exercise?.name}
                        </span>
                        <span className="font-mono text-[10px] text-muted flex-shrink-0 ml-auto sm:ml-0">
                          × {te.target_sets} sets
                        </span>
                      </div>
                    ))}

                    {hasMore && (
                      <button
                        onClick={() => toggleExpand(t.id)}
                        className="flex items-center gap-1 font-mono text-[10px] text-accent mt-2 hover:underline tracking-widest uppercase"
                      >
                        {isExpanded ? (
                          <>SHOW LESS <ChevronUp size={12} /></>
                        ) : (
                          <>SHOW {allExercises.length - 3} MORE <ChevronDown size={12} /></>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex flex-col gap-2 mt-2 sm:mt-0 flex-shrink-0 min-w-0 sm:w-28">
                  <Link
                    href={`/log?template=${t.id}`}
                    className="btn-primary flex items-center justify-center gap-2 text-xs py-3 sm:py-2.5 shadow-lg shadow-accent/10"
                  >
                    <Play size={14} className="fill-current" />
                    START
                  </Link>

                  {/* Secondary Actions Row for Mobile Cleanup */}
                  <div className="grid grid-cols-3 sm:flex sm:flex-col gap-2">
                    <button
                      onClick={() => openEdit(t)}
                      className="btn-ghost flex items-center justify-center p-2.5 sm:py-2 sm:px-3 text-[10px] font-mono uppercase tracking-tighter sm:tracking-normal"
                      title="Edit"
                    >
                      <Pencil size={12} className="sm:mr-1.5" />
                      <span className="hidden sm:inline">EDIT</span>
                    </button>
                    <button
                      onClick={() => duplicate(t)}
                      className="btn-ghost flex items-center justify-center p-2.5 sm:py-2 sm:px-3 text-[10px] font-mono uppercase tracking-tighter sm:tracking-normal"
                      title="Copy"
                    >
                      <Copy size={12} className="sm:mr-1.5" />
                      <span className="hidden sm:inline">COPY</span>
                    </button>
                    <button
                      onClick={() => confirmDelete(t.id)}
                      className="btn-ghost !text-red-400 !border-red-900/20 hover:!border-red-500/40 hover:!bg-red-500/5 flex items-center justify-center p-2.5 sm:py-2 sm:px-3 text-[10px] font-mono uppercase tracking-tighter sm:tracking-normal"
                      title="Delete"
                    >
                      <Trash2 size={12} className="sm:mr-1.5" />
                      <span className="hidden sm:inline">DELETE</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="card w-full max-w-sm p-6 space-y-6 shadow-2xl border-red-900/30 scale-in duration-200">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-2">
                <AlertCircle size={24} />
              </div>
              <h3 className="font-display tracking-widest text-lg uppercase">DELETE TEMPLATE?</h3>
              <p className="font-mono text-xs text-muted leading-relaxed">
                This action cannot be undone. All exercises within this template will be removed.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-ghost py-3 font-display tracking-widest text-xs uppercase"
              >
                CANCEL
              </button>
              <button
                onClick={processDelete}
                className="bg-red-500 hover:bg-red-600 text-white py-3 rounded font-display tracking-widest text-xs uppercase transition-colors"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditor && (
        <TemplateEditor
          template={editTarget}
          onSaved={handleSaved}
          onCancel={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}

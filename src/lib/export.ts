import { Workout, ExerciseType } from '@/types';
import { format } from 'date-fns';

// ================================================
// JSON Export — full structured data for AI parsing
// ================================================
export function exportToJSON(workouts: Workout[]): string {
  const payload = {
    exported_at: new Date().toISOString(),
    total_sessions: workouts.length,
    workouts: workouts.map((w) => ({
      id: w.id,
      name: w.name,
      date: w.date,
      duration_minutes: w.duration_minutes,
      rpe: w.rpe,
      notes: w.notes,
      exercises: (w.workout_exercises ?? []).map((we) => ({
        name: we.exercise?.name,
        muscle_group: we.exercise?.muscle_group,
        sub_category: we.exercise?.sub_category,
        exercise_type: we.exercise?.exercise_type,
        notes: we.notes,
        sets: we.sets.map((s) => ({
          set: s.set_number,
          reps: s.reps ?? null,
          weight_kg: s.weight_kg ?? null,
          duration_seconds: s.duration_seconds ?? null,
          rest_seconds: s.rest_seconds ?? null,
          notes: s.notes ?? null,
        })),
      })),
    })),
  };
  return JSON.stringify(payload, null, 2);
}

// ================================================
// Markdown Export — human + AI readable summary
// ================================================
function formatSet(set: Workout['workout_exercises'][0]['sets'][0], type: ExerciseType): string {
  const parts: string[] = [`Set ${set.set_number}:`];

  if (type === 'timed') {
    parts.push(`${set.duration_seconds}s`);
  } else if (type === 'weighted') {
    parts.push(`${set.weight_kg}kg × ${set.reps} reps`);
  } else if (type === 'bodyweight_variable') {
    parts.push(`${set.reps} reps (BW)`);
  } else if (type === 'weighted_bodyweight') {
    const w = set.weight_kg ? `+${set.weight_kg}kg` : 'BW';
    parts.push(`${w} × ${set.reps} reps`);
  }

  if (set.rest_seconds) parts.push(`| rest ${set.rest_seconds}s`);
  if (set.notes) parts.push(`| "${set.notes}"`);
  return parts.join(' ');
}

export function exportToMarkdown(workouts: Workout[]): string {
  const lines: string[] = [
    '# 🏋️ Gym Progress Report',
    `> Exported: ${format(new Date(), 'PPP')} | Total sessions: ${workouts.length}`,
    '',
  ];

  for (const w of workouts) {
    lines.push(`---`);
    lines.push(`## ${format(new Date(w.date), 'EEEE, dd MMMM yyyy')} — ${w.name}`);

    const meta: string[] = [];
    if (w.duration_minutes) meta.push(`⏱ ${w.duration_minutes} min`);
    if (w.rpe) meta.push(`💪 RPE ${w.rpe}/10`);
    if (meta.length) lines.push(meta.join(' | '));
    if (w.notes) lines.push(`> ${w.notes}`);
    lines.push('');

    for (const we of w.workout_exercises ?? []) {
      lines.push(`### ${we.exercise?.name} _(${we.exercise?.muscle_group} · ${we.exercise?.sub_category})_`);
      if (we.notes) lines.push(`> ${we.notes}`);

      for (const s of we.sets) {
        lines.push(`- ${formatSet(s, we.exercise?.exercise_type as ExerciseType)}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

// ================================================
// Download helpers
// ================================================
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

'use client';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Exercise, MUSCLE_COLORS, MuscleGroup } from '@/types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { format } from 'date-fns';
import { TrendingUp, BarChart3, Activity, ChevronDown, Award } from 'lucide-react';

interface VolumePoint { date: string; volume: number; }
interface ExercisePoint { date: string; max_weight: number; max_reps: number; }

export default function ProgressPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedEx, setSelectedEx] = useState<string>('');
  const [exHistory, setExHistory] = useState<ExercisePoint[]>([]);
  const [volumeData, setVolumeData] = useState<VolumePoint[]>([]);
  const [muscleVolume, setMuscleVolume] = useState<{ muscle: string; sets: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Load exercises for selector
    supabase.from('exercises').select('id,name,muscle_group,exercise_type')
      .in('exercise_type', ['weighted', 'weighted_bodyweight', 'bodyweight_variable', 'assisted'])
      .order('name')
      .then(({ data }) => {
        if (data) setExercises(data as Exercise[]);
        if (data?.[0]) setSelectedEx(data[0].id);
      });

    // Weekly volume (sets count per date)
    supabase
      .from('workouts')
      .select('date, workout_exercises(sets(id))')
      .order('date', { ascending: true })
      .limit(30)
      .then(({ data }) => {
        if (data) {
          const points: VolumePoint[] = data.map((w: any) => ({
            date: format(new Date(w.date), 'dd/MM'),
            volume: w.workout_exercises?.reduce(
              (acc: number, we: any) => acc + (we.sets?.length ?? 0), 0
            ) ?? 0,
          }));
          setVolumeData(points);
        }
      });

    // Muscle group distribution (last 30 sessions)
    supabase
      .from('workout_exercises')
      .select('exercise:exercises(muscle_group), sets(id)')
      .limit(500)
      .then(({ data }) => {
        if (data) {
          const counts: Record<string, number> = {};
          for (const we of data as any[]) {
            const mg = we.exercise?.muscle_group ?? 'Other';
            counts[mg] = (counts[mg] ?? 0) + (we.sets?.length ?? 0);
          }
          setMuscleVolume(
            Object.entries(counts).map(([muscle, sets]) => ({ muscle, sets }))
              .sort((a, b) => b.sets - a.sets)
          );
          setLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedEx) return;
    supabase
      .from('workout_exercises')
      .select('workout:workouts(date), sets(reps, weight_kg)')
      .eq('exercise_id', selectedEx)
      .order('workout(date)', { ascending: true })
      .limit(30)
      .then(({ data }) => {
        if (data) {
          const points: ExercisePoint[] = (data as any[]).map((we) => {
            const sets = we.sets ?? [];
            const maxWeight = Math.max(0, ...sets.map((s: any) => Number(s.weight_kg ?? 0)));
            const maxReps = Math.max(0, ...sets.map((s: any) => Number(s.reps ?? 0)));
            return {
              date: we.workout?.date ? format(new Date(we.workout.date), 'dd/MM') : '',
              max_weight: maxWeight,
              max_reps: maxReps,
            };
          });
          setExHistory(points);
        }
      });
  }, [selectedEx]);

  const tooltipStyle = {
    backgroundColor: 'rgba(28, 28, 28, 0.95)',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(8px)',
  };

  const chartMargin = { top: 10, right: 10, left: -20, bottom: 0 };

  return (
    <div className="space-y-8 pb-20 sm:pb-10">
      <div className="fade-up fade-up-1">
        <div className="flex items-center gap-2 mb-2">
          <Activity size={14} className="text-accent" />
          <p className="font-mono text-[10px] text-muted tracking-[0.3em] uppercase">Performance Metrics</p>
        </div>
        <h1 className="font-display text-5xl tracking-tighter uppercase font-black">ANALYTICS<br /><span className="text-accent">DASHBOARD.</span></h1>
      </div>

      {/* Volume per session */}
      <div className="card p-6 bg-surface/30 fade-up fade-up-2">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 size={16} className="text-accent" />
          <h2 className="font-display tracking-[0.2em] text-[11px] text-subtle uppercase">WORKLOAD PER SESSION</h2>
        </div>
        {volumeData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-50">
            <BarChart3 size={40} className="text-muted" />
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Awaiting session data...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={volumeData} margin={chartMargin}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#666', fontSize: 9, fontFamily: 'IBM Plex Mono' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#666', fontSize: 9, fontFamily: 'IBM Plex Mono' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                itemStyle={{ fontFamily: 'IBM Plex Mono', fontSize: '10px' }}
                labelStyle={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', fontSize: '11px', marginBottom: '4px', color: '#FF6B35' }}
                cursor={{ fill: 'rgba(255, 107, 53, 0.05)' }}
              />
              <Bar dataKey="volume" fill="#FF6B35" radius={[4, 4, 0, 0]} name="TOTAL SETS" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Muscle Group Distribution */}
        <div className="card p-6 bg-surface/30 fade-up fade-up-3 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <Award size={16} className="text-accent" />
            <h2 className="font-display tracking-[0.2em] text-[11px] text-subtle uppercase">MUSCLE UTILIZATION</h2>
          </div>
          {muscleVolume.length === 0 ? (
            <p className="font-mono text-[10px] text-muted text-center py-12 uppercase tracking-widest">No metrics available</p>
          ) : (
            <div className="space-y-4">
              {muscleVolume.map(({ muscle, sets }) => {
                const max = muscleVolume[0].sets;
                const pct = Math.round((sets / max) * 100);
                const color = MUSCLE_COLORS[muscle as MuscleGroup] ?? '#555';
                return (
                  <div key={muscle} className="space-y-1.5">
                    <div className="flex items-center justify-between px-1">
                      <span className="font-mono text-[10px] text-muted uppercase tracking-wider">{muscle}</span>
                      <span className="font-display text-xs text-text">{sets} <span className="text-[10px] text-muted font-mono ml-0.5">SETS</span></span>
                    </div>
                    <div className="w-full bg-primary/50 h-1.5 rounded-full overflow-hidden border border-white/[0.03]">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Exercise Strength History */}
        <div className="card p-6 bg-surface/30 fade-up fade-up-4">
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-accent" />
              <h2 className="font-display tracking-[0.2em] text-[11px] text-subtle uppercase">STRENGTH TRAJECTORY</h2>
            </div>

            <div className="relative group">
              <select
                value={selectedEx}
                onChange={(e) => setSelectedEx(e.target.value)}
                className="input-field w-full text-xs py-3 pl-4 pr-10 appearance-none bg-surface/50 border-border/40 font-mono"
              >
                {exercises.map((e) => (
                  <option key={e.id} value={e.id}>{e.name.toUpperCase()}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none group-hover:text-accent transition-colors" />
            </div>
          </div>

          {exHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 opacity-30">
              <TrendingUp size={40} className="text-muted" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Insufficient history</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={exHistory} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#666', fontSize: 9, fontFamily: 'IBM Plex Mono' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: '#666', fontSize: 9, fontFamily: 'IBM Plex Mono' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#666', fontSize: 9, fontFamily: 'IBM Plex Mono' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  itemStyle={{ fontFamily: 'IBM Plex Mono', fontSize: '10px' }}
                  labelStyle={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', fontSize: '11px', marginBottom: '4px', color: '#FF6B35' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontFamily: 'IBM Plex Mono', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', paddingTop: '10px' }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="max_weight"
                  stroke="#FF6B35"
                  strokeWidth={3}
                  dot={{ fill: '#FF6B35', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                  name="LOAD (KG)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="max_reps"
                  stroke="#C4A35A"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#C4A35A', r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0, fill: '#fff' }}
                  name="VOLUME (REPS)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

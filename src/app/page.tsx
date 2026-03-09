import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { format, subDays, startOfWeek } from 'date-fns';
import { Dumbbell, TrendingUp, Calendar, Zap, ChevronRight, ArrowUpRight } from 'lucide-react';

async function getStats() {
  const { data: workouts } = await supabase
    .from('workouts')
    .select('id, date, name, rpe, duration_minutes')
    .order('date', { ascending: false })
    .limit(5);

  const { count: totalWorkouts } = await supabase
    .from('workouts')
    .select('id', { count: 'exact', head: true });

  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const { count: thisWeek } = await supabase
    .from('workouts')
    .select('id', { count: 'exact', head: true })
    .gte('date', weekStart);

  const { count: totalSets } = await supabase
    .from('sets')
    .select('id', { count: 'exact', head: true });

  return {
    workouts: workouts ?? [],
    totalWorkouts: totalWorkouts ?? 0,
    thisWeek: thisWeek ?? 0,
    totalSets: totalSets ?? 0,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-8 pb-10">
      {/* Hero */}
      <div className="fade-up fade-up-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <p className="font-mono text-[10px] text-muted tracking-[0.3em] uppercase">
            {format(new Date(), "EEEE, dd MMMM yyyy")}
          </p>
        </div>
        <h1 className="font-display text-5xl sm:text-6xl tracking-tighter text-text leading-[0.9] font-black uppercase">
          ELEVATE<br />
          <span className="text-accent">LIMITS.</span>
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 fade-up fade-up-2">
        {[
          { label: 'TOTAL SESSIONS', value: stats.totalWorkouts, icon: Calendar, color: 'text-text' },
          { label: 'THIS WEEK', value: stats.thisWeek, icon: Zap, color: 'text-accent' },
          { label: 'TOTAL SETS', value: stats.totalSets, icon: TrendingUp, color: 'text-text' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-6 bg-surface/30 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] text-muted tracking-[0.2em]">{label}</span>
              <Icon size={16} className="text-muted group-hover:text-accent transition-colors" />
            </div>
            <span className={`font-display text-5xl ${color} leading-none`}>{value}</span>
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <Icon size={80} />
            </div>
          </div>
        ))}
      </div>

      {/* Dashboard CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 fade-up fade-up-3">
        <Link href="/log" className="btn-primary py-6 rounded-2xl font-display tracking-[0.3em] text-sm flex items-center justify-center gap-3 shadow-xl shadow-accent/20">
          <Dumbbell size={20} />
          START SESSION
        </Link>
        <Link href="/progress" className="btn-ghost py-6 rounded-2xl font-display tracking-[0.3em] text-sm flex items-center justify-center gap-3 bg-surface/40">
          <TrendingUp size={20} />
          VIEW PROGRESS
          <ArrowUpRight size={16} className="text-muted" />
        </Link>
      </div>

      {/* Recent Workouts */}
      <div className="fade-up fade-up-4 pt-4">
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="font-display tracking-[0.2em] text-sm text-subtle uppercase">RECENT ACTIVITY</h2>
          <Link href="/history" className="font-mono text-[10px] text-muted hover:text-accent transition-colors uppercase tracking-widest">View All</Link>
        </div>

        {stats.workouts.length === 0 ? (
          <div className="card p-12 text-center bg-surface/10 border-dashed">
            <p className="text-muted font-mono text-xs uppercase tracking-widest">No sessions logged yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.workouts.map((w, i) => (
              <Link
                key={w.id}
                href={`/history?id=${w.id}`}
                className="card p-5 flex items-center justify-between hover:border-accent/40 transition-all group bg-surface/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface/50 flex items-center justify-center border border-border/40 group-hover:border-accent/30 transition-colors">
                    <Dumbbell size={18} className="text-muted group-hover:text-accent transition-colors" />
                  </div>
                  <div>
                    <p className="font-display tracking-wider text-sm text-text group-hover:text-accent transition-colors uppercase">
                      {w.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-mono text-[10px] text-muted uppercase">
                        {format(new Date(w.date), 'dd MMM yyyy')}
                      </p>
                      {w.duration_minutes && (
                        <span className="font-mono text-[10px] text-muted uppercase tracking-tighter">· {w.duration_minutes}MIN</span>
                      )}
                    </div>
                  </div>
                </div>

                {w.rpe ? (
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5">
                      <span className="font-display text-2xl text-accent">{w.rpe}</span>
                      <ChevronRight size={14} className="text-muted opacity-40 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="font-mono text-[8px] text-muted uppercase tracking-[0.2em]">RPE Intensity</p>
                  </div>
                ) : (
                  <ChevronRight size={18} className="text-muted opacity-40 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { ProgressPoint } from '@/types'

const COLORS = ['#EF4444', '#3B82F6', '#EAB308', '#A855F7', '#F97316', '#22C55E', '#EC4899']

export function MuscleDistributionChart({ data }: { data: ProgressPoint[] }) {
  const counts = data.reduce<Record<string, number>>((acc, d) => {
    acc[d.exercise_name] = (acc[d.exercise_name] ?? 0) + 1; return acc
  }, {})
  const d = Object.entries(counts).map(([name, value]) => ({ name, value }))
  if (!d.length) return <p className="text-center text-muted py-8">No data yet.</p>
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={d} cx="50%" cy="50%" outerRadius={80} dataKey="value">
            {d.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#F9FAFB' }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 10, color: '#9CA3AF', paddingTop: '16px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

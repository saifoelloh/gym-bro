'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { ProgressPoint } from '@/types'

export function StrengthTrendChart({ data }: { data: ProgressPoint[] }) {
  const d = data.filter(x=>x.max_weight_kg).map(x=>({date:x.date.slice(5),weight:x.max_weight_kg}))
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={d}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" tick={{fill:'#9CA3AF',fontSize:11}} />
          <YAxis tick={{fill:'#9CA3AF',fontSize:11}} unit=" kg" />
          <Tooltip contentStyle={{backgroundColor:'#111827',border:'1px solid #374151',color:'#F9FAFB'}}
            formatter={v=>[`${v} kg`,'Max Weight']} />
          <Line type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

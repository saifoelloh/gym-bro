'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Trash2, MoreVertical, Eye, Download } from 'lucide-react'
import { RPE_DATA } from '@/components/log/RPESlider'
import { MUSCLE_COLORS } from '@/types'
import type { Workout, MuscleGroup } from '@/types'

interface Props { workout: Workout; onDelete?: (id: string) => void }

export function WorkoutCard({ workout, onDelete }: Props) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const totalSets = workout.workout_exercises.reduce((acc, we) => acc + (we.sets?.length || 0), 0)

  const groupCounts = workout.workout_exercises.reduce((acc, we) => {
    const group = we.exercises.muscle_group;
    acc[group] = (acc[group] || 0) + (we.sets?.length || 0);
    return acc;
  }, {} as Record<string, number>);

  const primaryGroupStr = Object.keys(groupCounts).length > 0
    ? Object.keys(groupCounts).reduce((a, b) => groupCounts[a] > groupCounts[b] ? a : b)
    : 'Cardio';
  const primaryGroup = primaryGroupStr as MuscleGroup;
  const primaryColor = MUSCLE_COLORS[primaryGroup] || '#3B82F6';

  const dayName = new Date(workout.date).toLocaleDateString('id-ID', { weekday: 'long' });
  const rpeColorInfo = workout.rpe ? RPE_DATA[workout.rpe] : null;

  const MUSCLE_ICONS: Record<string, string> = {
    Chest: '🦍',
    Back: '🦅',
    Shoulders: '🗿',
    Arms: '💪',
    Core: '🔥',
    Legs: '🦵',
    Cardio: '🏃',
  }
  const primaryIcon = rpeColorInfo?.emoji || MUSCLE_ICONS[primaryGroup] || '🏋️';

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    if (showMenu) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu])

  const exportMD = () => {
    const w = workout
    const dateStr = new Date(w.date).toLocaleDateString()
    const rpeInfo = w.rpe ? RPE_DATA[w.rpe] : null
    const rpeStr = w.rpe ? `\n**RPE:** ${w.rpe}/10 ${rpeInfo?.emoji || '💪'}\n` : '\n'

    let lines = [
      `# ${w.name}`,
      `📅 **Date:** ${dateStr}`,
      rpeStr.trim() !== '' ? `${rpeStr}` : '',
      w.notes ? `\n📝 **Notes:**\n${w.notes}\n` : '',
      `---\n`
    ].filter(Boolean)

    for (const we of w.workout_exercises || []) {
      lines.push(`### ${we.exercises?.name || 'Unknown Exercise'}`)

      if (we.notes) {
        lines.push(`*Note: ${we.notes}*\n`)
      }

      if (!we.sets || we.sets.length === 0) {
        lines.push(`- (Skipped / No sets recorded)\n`)
        continue
      }

      we.sets.forEach(set => {
        let details = []
        if (set.weight_kg) details.push(`**${set.weight_kg} kg**`)
        if (set.reps) details.push(`**${set.reps} reps**`)
        if (set.duration_seconds) {
          const mins = Math.floor(set.duration_seconds / 60)
          const secs = String(set.duration_seconds % 60).padStart(2, '0')
          details.push(`**${mins > 0 ? `${mins}m ` : ''}${secs}s**`)
        }

        const setString = details.length > 0 ? details.join(' × ') : '(Empty Set)'
        lines.push(`- Set ${set.set_number}: ${setString}`)

        if (set.notes) {
          lines.push(`  > ${set.notes}`)
        }
      })
      lines.push('') // spacing
    }
    const md = lines.join('\n')

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Gym_Log_${w.name.replace(/\s+/g, '_')}_${new Date().getTime()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="relative group">
      <Card
        className="transition-all relative overflow-visible bg-surface/40 hover:bg-surface border-y border-r border-y-border/50 border-r-border/50 shadow-sm"
        style={{ borderLeftColor: primaryColor, borderLeftWidth: '4px' }}
      >
        <div className="flex items-center p-1 sm:p-2 gap-3 sm:gap-4 transition-opacity opacity-90 group-hover:opacity-100">

          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner shrink-0"
            style={{ backgroundColor: `${primaryColor}1A`, border: `1px solid ${primaryColor}33` }}
          >
            {primaryIcon}
          </div>

          <div className="min-w-0 flex-1 py-1 pr-2">
            <Link href={`/workout/${workout.id}/summary`} className="block group/link">
              <p className="font-black italic text-text text-[17px] sm:text-xl leading-tight truncate mb-1 group-hover/link:text-blue-400 transition-colors">
                {workout.name}
              </p>
            </Link>

            <p className="font-mono text-[10px] sm:text-xs text-muted tracking-wider truncate flex gap-1.5 sm:gap-2 items-center">
              <span className="capitalize">{dayName}</span>
              <span className="opacity-50">•</span>
              <span>{workout.workout_exercises.length} gerakan</span>
              <span className="opacity-50">•</span>
              <span>{totalSets} sets</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {workout.rpe && (
              <div
                className="flex items-center px-2 py-0.5 rounded-full text-[10px] font-black italic tracking-widest hidden sm:flex"
                style={{
                  color: rpeColorInfo?.color,
                  backgroundColor: `${rpeColorInfo?.color}1A`,
                  borderColor: `${rpeColorInfo?.color}33`,
                  borderWidth: '1px'
                }}
              >
                {workout.rpe}/10
              </div>
            )}

            <div className="relative" ref={menuRef}>
              <button
                onClick={e => {
                  e.stopPropagation()
                  setShowMenu(!showMenu)
                }}
                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors border ${showMenu ? 'bg-surface border-border text-text' : 'text-muted hover:text-text hover:bg-surface border-transparent hover:border-border/50'
                  }`}
                title="Options"
              >
                <MoreVertical size={16} />
              </button>

              {showMenu && (
                <div
                  className="absolute top-full right-0 mt-2 w-36 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex flex-col py-1">
                    <Link
                      href={`/workout/${workout.id}/summary`}
                      className="flex items-center px-3 py-2.5 text-xs font-bold text-muted hover:text-text hover:bg-surface-lighter transition-colors w-full text-left"
                    >
                      <Eye size={12} className="mr-2" />
                      View Details
                    </Link>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        setShowMenu(false)
                        exportMD()
                      }}
                      className="flex items-center px-3 py-2.5 text-xs font-bold text-muted hover:text-text hover:bg-surface-lighter transition-colors w-full text-left"
                    >
                      <Download size={12} className="mr-2" />
                      Export
                    </button>
                    {onDelete && (
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          setShowMenu(false)
                          onDelete(workout.id)
                        }}
                        className="flex items-center px-3 py-2.5 text-xs font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full text-left"
                      >
                        <Trash2 size={12} className="mr-2" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

'use client'

import { X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { ExerciseSelector } from '@/components/log/ExerciseSelector'
import type { Exercise } from '@/types'

interface Props {
  exercises: Exercise[]
  onAdd: (ex: Exercise) => void
  onClose: () => void
}

export default function ExercisePicker({ exercises, onAdd, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-md max-h-[80vh] flex flex-col p-0 overflow-hidden shadow-2xl border-border/50">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
          <div>
            <h3 className="text-sm font-black italic uppercase tracking-widest text-foreground">Select Exercise</h3>
            <p className="text-micro text-muted font-bold uppercase tracking-tighter">Add to your template</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface transition-colors"
          >
            <X size={18} className="text-muted" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto">
          <ExerciseSelector 
            exercises={exercises} 
            onSelect={(ex) => {
              onAdd(ex);
              onClose();
            }} 
          />
        </div>
      </Card>
      
      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  )
}

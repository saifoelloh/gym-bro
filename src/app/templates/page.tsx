'use client'
import { useState } from 'react'
import { useTemplates } from '@/hooks/useTemplates'
import { TemplateList } from '@/components/templates/TemplateList'
import TemplateEditor from '@/components/TemplateEditor'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Plus, AlertCircle } from 'lucide-react'

export default function TemplatesPage() {
  const { templates, loading, error, remove, duplicate, refetch } = useTemplates()
  const [showEditor, setShowEditor] = useState(false)
  const [editTarget, setEditTarget] = useState<any>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const openCreate = () => { setEditTarget(null); setShowEditor(true); }
  const openEdit = (t: any) => { setEditTarget(t); setShowEditor(true); }

  const processDelete = async () => {
    if (!deleteConfirmId) return
    await remove(deleteConfirmId)
    setDeleteConfirmId(null)
  }

  if (loading) return <LoadingSpinner label="Loading templates..." />
  if (error) return <p className="text-red-500 p-4">{error}</p>

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Templates</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase">
            {templates.length} saved program{templates.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={openCreate} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-colors">
          <Plus size={16} />
          NEW TEMPLATE
        </button>
      </div>

      <TemplateList
        templates={templates}
        onEdit={openEdit}
        onDuplicate={duplicate}
        onDelete={id => setDeleteConfirmId(id)}
      />

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-sm p-6 rounded-2xl space-y-6 shadow-2xl scale-in duration-200">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-2">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-white uppercase">DELETE TEMPLATE?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                This action cannot be undone. All exercises within this template will be removed.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="py-3 text-xs font-bold text-gray-400 hover:text-white transition-colors">CANCEL</button>
              <button onClick={processDelete} className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold text-xs transition-colors">DELETE</button>
            </div>
          </div>
        </div>
      )}

      {showEditor && (
        <TemplateEditor
          template={editTarget}
          onSaved={() => { setShowEditor(false); refetch(); }}
          onCancel={() => setShowEditor(false)}
        />
      )}
      <div className="h-20 sm:hidden" />
    </main>
  )
}

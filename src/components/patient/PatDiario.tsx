import { useState } from 'react'
import { useActivePatient } from '../../context/PatientContext'
import { useDiary } from '../../hooks/useClinicalData'
import EmptyState from '../layout/EmptyState'

export default function PatDiario() {
  const { patientId } = useActivePatient()
  const { entries, addEntry, toggleShared } = useDiary(patientId || undefined)
  const [content, setContent] = useState('')
  const [shared, setShared] = useState(false)

  async function handleSave() {
    if (!patientId || !content.trim()) return
    await addEntry({ patient_id: patientId, content: content.trim(), date: new Date().toISOString(), shared })
    setContent('')
    setShared(false)
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <h1 className="text-2xl font-extrabold text-fox-dark">Mi diario</h1>

      <div className="card space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe lo que sientes, piensas o necesitas recordar..."
          className="min-h-[100px] w-full resize-none rounded-2xl border-[1.5px] border-[#FDDCCA] bg-cream p-3 text-sm focus:outline-none focus:border-fox"
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={shared} onChange={(e) => setShared(e.target.checked)} className="h-4 w-4 accent-fox" />
            Compartir con mi psicólogo
          </label>
          <button onClick={handleSave} className="btn-primary">Guardar entrada</button>
        </div>
      </div>

      {entries.length === 0 ? (
        <EmptyState message="Tu diario está vacío" submessage="Escribe tu primera entrada arriba" />
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((e) => (
            <div key={e.id} className="card">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{formatDate(e.date)}</span>
                <div className="flex items-center gap-2">
                  {e.shared && <span className="pill bg-mint-light text-emerald-700 text-xs">Compartido</span>}
                  <button
                    onClick={() => toggleShared(e.id, !e.shared)}
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold text-fox hover:bg-fox-light transition"
                  >
                    {e.shared ? 'Ocultar' : 'Compartir'}
                  </button>
                </div>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{e.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

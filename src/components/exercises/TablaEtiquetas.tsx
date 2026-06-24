import { useState } from 'react'
import { useExercises } from '../../hooks/useClinicalData'

interface Thought {
  id: string
  text: string
  reframe?: string
  restructured: boolean
}

export default function TablaEtiquetas({ patientId }: { patientId: string }) {
  const { exercises, upsertExercise } = useExercises(patientId)
  const existing = exercises.find((e) => e.type === 'tabla_etiquetas')
  const [thoughts, setThoughts] = useState<Thought[]>(existing?.data?.pills || [])
  const [input, setInput] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [reframeText, setReframeText] = useState('')

  function saveAll(pills: Thought[]) {
    setThoughts(pills)
    upsertExercise(patientId, 'tabla_etiquetas', { pills }, true)
  }

  function addThought() {
    const t = input.trim()
    if (!t) return
    const newThought: Thought = { id: Date.now().toString(), text: t, restructured: false }
    saveAll([...thoughts, newThought])
    setInput('')
  }

  function startReframe(id: string) {
    const th = thoughts.find((x) => x.id === id)
    setEditingId(id)
    setReframeText(th?.reframe || '')
  }

  function confirmReframe(id: string) {
    const updated = thoughts.map((th) =>
      th.id === id ? { ...th, reframe: reframeText.trim(), restructured: true } : th,
    )
    saveAll(updated)
    setEditingId(null)
    setReframeText('')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="card">
        <h2 className="text-lg font-extrabold text-fox-dark">Tabla de Etiquetas</h2>
        <p className="mt-1 text-xs text-gray-500">Agrega pensamientos automáticos y reformúlalos con compasión.</p>
        <div className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addThought()}
            placeholder="Ej. 'Nunca hago las cosas bien'"
            className="flex-1 rounded-full border-[1.5px] border-[#FDDCCA] bg-cream px-4 py-2 text-sm focus:outline-none focus:border-fox"
          />
          <button onClick={addThought} className="btn-primary">Agregar</button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {thoughts.map((th) => (
          <div
            key={th.id}
            className={`card transition ${th.restructured ? 'border-mint' : 'border-[#FDDCCA]'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <span
                  className={`pill text-xs ${
                    th.restructured
                      ? 'bg-mint-light text-emerald-700'
                      : 'bg-pink/10 text-pink'
                  }`}
                >
                  {th.restructured ? 'Reformulado' : 'Pensamiento'}
                </span>
                <p className={`mt-2 text-sm font-semibold ${th.restructured ? 'text-gray-400 line-through' : 'text-fox-dark'}`}>
                  {th.text}
                </p>
                {th.reframe && (
                  <p className="mt-1 text-sm text-mint-dark font-semibold">{th.reframe}</p>
                )}
              </div>
              {(th.restructured || editingId !== th.id) && (
                <button
                  onClick={() => startReframe(th.id)}
                  className="rounded-full bg-fox-light px-3 py-1 text-xs font-bold text-fox-dark hover:bg-fox hover:text-white transition"
                  title="Cuestionar y reformular"
                >
                  {th.restructured ? 'Editar' : 'Cuestionar'}
                </button>
              )}
            </div>

            {editingId === th.id && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-bold text-gray-500">¿Qué evidencia real tienes? ¿Qué le dirías a un amigo?</p>
                <textarea
                  value={reframeText}
                  onChange={(e) => setReframeText(e.target.value)}
                  placeholder="Reformula este pensamiento con ternura..."
                  className="w-full rounded-xl border-[1.5px] border-[#FDDCCA] bg-cream p-3 text-sm focus:outline-none focus:border-fox"
                />
                <div className="flex gap-2">
                  <button onClick={() => confirmReframe(th.id)} className="btn-primary text-xs">
                    Guardar reformulación
                  </button>
                  <button onClick={() => setEditingId(null)} className="btn-secondary text-xs">
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

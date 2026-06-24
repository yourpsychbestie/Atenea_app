import { useState, useEffect } from 'react'
import { useExercises } from '../../hooks/useClinicalData'

export default function CartaCompasiva({ patientId }: { patientId: string }) {
  const { exercises, upsertExercise } = useExercises(patientId)
  const existing = exercises.find((e) => e.type === 'carta_compasiva')
  const [text, setText] = useState('')
  const [reflection, setReflection] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (existing?.data) {
      setText(existing.data.text || '')
      setReflection(existing.data.reflection || '')
    }
  }, [existing])

  function handleSave() {
    upsertExercise(patientId, 'carta_compasiva', { text, reflection }, true)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="card">
        <h2 className="text-lg font-extrabold text-fox-dark">Carta compasiva a mí mismo/a</h2>
        <p className="mt-1 text-xs text-gray-500">
          Escribe aquí con la misma ternura que usarías con alguien a quien quieres mucho.
        </p>
      </div>

      <div className="card space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Querid@ yo..."
          className="min-h-[200px] w-full resize-none rounded-2xl border-[1.5px] border-[#FDDCCA] bg-cream p-4 text-sm leading-relaxed focus:outline-none focus:border-fox"
        />
        <button onClick={handleSave} className="btn-primary">{saved ? 'Guardado' : 'Guardar carta'}</button>
      </div>

      <div className="card space-y-3">
        <h3 className="text-sm font-extrabold text-fox-dark">Reflexión</h3>
        <p className="text-xs text-gray-500">¿Qué notaste al escribirte con ternura?</p>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Me di cuenta de que..."
          className="min-h-[100px] w-full resize-none rounded-2xl border-[1.5px] border-[#FDDCCA] bg-cream p-3 text-sm focus:outline-none focus:border-fox"
        />
        <button onClick={handleSave} className="btn-secondary text-xs">Guardar reflexión</button>
      </div>
    </div>
  )
}

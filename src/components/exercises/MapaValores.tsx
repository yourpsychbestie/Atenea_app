import { useState } from 'react'
import { useExercises } from '../../hooks/useClinicalData'

const DOMAINS = [
  { name: 'Familia', icon: '👨‍👩‍👧' },
  { name: 'Relaciones', icon: '🤝' },
  { name: 'Salud', icon: '💪' },
  { name: 'Trabajo / Carrera', icon: '💼' },
  { name: 'Ocio / Recreación', icon: '🎨' },
  { name: 'Creatividad', icon: '✨' },
  { name: 'Comunidad', icon: '🌍' },
  { name: 'Espiritualidad', icon: '🧘' },
]

export default function MapaValores({ patientId }: { patientId: string }) {
  const { exercises, upsertExercise } = useExercises(patientId)
  const existing = exercises.find((e) => e.type === 'mapa_valores')
  const [selected, setSelected] = useState<string[]>(existing?.data?.selected || [])

  function toggle(name: string) {
    let next: string[]
    if (selected.includes(name)) {
      next = selected.filter((s) => s !== name)
    } else {
      if (selected.length >= 3) return
      next = [...selected, name]
    }
    setSelected(next)
    upsertExercise(patientId, 'mapa_valores', { selected: next }, true)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="card">
        <h2 className="text-lg font-extrabold text-fox-dark">Mapa de valores ACT</h2>
        <p className="mt-1 text-xs text-gray-500">Elige hasta 3 dominios que más te importan en este momento de tu vida.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {DOMAINS.map((d) => {
          const active = selected.includes(d.name)
          return (
            <button
              key={d.name}
              onClick={() => toggle(d.name)}
              className={`flex flex-col items-center gap-2 rounded-2xl border-[1.5px] p-4 text-center transition ${
                active
                  ? 'border-fox bg-fox-light'
                  : 'border-[#FDDCCA] bg-white opacity-60 hover:opacity-100'
              }`}
            >
              <span className="text-3xl">{d.icon}</span>
              <span className={`text-xs font-bold ${active ? 'text-fox-dark' : 'text-gray-500'}`}>{d.name}</span>
            </button>
          )
        })}
      </div>

      <div className="card">
        <h3 className="text-sm font-extrabold text-fox-dark">Tu Top 3</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {selected.length === 0 && <p className="text-xs text-gray-400">Ninguno seleccionado aún</p>}
          {selected.map((s) => (
            <span key={s} className="pill bg-fox text-white text-sm">{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePatients } from '../../hooks/usePatient'
import EmptyState from '../layout/EmptyState'

const exercises = [
  { key: 'externalizacion', name: 'Externalización', icon: '🎭', desc: 'Crea un personaje que represente un problema y dialoga con él.' },
  { key: 'tabla_etiquetas', name: 'Tabla de Etiquetas', icon: '🏷️', desc: 'Identifica, cuestiona y reformula pensamientos automáticos.' },
  { key: 'respiracion', name: 'Respiración guiada', icon: '🌬️', desc: 'Ejercicio de respiración 4-4-4 con animación visual.' },
  { key: 'carta_compasiva', name: 'Carta compasiva', icon: '💌', desc: 'Escribe una carta amorosa y compasiva hacia ti mismo/a.' },
  { key: 'mapa_valores', name: 'Mapa de valores', icon: '🧭', desc: 'Visualiza y prioriza los dominios importantes en tu vida (ACT).' },
  { key: 'bienvenida_yo', name: 'Bienvenida del Yo', icon: '🪞', desc: 'Un ejercicio de auto-aceptación y acogida personal.' },
]

export default function EjerciciosHub() {
  const navigate = useNavigate()
  const { patients } = usePatients()
  const [selectedPatient, setSelectedPatient] = useState(patients[0]?.id || '')

  function goTo(type: string) {
    const pid = selectedPatient || patients[0]?.id
    if (!pid) return
    navigate(`/psy/ejercicios/${type}/${pid}`)
  }

  if (patients.length === 0) {
    return (
      <div className="mx-auto max-w-5xl space-y-5">
        <h1 className="text-2xl font-extrabold text-fox-dark">Ejercicios</h1>
        <EmptyState
          message="Aun no tienes pacientes"
          submessage="Agrega tu primer paciente para asignar ejercicios"
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-fox-dark">Ejercicios</h1>
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          className="rounded-full border-[1.5px] border-[#FDDCCA] bg-white px-4 py-2 text-sm font-semibold text-fox-dark focus:outline-none"
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.emoji} {p.alias}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {exercises.map((ex) => (
          <div
            key={ex.key}
            onClick={() => goTo(ex.key)}
            className="card cursor-pointer"
          >
            <div className="mb-2 text-3xl">{ex.icon}</div>
            <h3 className="text-base font-extrabold text-fox-dark">{ex.name}</h3>
            <p className="mt-1 text-xs text-gray-500">{ex.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

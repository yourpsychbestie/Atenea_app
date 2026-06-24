import { useState } from 'react'
import confetti from 'canvas-confetti'
import FoxLogo from '../layout/FoxLogo'
import { useExercises } from '../../hooks/useClinicalData'

export default function BienvenidaYo({ patientId }: { patientId: string }) {
  const { upsertExercise } = useExercises(patientId)
  const [started, setStarted] = useState(false)

  function handleStart() {
    setStarted(true)
    confetti({ origin: { y: 1 }, colors: ['#E8733A', '#FDBA74', '#F9A8D4'] })
    upsertExercise(patientId, 'bienvenida_yo', { completed: true }, true)
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 text-center">
      <div className="card flex flex-col items-center gap-4 py-10">
        <FoxLogo size={120} variant="curl" />
        <h2 className="text-2xl font-extrabold text-fox-dark">Bienvenida del Yo</h2>
        <p className="max-w-sm text-sm text-gray-600">
          Este espacio es solo para ti. No tienes que arreglar nada, solo sentir.
          Lo que hoy traigas es bienvenido, sea lo que sea.
        </p>
        <p className="max-w-sm text-sm italic text-lav-dark">
          "Todos los sentimientos son bienvenidos aquí. No necesitan ser perfectos, solo honestos."
        </p>
        <button onClick={handleStart} className="btn-primary mt-2">
          {started ? 'Comenzado' : 'Comenzar'}
        </button>
      </div>
    </div>
  )
}

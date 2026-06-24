import { useEffect, useRef, useState } from 'react'
import { useExercises } from '../../hooks/useClinicalData'

type Phase = 'inhala' | 'mantén' | 'exhala'

const PHASE_DURATIONS: Record<Phase, number> = { inhala: 4, mantén: 4, exhala: 4 }
const PHASE_LABELS: Record<Phase, string> = {
  inhala: 'Inhala...',
  mantén: 'Mantén...',
  exhala: 'Exhala...',
}
const PHASE_ORDER: Phase[] = ['inhala', 'mantén', 'exhala']

interface RespiracionProps {
  patientId: string
}

export default function Respiracion({ patientId }: RespiracionProps) {
  const { exercises, upsertExercise } = useExercises(patientId)
  const existing = exercises.find((e) => e.type === 'respiracion')
  const [running, setRunning] = useState(false)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(PHASE_DURATIONS.inhala)
  const [cycles, setCycles] = useState<number>(existing?.data?.ciclos_completados ?? 0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const phase = PHASE_ORDER[phaseIdx]

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1
        setPhaseIdx((idxPrev) => {
          const nextIdx = (idxPrev + 1) % PHASE_ORDER.length
          if (nextIdx === 0) {
            setCycles((c) => {
              const updated = c + 1
              upsertExercise(patientId, 'respiracion', { ciclos_completados: updated })
              return updated
            })
          }
          setSecondsLeft(PHASE_DURATIONS[PHASE_ORDER[nextIdx]])
          return nextIdx
        })
        return prev
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, patientId, upsertExercise])

  const scale = phase === 'inhala' ? 1.4 : phase === 'mantén' ? 1.4 : 0.8

  return (
    <div className="card flex flex-col items-center gap-6 py-10">
      <h3 className="text-lg font-extrabold text-fox-dark">Respiración guiada 🌬️</h3>
      <p className="text-sm text-gray-500 text-center max-w-sm">
        Sigue el círculo: inhala 4 segundos, mantén 4 segundos, exhala 4 segundos.
      </p>

      <div className="relative flex h-56 w-56 items-center justify-center">
        <div
          className="absolute rounded-full bg-gradient-to-br from-lav to-lav-dark opacity-80 transition-transform duration-[1000ms] ease-in-out"
          style={{
            width: 140,
            height: 140,
            transform: `scale(${scale})`,
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-white">
          <span className="text-lg font-extrabold">{PHASE_LABELS[phase]}</span>
          <span className="text-3xl font-black">{secondsLeft}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => setRunning((r) => !r)} className="btn-primary">
          {running ? 'Pausar' : 'Comenzar'}
        </button>
        <span className="pill bg-mint-light text-emerald-700">Ciclos completados: {cycles}</span>
      </div>
    </div>
  )
}

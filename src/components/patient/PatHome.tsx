import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { useActivePatient } from '../../context/PatientContext'
import { useAuth } from '../../context/AuthContext'
import { useDiary, useCharacters, useExercises, useTestResults } from '../../hooks/useClinicalData'
import { useSessions } from '../../hooks/useSession'
import { useToast } from '../layout/Toast'

const MOODS = [
  { emoji: '😔', label: 'Muy mal', idx: 1 },
  { emoji: '😐', label: 'Mal', idx: 2 },
  { emoji: '🙂', label: 'Bien', idx: 3 },
  { emoji: '😊', label: 'Muy bien', idx: 4 },
  { emoji: '😄', label: 'Genial', idx: 5 },
]

export default function PatHome() {
  const { patientId } = useActivePatient()
  const { user } = useAuth()
  const { showToast } = useToast()
  const { entries, addEntry } = useDiary(patientId || undefined)
  const { characters } = useCharacters(patientId || undefined)
  const { exercises } = useExercises(patientId || undefined)
  const { results } = useTestResults(patientId || undefined)
  const { sessions } = useSessions(patientId || undefined)
  const [remind, setRemind] = useState(false)

  const char = characters[0]
  const lastHomework = sessions[0]?.homework
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const checkinsWeek = entries.filter((e) => new Date(e.date) >= weekAgo).length

  useEffect(() => {
    if (!('Notification' in window)) return
    let notifiedToday = false
    const check = () => {
      const last = localStorage.getItem('zorrito_last_checkin')
      const today = new Date().toDateString()
      if (last !== today) {
        setRemind(true)
        showToast('¿Cómo te sientes hoy? Marca tu mood check-in.', 'info')
        if (!notifiedToday) {
          if (Notification.permission === 'granted') {
            new Notification('Atenea', { body: '¿Cómo te sientes hoy? Toma 10 segundos para tu check-in.' })
            notifiedToday = true
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission()
          }
        }
      } else {
        setRemind(false)
      }
    }
    check()
    const int = setInterval(check, 60_000 * 60)
    return () => clearInterval(int)
  }, [showToast])

  async function handleMood(m: typeof MOODS[0]) {
    if (!patientId) return
    await addEntry({ patient_id: patientId, content: `Mood check-in: ${m.emoji} (${m.label})`, date: new Date().toISOString(), shared: true })
    localStorage.setItem('zorrito_last_checkin', new Date().toDateString())
    setRemind(false)
    showToast('Check-in guardado')
    confetti({ origin: { y: 1 }, colors: ['#E8733A', '#FDBA74', '#F9A8D4'] })
  }

  return (
    <div className="mx-auto max-w-md space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-fox-dark dark:text-cream">Hola {user?.email.split('@')[0] || ''}</h1>
        {remind && <span className="pill bg-pink/20 text-pink animate-pulse">Nuevo día</span>}
      </div>

      <div className="card text-center">
        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400">¿Cómo te sientes hoy?</h2>
        <div className="mt-3 flex justify-center gap-3">
          {MOODS.map((m) => (
            <button key={m.idx} onClick={() => handleMood(m)}
              className="flex flex-col items-center rounded-2xl border-[1.5px] border-[#FDDCCA] bg-white p-3 transition hover:-translate-y-1 hover:border-fox dark:bg-[#2a1d15] dark:border-[#3a2d1f]">
              <span className="text-3xl">{m.emoji}</span>
              <span className="mt-1 text-[10px] font-bold text-gray-400">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card">
          <h3 className="text-sm font-extrabold text-fox-dark dark:text-cream">Tu personaje</h3>
          {char ? (
            <div className="mt-2 flex items-center gap-3">
              <span className="text-3xl">{char.emoji}</span>
              <div><p className="font-bold text-fox-dark dark:text-cream">{char.name}</p><p className="text-xs italic text-gray-500">"{char.voice_quote}"</p></div>
            </div>
          ) : <p className="mt-2 text-xs text-gray-400">Aún no tienes un personaje de externalización.</p>}
        </div>
        <div className="card">
          <h3 className="text-sm font-extrabold text-fox-dark dark:text-cream">Próxima tarea</h3>
          {lastHomework ? <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">{lastHomework}</p> : <p className="mt-2 text-xs text-gray-400">Sin tareas asignadas.</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center"><span className="text-lg font-black text-fox">{checkinsWeek}</span><p className="text-[10px] text-gray-500">Check-ins semana</p></div>
        <div className="card text-center"><span className="text-lg font-black text-lav">{exercises.filter((e) => e.shared_with_patient).length}</span><p className="text-[10px] text-gray-500">Ejercicios</p></div>
        <div className="card text-center"><span className="text-lg font-black text-mint">{results.length}</span><p className="text-[10px] text-gray-500">Tests</p></div>
      </div>
    </div>
  )
}

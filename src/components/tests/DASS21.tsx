import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { useTestResults } from '../../hooks/useClinicalData'
import { useToast } from '../layout/Toast'

const QUESTIONS = [
  'Me ha costado mucho relajarme',
  'Me di cuenta que tenía la boca seca',
  'No podía sentir ningún sentimiento positivo',
  'Tuve dificultad para respirar',
  'Se me hizo difícil tomar la iniciativa para hacer cosas',
  'Reaccioné exageradamente en ciertas situaciones',
  'Sentí temblores (por ejemplo en las manos)',
  'He sentido que estaba gastando mucha energía nerviosa',
  'Estaba preocupado/a por situaciones en las cuales podía pasar algo terrible',
  'Sentí que no tenía nada por qué vivir',
  'Me encontré agitado/a',
  'Se me hizo difícil relajarme',
  'Me sentí triste y deprimido/a',
  'No toleré nada que no me permitiera continuar con lo que estaba haciendo',
  'Sentí que estaba a punto de panicarme',
  'No me pude entusiasmar por nada',
  'Sentí que valía muy poco como persona',
  'He sentido que estaba muy irritable',
  'He notado los latidos de mi corazón sin haber hecho esfuerzo físico',
  'Sentí miedo sin razón',
  'Sentí que la vida no tenía ningún sentido',
]

const OPTIONS = [
  { label: 'Nada', val: 0 },
  { label: 'Leve', val: 1 },
  { label: 'Moderado', val: 2 },
  { label: 'Severo', val: 3 },
]

const DEP_IDX = [3, 5, 10, 13, 16, 17, 21]
const ANX_IDX = [2, 4, 7, 9, 15, 19, 20]
const STR_IDX = [1, 6, 8, 11, 12, 14, 18]

function calc(arr: number[], idx: number[]) {
  return idx.reduce((sum, i) => sum + arr[i - 1], 0) * 2
}

function sevDep(s: number) {
  if (s <= 9) return 'Normal'
  if (s <= 13) return 'Leve'
  if (s <= 20) return 'Moderada'
  if (s <= 27) return 'Severa'
  return 'Extrema'
}
function sevAnx(s: number) {
  if (s <= 7) return 'Normal'
  if (s <= 9) return 'Leve'
  if (s <= 14) return 'Moderada'
  if (s <= 19) return 'Severa'
  return 'Extrema'
}
function sevStr(s: number) {
  if (s <= 14) return 'Normal'
  if (s <= 18) return 'Leve'
  if (s <= 25) return 'Moderada'
  if (s <= 33) return 'Severa'
  return 'Extrema'
}

function badgeColor(sev: string) {
  if (sev === 'Normal') return 'bg-mint-light text-emerald-700'
  if (sev === 'Leve') return 'bg-fox-light text-fox-dark'
  if (sev === 'Moderada') return 'bg-peach/20 text-orange-600'
  return 'bg-pink/20 text-pink'
}

export default function DASS21({ patientId }: { patientId: string }) {
  const navigate = useNavigate()
  const { addResult } = useTestResults(patientId)
  const { showToast } = useToast()
  const [answers, setAnswers] = useState<number[]>(new Array(QUESTIONS.length).fill(-1))
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const dep = calc(answers, DEP_IDX)
  const anx = calc(answers, ANX_IDX)
  const str = calc(answers, STR_IDX)

  function handleSubmit() {
    if (answers.some((a) => a < 0)) { setError('Contesta todas las preguntas.'); return }
    setSubmitted(true)
  }

  async function handleSave() {
    await addResult({
      patient_id: patientId,
      test_type: 'DASS-21',
      score: dep + anx + str,
      severity: `${sevDep(dep)} / ${sevAnx(anx)} / ${sevStr(str)}`,
      answers: { answers: [...answers], depresion: dep, ansiedad: anx, estres: str },
      date: new Date().toISOString(),
    })
    showToast('Guardado')
    confetti({ origin: { y: 1 } })
    navigate('/psy/pruebas')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="card"><h1 className="text-2xl font-extrabold text-fox-dark">DASS-21</h1><p className="mt-1 text-xs text-gray-500">Depresión, ansiedad y estrés</p></div>
      {QUESTIONS.map((q, i) => (
        <div key={i} className="card space-y-3">
          <p className="text-sm font-bold text-fox-dark">{i + 1}. {q}</p>
          <div className="flex flex-wrap gap-2">
            {OPTIONS.map((opt) => (
              <button key={opt.val} onClick={() => { const a=[...answers]; a[i]=opt.val; setAnswers(a); setError('') }}
                className={`pill text-xs transition ${answers[i]===opt.val?'bg-fox text-white':'bg-fox-light text-fox-dark hover:bg-white'}`}>{opt.label}</button>
            ))}
          </div>
        </div>
      ))}
      {error && <p className="text-center text-sm font-bold text-pink">{error}</p>}
      {!submitted ? (<div className="text-center"><button onClick={handleSubmit} className="btn-primary">Finalizar</button></div>) : (
        <div className="card space-y-4 text-center">
          <h2 className="text-xl font-extrabold text-fox-dark">Resultados DASS-21</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="card"><p className="text-xs text-gray-500">Depresión</p><p className="text-2xl font-black text-lav">{dep}</p><span className={`pill text-xs ${badgeColor(sevDep(dep))}`}>{sevDep(dep)}</span></div>
            <div className="card"><p className="text-xs text-gray-500">Ansiedad</p><p className="text-2xl font-black text-lav">{anx}</p><span className={`pill text-xs ${badgeColor(sevAnx(anx))}`}>{sevAnx(anx)}</span></div>
            <div className="card"><p className="text-xs text-gray-500">Estrés</p><p className="text-2xl font-black text-lav">{str}</p><span className={`pill text-xs ${badgeColor(sevStr(str))}`}>{sevStr(str)}</span></div>
          </div>
          <div className="flex justify-center gap-3"><button onClick={handleSave} className="btn-primary">Guardar</button><button onClick={()=>navigate('/psy/pruebas')} className="btn-secondary">Volver</button></div>
        </div>
      )}
    </div>
  )
}

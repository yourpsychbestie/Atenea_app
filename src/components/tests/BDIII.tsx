import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { useTestResults } from '../../hooks/useClinicalData'
import { useToast } from '../layout/Toast'

const QUESTIONS = [
  'Tristeza',
  'Pesimismo',
  'Fracaso pasado',
  'Pérdida de placer',
  'Sentimientos de culpa',
  'Sentimientos de castigo',
  'Disconformidad consigo mismo/a',
  'Autocrítica',
  'Pensamientos de suicidio o autolesión',
  'Llanto',
  'Agitación',
  'Pérdida de interés',
  'Indecisión',
  'Desvalorización',
  'Pérdida de energía',
  'Cambios en los patrones de sueño',
  'Irritabilidad',
  'Cambios en el apetito',
  'Dificultad para concentrarse',
  'Fatiga o cansancio',
  'Pérdida de interés en el sexo',
]

const OPTIONS = [
  { label: 'Nada', val: 0 },
  { label: 'Leve', val: 1 },
  { label: 'Moderado', val: 2 },
  { label: 'Severo', val: 3 },
]

function severity(score: number) {
  if (score <= 13) return 'Ninguna-mínima'
  if (score <= 19) return 'Leve'
  if (score <= 28) return 'Moderada'
  return 'Severa'
}

export default function BDIII({ patientId }: { patientId: string }) {
  const navigate = useNavigate()
  const { addResult } = useTestResults(patientId)
  const { showToast } = useToast()
  const [answers, setAnswers] = useState<number[]>(new Array(QUESTIONS.length).fill(-1))
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const score = answers.reduce((s, v) => s + (v >= 0 ? v : 0), 0)
  const sev = severity(score)

  function handleSubmit() {
    if (answers.some((a) => a < 0)) { setError('Contesta todas las preguntas.'); return }
    setSubmitted(true)
  }

  async function handleSave() {
    await addResult({ patient_id: patientId, test_type: 'BDI-II', score, severity: sev, answers: [...answers], date: new Date().toISOString() })
    showToast('Guardado')
    confetti({ origin: { y: 1 } })
    navigate('/psy/pruebas')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="card"><h1 className="text-2xl font-extrabold text-fox-dark">BDI-II</h1><p className="mt-1 text-xs text-gray-500">Inventario de depresión de Beck — 21 ítems</p></div>
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
          <h2 className="text-xl font-extrabold text-fox-dark">Resultado</h2>
          <div className="text-4xl font-black text-lav">{score}</div>
          <span className={`pill text-sm ${sev==='Severa'?'bg-pink/20 text-pink':sev==='Moderada'?'bg-peach/20 text-orange-600':'bg-mint-light text-emerald-700'}`}>{sev}</span>
          <div className="flex justify-center gap-3"><button onClick={handleSave} className="btn-primary">Guardar</button><button onClick={()=>navigate('/psy/pruebas')} className="btn-secondary">Volver</button></div>
        </div>
      )}
    </div>
  )
}

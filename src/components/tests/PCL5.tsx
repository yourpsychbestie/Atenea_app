import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { useTestResults } from '../../hooks/useClinicalData'
import { useToast } from '../layout/Toast'

const QUESTIONS = [
  'Recuerdos repetidos, perturbadores e involuntarios de la experiencia estresante',
  'Sueños repetidos y perturbadores de la experiencia estresante',
  'De repente sentir o actuar como si la experiencia estresante estuviera volviendo a suceder',
  'Sentirse molesto/a cuando algo le recuerde la experiencia estresante',
  'Tener reacciones físicas intensas cuando algo le recuerde la experiencia estresante',
  'Evitar recuerdos, pensamientos o sentimientos sobre la experiencia estresante',
  'Evitar recordatorios externos de la experiencia estresante',
  'Evitar pensamientos, sentimientos o conversaciones sobre el evento',
  'Evitar actividades, lugares o personas que le recuerdan el evento',
  'No poder recordar una parte importante del evento',
  'Creencias negativas muy fuertes sobre uno mismo, los demás o el mundo',
  'culparse a sí mismo/a o a otros por lo que pasó',
  'Sentimientos negativos intensos (miedo, horror, ira, culpa o vergüenza)',
  'Pérdida de interés en actividades que antes disfrutaba',
  'Sentirse distante o aislado/a de otras personas',
  'Dificultad para experimentar sentimientos positivos',
  'Comportamiento irritable, arrebatos de ira o agresión',
  'Comportarse de manera imprudente o autodestructiva',
  'Estar demasiado alerta o como si estuviera a la expectativa',
  'Sentirse sobresaltado/a o asustado/a fácilmente',
]

const OPTIONS = [
  { label: 'Nada', val: 0 },
  { label: 'Un poco', val: 1 },
  { label: 'Moderado', val: 2 },
  { label: 'Bastante', val: 3 },
  { label: 'Extremo', val: 4 },
]

function severity(score: number) {
  if (score <= 31) return 'Ninguna-mínima'
  if (score <= 33) return 'Moderada'
  if (score <= 49) return 'Moderadamente severa'
  return 'Severa'
}

export default function PCL5({ patientId }: { patientId: string }) {
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
    await addResult({ patient_id: patientId, test_type: 'PCL-5', score, severity: sev, answers: [...answers], date: new Date().toISOString() })
    showToast('Guardado')
    confetti({ origin: { y: 1 } })
    navigate('/psy/pruebas')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="card"><h1 className="text-2xl font-extrabold text-fox-dark">PCL-5</h1><p className="mt-1 text-xs text-gray-500">Estrés postraumático — 20 ítems (0-4)</p></div>
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
          <span className={`pill text-sm ${sev==='Severa'?'bg-pink/20 text-pink':sev.includes('mod')?'bg-peach/20 text-orange-600':'bg-mint-light text-emerald-700'}`}>{sev}</span>
          <div className="flex justify-center gap-3"><button onClick={handleSave} className="btn-primary">Guardar</button><button onClick={()=>navigate('/psy/pruebas')} className="btn-secondary">Volver</button></div>
        </div>
      )}
    </div>
  )
}

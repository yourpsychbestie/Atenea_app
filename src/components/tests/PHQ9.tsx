import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { useTestResults } from '../../hooks/useClinicalData'
import { useToast } from '../layout/Toast'

const QUESTIONS = [
  'Poco interés o placer en hacer las cosas',
  'Se ha sentido decaído/a, deprimido/a o sin esperanza',
  'Ha tenido dificultad para conciliar el sueño, ha dormido en exceso o ha tenido sueños intranquilos',
  'Ha sentido cansancio o ha tenido poca energía',
  'Ha tenido poco apetito o ha comido en exceso',
  'Se ha sentido mal consigo mismo/a o que es un fracaso o que decepciona a su familia',
  'Ha tenido dificultad para concentrarse en cosas como leer el periódico o ver televisión',
  'Se ha movido o hablado tan lentamente que otras personas podrían haberlo notado, o ha estado tan inquieto/a que se ha movido mucho más de lo habitual',
  'Ha tenido pensamientos de que estaría mejor muerto/a o de lastimarse de alguna manera',
]

const OPTIONS = [
  { label: 'Nunca', val: 0 },
  { label: 'Varios días', val: 1 },
  { label: 'Más de la mitad', val: 2 },
  { label: 'Casi todos los días', val: 3 },
]

function severity(score: number) {
  if (score <= 4) return 'Ninguna-mínima'
  if (score <= 9) return 'Leve'
  if (score <= 14) return 'Moderada'
  if (score <= 19) return 'Moderadamente severa'
  return 'Severa'
}

export default function PHQ9({ patientId }: { patientId: string }) {
  const navigate = useNavigate()
  const { addResult } = useTestResults(patientId)
  const { showToast } = useToast()
  const [answers, setAnswers] = useState<number[]>(new Array(QUESTIONS.length).fill(-1))
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const score = answers.reduce((s, v) => s + (v >= 0 ? v : 0), 0)
  const sev = severity(score)

  function handleSubmit() {
    if (answers.some((a) => a < 0)) {
      setError('Contesta todas las preguntas por favor.')
      return
    }
    setSubmitted(true)
  }

  async function handleSave() {
    if (!submitted) return
    await addResult({
      patient_id: patientId,
      test_type: 'PHQ-9',
      score,
      severity: sev,
      answers: [...answers],
      date: new Date().toISOString(),
    })
    showToast('Resultado guardado')
    confetti({ origin: { y: 1 } })
    navigate('/psy/pruebas')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="card">
        <h1 className="text-2xl font-extrabold text-fox-dark">PHQ-9</h1>
        <p className="mt-1 text-xs text-gray-500">Cuestionario de salud del paciente — Depresión</p>
      </div>

      {QUESTIONS.map((q, i) => (
        <div key={i} className="card space-y-3">
          <p className="text-sm font-bold text-fox-dark">
            {i + 1}. {q}
          </p>
          <div className="flex flex-wrap gap-2">
            {OPTIONS.map((opt) => (
              <button
                key={opt.val}
                onClick={() => {
                  const a = [...answers]
                  a[i] = opt.val
                  setAnswers(a)
                  setError('')
                }}
                className={`pill text-xs transition ${
                  answers[i] === opt.val ? 'bg-fox text-white' : 'bg-fox-light text-fox-dark hover:bg-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      {error && <p className="text-center text-sm font-bold text-pink">{error}</p>}

      {!submitted ? (
        <div className="text-center">
          <button onClick={handleSubmit} className="btn-primary">Finalizar</button>
        </div>
      ) : (
        <div className="card space-y-4 text-center">
          <h2 className="text-xl font-extrabold text-fox-dark">Resultado</h2>
          <div className="text-4xl font-black text-lav">{score}</div>
          <span className={`pill text-sm ${
            sev === 'Severa' ? 'bg-pink/20 text-pink' : sev === 'Moderada' || sev === 'Moderadamente severa' ? 'bg-peach/20 text-orange-600' : 'bg-mint-light text-emerald-700'
          }`}>{sev}</span>
          <p className="text-xs text-gray-500">
            Este resultado es orientativo. Coméntalo con tu psicólogo.
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={handleSave} className="btn-primary">Guardar resultado</button>
            <button onClick={() => navigate('/psy/pruebas')} className="btn-secondary">Volver</button>
          </div>
        </div>
      )}
    </div>
  )
}

import { useMemo, useState } from 'react'
import { createCharacterFromExternalizacion } from '../../lib/anthropic'
import { useCharacters } from '../../hooks/useClinicalData'
import { useExercises } from '../../hooks/useClinicalData'
import { genId } from '../../lib/localStore'

interface ExternalizacionProps {
  patientId: string
}

interface Answers {
  nombre: string
  sensacion: string
  presencia: string
  llegada: string
}

const QUESTIONS: Array<{ key: keyof Answers; title: string; helper: string; placeholder: string }> = [
  {
    key: 'nombre',
    title: '1. ¿Cómo se llama?',
    helper: 'Ponle un nombre a esa parte o problema, como si fuera un personaje.',
    placeholder: 'Ej. La Nube Gris, El Vigilante, Tormenta...',
  },
  {
    key: 'sensacion',
    title: '2. ¿Cómo se siente?',
    helper: 'Describe cómo se siente ese personaje por dentro.',
    placeholder: 'Ej. Se siente asustado, cansado y en alerta.',
  },
  {
    key: 'presencia',
    title: '3. ¿Qué hace aquí?',
    helper: '¿Para qué aparece? ¿Qué intenta conseguir o evitar?',
    placeholder: 'Ej. Intenta protegerme para que no me equivoque.',
  },
  {
    key: 'llegada',
    title: '4. ¿Cuándo llegó?',
    helper: 'Recuerda desde cuándo notas su presencia o en qué etapa comenzó.',
    placeholder: 'Ej. Empezó en la universidad, cuando tuve mucha presión.',
  },
]

const EMPTY_ANSWERS: Answers = {
  nombre: '',
  sensacion: '',
  presencia: '',
  llegada: '',
}

export default function Externalizacion({ patientId }: ExternalizacionProps) {
  const { characters, saveCharacter } = useCharacters(patientId)
  const { upsertExercise } = useExercises(patientId)
  const existing = characters[0]

  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS)
  const [stepIndex, setStepIndex] = useState(0)
  const [currentInput, setCurrentInput] = useState('')
  const [loadingChar, setLoadingChar] = useState(false)

  const current = QUESTIONS[stepIndex]
  const isLast = stepIndex === QUESTIONS.length - 1

  const completedCount = useMemo(
    () => Object.values(answers).filter((v) => v.trim().length > 0).length,
    [answers],
  )

  function saveCurrentAnswer() {
    if (!currentInput.trim()) return false
    setAnswers((prev) => ({ ...prev, [current.key]: currentInput.trim() }))
    return true
  }

  async function handleNext() {
    const ok = saveCurrentAnswer()
    if (!ok) return
    if (!isLast) {
      const nextIdx = stepIndex + 1
      const nextKey = QUESTIONS[nextIdx].key
      setStepIndex(nextIdx)
      setCurrentInput(answers[nextKey] || '')
      return
    }

    setLoadingChar(true)
    const finalAnswers: Answers = {
      ...answers,
      [current.key]: currentInput.trim(),
    }
    const result = await createCharacterFromExternalizacion(finalAnswers)

    const characterName = finalAnswers.nombre.trim() || 'Mi personaje'

    await saveCharacter({
      id: genId('char'),
      patient_id: patientId,
      name: characterName,
      emoji: result.emoji,
      description: result.descripcion,
      voice_quote: result.frase,
    })

    await upsertExercise(
      patientId,
      'externalizacion',
      {
        completed: true,
        answers: finalAnswers,
        generatedCharacter: {
          name: characterName,
          emoji: result.emoji,
          description: result.descripcion,
          voice_quote: result.frase,
        },
      },
      true,
    )

    setLoadingChar(false)
  }

  function startOver() {
    setStepIndex(0)
    setAnswers(EMPTY_ANSWERS)
    setCurrentInput('')
  }

  if (!existing) {
    return (
      <div className="card flex flex-col gap-5">
        <div className="space-y-2">
          <h3 className="text-lg font-extrabold text-fox-dark dark:text-cream">Externalización 🎭</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Vas a responder 4 preguntas para convertir ese problema en un personaje. Al final, la app te devolverá
            su descripción y su voz.
          </p>
          <div className="h-2 w-full rounded-full bg-fox-light/50 dark:bg-[#3a2d1f]">
            <div
              className="h-2 rounded-full bg-fox transition-all"
              style={{ width: `${(completedCount / QUESTIONS.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">{completedCount} de {QUESTIONS.length} respuestas</p>
        </div>

        <div className="rounded-2xl border-[1.5px] border-[#FDDCCA] p-4 dark:border-[#3a2d1f]">
          <h4 className="text-base font-extrabold text-fox-dark dark:text-cream">{current.title}</h4>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{current.helper}</p>

          <textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder={current.placeholder}
            rows={4}
            className="mt-3 w-full resize-none rounded-xl border-[1.5px] border-[#FDDCCA] bg-white px-4 py-3 text-sm focus:outline-none focus:border-fox dark:bg-[#2a1d15] dark:border-[#3a2d1f] dark:text-cream"
          />

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleNext}
              disabled={loadingChar}
              className="btn-primary"
            >
              {loadingChar ? 'Creando personaje...' : isLast ? 'Finalizar y crear personaje' : 'Guardar y seguir'}
            </button>
            {stepIndex > 0 && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  const prevIdx = stepIndex - 1
                  const prevKey = QUESTIONS[prevIdx].key
                  setStepIndex(prevIdx)
                  setCurrentInput(answers[prevKey] || '')
                }}
              >
                Atrás
              </button>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-fox-light/20 p-4 text-xs text-gray-600 dark:bg-[#3a2d1f] dark:text-gray-300">
          <p className="font-bold text-fox-dark dark:text-cream">Preguntas del ejercicio:</p>
          <ol className="mt-1 list-decimal pl-4 space-y-1">
            <li>¿Cómo se llama?</li>
            <li>¿Cómo se siente?</li>
            <li>¿Qué hace aquí?</li>
            <li>¿Cuándo llegó?</li>
          </ol>
        </div>
      </div>
    )
  }

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{existing.emoji}</span>
        <div>
          <h3 className="text-lg font-extrabold text-fox-dark dark:text-cream">{existing.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{existing.description}</p>
        </div>
      </div>
      <p className="text-sm italic text-lav-dark dark:text-lav-light">"{existing.voice_quote}"</p>

      <div className="rounded-2xl bg-fox-light/20 p-4 text-sm text-gray-600 dark:bg-[#3a2d1f] dark:text-gray-300">
        Personaje generado. Si quieres, puedes repetir el ejercicio para explorar otra versión.
      </div>

      <div>
        <button onClick={startOver} className="btn-secondary">
          Repetir preguntas
        </button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSessions } from '../../hooks/useSession'
import { useToast } from '../layout/Toast'

export default function NuevaSesion() {
  const navigate = useNavigate()
  const { patientId } = useParams<{ patientId: string }>()
  const { addSession } = useSessions()
  const { showToast } = useToast()

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [durationMin, setDurationMin] = useState(50)
  const [summary, setSummary] = useState('')
  const [fieldNotes, setFieldNotes] = useState('')
  const [interventions, setInterventions] = useState('')
  const [homework, setHomework] = useState('')
  const [moodScore, setMoodScore] = useState(5)
  const [insightLevel, setInsightLevel] = useState(3)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const handleSave = async () => {
    if (!patientId) return
    await addSession({
      patient_id: patientId,
      date: new Date(date).toISOString(),
      duration_min: durationMin,
      summary,
      field_notes: fieldNotes,
      interventions,
      homework,
      mood_score: moodScore,
      insight_level: insightLevel,
      tags,
    })
    showToast('Sesión guardada con éxito')
    navigate(`/psy/expediente/${patientId}`)
  }

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput('')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <h1 className="text-2xl font-extrabold text-fox-dark">Nueva sesión</h1>

      <div className="card grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-500">Fecha</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border-[1.5px] border-[#FDDCCA] bg-cream p-3 text-sm focus:outline-none focus:border-fox" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-500">Duración (min)</label>
          <input type="number" min={5} max={180} value={durationMin} onChange={(e) => setDurationMin(Number(e.target.value))} className="w-full rounded-xl border-[1.5px] border-[#FDDCCA] bg-cream p-3 text-sm focus:outline-none focus:border-fox" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-bold text-gray-500">Resumen</label>
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="min-h-[80px] w-full rounded-xl border-[1.5px] border-[#FDDCCA] bg-cream p-3 text-sm focus:outline-none focus:border-fox" placeholder="Resumen de la sesión..." />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-500">Notas de campo</label>
          <textarea value={fieldNotes} onChange={(e) => setFieldNotes(e.target.value)} className="min-h-[80px] w-full rounded-xl border-[1.5px] border-[#FDDCCA] bg-cream p-3 text-sm focus:outline-none focus:border-fox" placeholder="Observaciones clínicas..." />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-500">Intervenciones</label>
          <textarea value={interventions} onChange={(e) => setInterventions(e.target.value)} className="min-h-[80px] w-full rounded-xl border-[1.5px] border-[#FDDCCA] bg-cream p-3 text-sm focus:outline-none focus:border-fox" placeholder="Técnicas aplicadas..." />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-bold text-gray-500">Tareas</label>
          <textarea value={homework} onChange={(e) => setHomework(e.target.value)} className="min-h-[60px] w-full rounded-xl border-[1.5px] border-[#FDDCCA] bg-cream p-3 text-sm focus:outline-none focus:border-fox" placeholder="Tareas asignadas..." />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-500">Mood score {moodScore}/10</label>
          <input type="range" min={1} max={10} value={moodScore} onChange={(e) => setMoodScore(Number(e.target.value))} className="w-full accent-fox" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-500">Insight level {insightLevel}/5</label>
          <input type="range" min={1} max={5} value={insightLevel} onChange={(e) => setInsightLevel(Number(e.target.value))} className="w-full accent-lav" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-bold text-gray-500">Etiquetas</label>
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((t) => (
              <span key={t} className="pill bg-fox-light text-fox-dark">
                {t} <button onClick={() => setTags(tags.filter((x) => x !== t))} className="ml-1">×</button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
              placeholder="+ etiqueta"
              className="rounded-full border-[1.5px] border-[#FDDCCA] bg-cream px-3 py-1 text-sm focus:outline-none focus:border-fox"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave} className="btn-primary">Guardar sesión</button>
        <button onClick={() => navigate(`/psy/expediente/${patientId}`)} className="btn-secondary">Cancelar</button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePatients, usePatient } from '../../hooks/usePatient'
import { useSessions } from '../../hooks/useSession'
import EmptyState from '../layout/EmptyState'
import ExportPDFButton from '../layout/ExportPDF'
import { useToast } from '../layout/Toast'

const ENFOQUES = ['TCC', 'ACT', 'EMDR', 'Narrativa', 'DBT', 'Gestalt']

export default function Expediente() {
  const navigate = useNavigate()
  const { patientId: paramId } = useParams<{ patientId: string }>()
  const { patients, addPatient } = usePatients()
  const { patient, updatePatient } = usePatient(paramId)
  const { sessions } = useSessions(paramId)
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alias, setAlias] = useState('')
  const [age, setAge] = useState('')
  const [notes, setNotes] = useState('')
  const [emoji, setEmoji] = useState('')
  const [saving, setSaving] = useState(false)

  const filtered = patients.filter((p) => p.alias.toLowerCase().includes(search.toLowerCase()))

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!alias.trim()) return
    setSaving(true)
    const newPatient = await addPatient({
      alias: alias.trim(),
      emoji: emoji.trim() || '👤',
      age: age ? Number(age) : undefined,
      notes: notes.trim(),
    })
    setSaving(false)
    setIsModalOpen(false)
    setAlias('')
    setAge('')
    setNotes('')
    setEmoji('')
    navigate(`/psy/expediente/${newPatient.id}`)
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })

  function NewPatientModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-md rounded-3xl border-[1.5px] border-[#FDDCCA] bg-white p-6 shadow-xl dark:bg-[#2a1d15] dark:border-[#3a2d1f]">
          <h2 className="mb-4 text-xl font-extrabold text-fox-dark">Nuevo paciente</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-500">Alias *</label>
              <input
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Ej. Luna"
                required
                className="w-full rounded-xl border-[1.5px] border-[#FDDCCA] bg-cream p-3 text-sm focus:outline-none focus:border-fox"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-500">Edad</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Opcional"
                  className="w-full rounded-xl border-[1.5px] border-[#FDDCCA] bg-cream p-3 text-sm focus:outline-none focus:border-fox"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-500">Emoji</label>
                <input
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  placeholder="Ej. 🐰"
                  className="w-full rounded-xl border-[1.5px] border-[#FDDCCA] bg-cream p-3 text-sm focus:outline-none focus:border-fox"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-500">Notas breves</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Motivo de consulta u observaciones iniciales..."
                rows={3}
                className="min-h-[100px] w-full resize-none rounded-xl border-[1.5px] border-[#FDDCCA] bg-cream p-3 text-sm focus:outline-none focus:border-fox"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving || !alias.trim()}
                className="btn-primary"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (paramId && patient) {
    return (
      <div className="mx-auto max-w-4xl space-y-5">
        <button onClick={() => navigate('/psy/expediente')} className="text-sm font-semibold text-lav-dark hover:underline">
          ← Volver a expedientes
        </button>

        <div className="card flex items-center gap-4">
          <span className="text-4xl">{patient.emoji}</span>
          <div>
            <h1 className="text-2xl font-extrabold text-fox-dark">{patient.alias}</h1>
            <p className="text-xs text-gray-500">{patient.motivo_consulta || 'Sin motivo registrado'}</p>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-lg font-extrabold text-fox-dark">Información clínica</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-500">Motivo de consulta</label>
              <textarea
                value={patient.motivo_consulta || ''}
                onChange={(e) => updatePatient(patient.id, { motivo_consulta: e.target.value })}
                className="w-full rounded-xl border-[1.5px] border-[#FDDCCA] bg-cream p-3 text-sm focus:outline-none focus:border-fox"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-500">Enfoque terapéutico</label>
              <select
                value={patient.enfoque || 'TCC'}
                onChange={(e) => updatePatient(patient.id, { enfoque: e.target.value })}
                className="w-full rounded-xl border-[1.5px] border-[#FDDCCA] bg-cream p-3 text-sm focus:outline-none focus:border-fox"
              >
                {ENFOQUES.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-500">Diagnóstico CIE-10</label>
              <input
                value={patient.diagnostico_cie10 || ''}
                onChange={(e) => updatePatient(patient.id, { diagnostico_cie10: e.target.value })}
                className="w-full rounded-xl border-[1.5px] border-[#FDDCCA] bg-cream p-3 text-sm focus:outline-none focus:border-fox"
                placeholder="Ej. F41.1"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-500">Etiquetas clínicas</label>
              <div className="flex flex-wrap gap-2">
                {(patient.tags || []).map((tag) => (
                  <span key={tag} className="pill bg-fox-light text-fox-dark">
                    {tag}{' '}
                    <button
                      onClick={() =>
                        updatePatient(patient.id, { tags: (patient.tags || []).filter((t) => t !== tag) })
                      }
                      className="ml-1 text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && tagInput.trim()) {
                      updatePatient(patient.id, { tags: [...(patient.tags || []), tagInput.trim()] })
                      setTagInput('')
                    }
                  }}
                  placeholder="+ etiqueta"
                  className="rounded-full border-[1.5px] border-[#FDDCCA] bg-cream px-3 py-1 text-sm focus:outline-none focus:border-fox"
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate(`/psy/nueva-sesion/${patient.id}`)}
            className="btn-primary mt-2"
          >
            + Nueva sesión
          </button>
        </div>

        <div className="card">
          <h2 className="mb-3 text-lg font-extrabold text-fox-dark">Historial de sesiones</h2>
          {sessions.length === 0 ? (
            <EmptyState message="Sin sesiones registradas" submessage="Empieza con una nueva sesión" />
          ) : (
            <div className="flex flex-col gap-3">
              {sessions.map((s) => (
                <div key={s.id} className="rounded-2xl border-[1.5px] border-[#FDDCCA] bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-fox-dark">{formatDate(s.date)}</span>
                    <div className="flex items-center gap-2">
                      <ExportPDFButton session={s} patient={patient} />
                      <span className="pill bg-fox-light text-fox-dark">Mood {s.mood_score}/10</span>
                      <span className="pill bg-lav-light text-lav-dark">Insight {s.insight_level}/5</span>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-700">{s.summary}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {s.tags.map((t) => (
                      <span key={t} className="pill bg-cream text-gray-500 text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-fox-dark">Expedientes</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-fox text-2xl text-white shadow-lg transition hover:bg-fox-dark hover:scale-105"
          title="Agregar paciente"
        >
          +
        </button>
      </div>

      {patients.length === 0 ? (
        <EmptyState
          message="Aun no tienes pacientes"
          submessage="Agrega tu primer paciente con el boton +"
        />
      ) : (
        <>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por alias..."
            className="w-full max-w-md rounded-full border-[1.5px] border-[#FDDCCA] bg-white px-5 py-2.5 text-sm focus:outline-none focus:border-fox"
          />
          {filtered.length === 0 ? (
            <EmptyState message="No se encontraron pacientes" />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/psy/expediente/${p.id}`)}
                  className="card cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{p.emoji}</span>
                    <div>
                      <p className="font-extrabold text-fox-dark">{p.alias}</p>
                      <p className="text-xs text-gray-500">{p.enfoque || 'TCC'} · {p.diagnostico_cie10 || 'Sin Dx'}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{p.motivo_consulta || 'Sin motivo registrado'}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(p.tags || []).map((t) => (
                      <span key={t} className="pill bg-fox-light text-fox-dark text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isModalOpen && <NewPatientModal />}
    </div>
  )
}

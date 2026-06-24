import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessions } from '../../hooks/useSession'
import { usePatients } from '../../hooks/usePatient'
import { localStore } from '../../lib/localStore'
import EmptyState from '../layout/EmptyState'

export default function Dashboard() {
  const navigate = useNavigate()
  const { patients, addPatient } = usePatients()
  const { sessions } = useSessions()
  const [quickNote, setQuickNote] = useState(() => localStore.getQuickNote())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alias, setAlias] = useState('')
  const [age, setAge] = useState('')
  const [notes, setNotes] = useState('')
  const [emoji, setEmoji] = useState('')
  const [saving, setSaving] = useState(false)

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const sessionsWeek = sessions.filter((s) => new Date(s.date) >= weekAgo)

  const avgMood = sessions.length
    ? (sessions.reduce((sum, s) => sum + s.mood_score, 0) / sessions.length).toFixed(1)
    : '–'

  const recentSessions = useMemo(
    () => sessions.slice(0, 6),
    [sessions],
  )

  function saveNote(v: string) {
    setQuickNote(v)
    localStore.setQuickNote(v)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!alias.trim()) return
    setSaving(true)
    await addPatient({
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
  }

  const moodEmoji = (score: number) => {
    if (score <= 3) return '😔'
    if (score <= 5) return '😐'
    if (score <= 7) return '🙂'
    if (score <= 9) return '😊'
    return '😄'
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })

  if (patients.length === 0) {
    return (
      <div className="relative mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-fox-dark">Dashboard</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-fox text-2xl text-white shadow-lg transition hover:bg-fox-dark hover:scale-105"
            title="Agregar paciente"
          >
            +
          </button>
        </div>
        <EmptyState
          message="Aun no tienes pacientes"
          submessage="Agrega tu primer paciente con el boton +"
        />

        {isModalOpen && (
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
        )}
      </div>
    )
  }

  return (
    <div className="relative mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-fox-dark">Dashboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-fox text-2xl text-white shadow-lg transition hover:bg-fox-dark hover:scale-105"
          title="Agregar paciente"
        >
          +
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card flex flex-col">
          <span className="text-sm text-gray-500">Pacientes activos</span>
          <span className="text-3xl font-black text-fox">{patients.length}</span>
        </div>
        <div className="card flex flex-col">
          <span className="text-sm text-gray-500">Sesiones esta semana</span>
          <span className="text-3xl font-black text-lav">{sessionsWeek.length}</span>
        </div>
        <div className="card flex flex-col">
          <span className="text-sm text-gray-500">Mood promedio</span>
          <span className="text-3xl font-black text-mint">{avgMood}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card col-span-2">
          <h2 className="mb-4 text-lg font-extrabold text-fox-dark">Sesiones recientes</h2>
          {recentSessions.length === 0 ? (
            <EmptyState message="Aún no hay sesiones" submessage="Registra una desde el expediente" />
          ) : (
            <div className="flex flex-col gap-3">
              {recentSessions.map((s) => {
                const pat = patients.find((p) => p.id === s.patient_id)
                return (
                  <div
                    key={s.id}
                    onClick={() => navigate(`/psy/expediente/${s.patient_id}`)}
                    className="flex cursor-pointer items-center gap-4 rounded-2xl border-[1.5px] border-[#FDDCCA] bg-white p-4 transition hover:-translate-y-0.5"
                  >
                    <span className="text-2xl">{pat?.emoji || '👤'}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-fox-dark">
                        {pat?.alias || 'Desconocido'} · {formatDate(s.date)}
                      </p>
                      <p className="truncate text-xs text-gray-500">{s.summary}</p>
                    </div>
                    <span className="pill bg-fox-light text-fox-dark text-lg" title="Mood">
                      {moodEmoji(s.mood_score)} {s.mood_score}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="card flex flex-col">
          <h2 className="mb-2 text-lg font-extrabold text-fox-dark">Nota rápida</h2>
          <textarea
            value={quickNote}
            onChange={(e) => saveNote(e.target.value)}
            placeholder="Escribe una nota que necesites recordar..."
            className="min-h-[140px] flex-1 resize-none rounded-2xl border-[1.5px] border-[#FDDCCA] bg-cream p-3 text-sm focus:outline-none focus:border-fox"
          />
        </div>
      </div>

      {isModalOpen && (
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
      )}
    </div>
  )
}

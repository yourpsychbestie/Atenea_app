import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessions } from '../../hooks/useSession'
import { usePatients } from '../../hooks/usePatient'

function getStartOfWeek(d: Date) {
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

export default function Calendario() {
  const navigate = useNavigate()
  const { sessions } = useSessions()
  const { patients } = usePatients()
  const [startOfWeek, setStartOfWeek] = useState(() => getStartOfWeek(new Date()))

  const weekDates = useMemo(() => {
    const dates: Date[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      dates.push(d)
    }
    return dates
  }, [startOfWeek])

  const formatDate = (d: Date) => d.toISOString().slice(0, 10)
  const formatLabel = (d: Date) =>
    d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })

  const weekSessions = useMemo(() => {
    return weekDates.map((d) => {
      const dStr = formatDate(d)
      return sessions.filter((s) => s.date.slice(0, 10) === dStr)
    })
  }, [weekDates, sessions])

  const prevWeek = () => {
    const d = new Date(startOfWeek)
    d.setDate(d.getDate() - 7)
    setStartOfWeek(d)
  }

  const nextWeek = () => {
    const d = new Date(startOfWeek)
    d.setDate(d.getDate() + 7)
    setStartOfWeek(d)
  }

  const todayStr = formatDate(new Date())
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-fox-dark dark:text-cream">Calendario</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatLabel(weekDates[0])} – {formatLabel(weekDates[6])}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={prevWeek} className="btn-secondary">← Semana</button>
          <button onClick={() => setStartOfWeek(getStartOfWeek(new Date()))} className="btn-secondary">Hoy</button>
          <button onClick={nextWeek} className="btn-secondary">Semana →</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div key={day} className="text-center text-xs font-bold text-gray-400">{day}</div>
        ))}
        {weekDates.map((date, i) => {
          const isToday = todayStr === formatDate(date)
          const sessionsDay = weekSessions[i]
          const hasEvents = sessionsDay.length > 0
          return (
            <div
              key={i}
              className={`card flex flex-col gap-1 min-h-[140px] p-2 transition ${
                isToday ? 'border-fox ring-1 ring-fox' : ''
              } ${hasEvents ? 'bg-white dark:bg-[#2a1d15]' : 'bg-cream/50 dark:bg-[#1a1210]'}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isToday ? 'text-fox' : 'text-gray-400'}`}>
                  {date.getDate()}
                </span>
                {hasEvents && <span className="text-[10px] text-fox font-bold">{sessionsDay.length}</span>}
              </div>
              <div className="flex flex-col gap-1 overflow-y-auto">
                {sessionsDay.map((s) => {
                  const pat = patients.find((p) => p.id === s.patient_id)
                  return (
                    <button
                      key={s.id}
                      onClick={() => navigate(`/psy/expediente/${s.patient_id}`)}
                      title={`${pat?.alias || 'Paciente'} · ${s.duration_min}min · ${s.summary.slice(0, 60)}`}
                      className="rounded-lg bg-fox-light px-2 py-1.5 text-left text-[10px] font-bold text-fox-dark transition hover:scale-[1.02] dark:bg-[#3a2d1f]"
                    >
                      <span className="mr-1">{pat?.emoji}</span>
                      <span>{pat?.alias}</span>
                      <span className="block font-normal text-gray-500">{s.duration_min} min</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="card">
        <h2 className="mb-3 text-lg font-extrabold text-fox-dark dark:text-cream">Próximas sesiones</h2>
        {sessions.length === 0 ? (
          <p className="text-sm text-gray-500">No hay sesiones registradas.</p>
        ) : (
          <ul className="space-y-2">
            {sessions.slice(0, 5).map((s) => {
              const pat = patients.find((p) => p.id === s.patient_id)
              return (
                <li key={s.id} className="flex items-center justify-between rounded-xl border border-[#FDDCCA] bg-white p-3 dark:bg-[#2a1d15] dark:border-[#3a2d1f]">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{pat?.emoji}</span>
                    <div>
                      <p className="text-sm font-bold text-fox-dark dark:text-cream">{pat?.alias}</p>
                      <p className="text-[10px] text-gray-500">{s.date.slice(0, 10)} · {s.duration_min} min</p>
                    </div>
                  </div>
                  <span className="pill bg-fox-light text-fox-dark text-xs">Mood {s.mood_score}/10</span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

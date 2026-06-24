import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePatients } from '../../hooks/usePatient'
import { useTestResults } from '../../hooks/useClinicalData'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import EmptyState from '../layout/EmptyState'

const TESTS = [
  { key: 'PHQ-9', name: 'PHQ-9', desc: 'Depresión — 9 ítems', icon: '🌧️' },
  { key: 'GAD-7', name: 'GAD-7', desc: 'Ansiedad — 7 ítems', icon: '🌪️' },
  { key: 'PCL-5', name: 'PCL-5', desc: 'Estrés postraumático — 20 ítems', icon: '⚡' },
  { key: 'BDI-II', name: 'BDI-II', desc: 'Inventario depresión Beck — 21 ítems', icon: '🌑' },
  { key: 'DASS-21', name: 'DASS-21', desc: 'Depresión, ansiedad y estrés — 21 ítems', icon: '🌊' },
]

export default function PruebasHub() {
  const navigate = useNavigate()
  const { patients } = usePatients()
  const [selectedPatient, setSelectedPatient] = useState(patients[0]?.id || '')
  const { results } = useTestResults(selectedPatient)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const chartData = useMemo(() => {
    const filtered = activeFilter
      ? results.filter((r) => r.test_type === activeFilter)
      : results
    return filtered.map((r) => ({
      date: new Date(r.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
      score: r.score,
      test_type: r.test_type,
    }))
  }, [results, activeFilter])

  if (patients.length === 0) {
    return (
      <div className="mx-auto max-w-5xl space-y-5">
        <h1 className="text-2xl font-extrabold text-fox-dark">Pruebas</h1>
        <EmptyState
          message="Aun no tienes pacientes"
          submessage="Agrega tu primer paciente para empezar a registrar pruebas"
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-fox-dark">Pruebas</h1>
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          className="rounded-full border-[1.5px] border-[#FDDCCA] bg-white px-4 py-2 text-sm font-semibold text-fox-dark focus:outline-none"
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.emoji} {p.alias}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TESTS.map((t) => (
          <div
            key={t.key}
            onClick={() => navigate(`/psy/pruebas/${t.key}/${selectedPatient}`)}
            className="card cursor-pointer"
          >
            <div className="mb-2 text-3xl">{t.icon}</div>
            <h3 className="text-base font-extrabold text-fox-dark">{t.name}</h3>
            <p className="mt-1 text-xs text-gray-500">{t.desc}</p>
          </div>
        ))}
      </div>

      <div className="card space-y-4">
        <h2 className="text-lg font-extrabold text-fox-dark">Historial de puntuaciones</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter(null)}
            className={`pill transition ${!activeFilter ? 'bg-fox text-white' : 'bg-fox-light text-fox-dark'}`}
          >
            Todos
          </button>
          {TESTS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveFilter(t.key)}
              className={`pill transition ${activeFilter === t.key ? 'bg-fox text-white' : 'bg-fox-light text-fox-dark'}`}
            >
              {t.name}
            </button>
          ))}
        </div>
        {chartData.length === 0 ? (
          <EmptyState message="Sin datos para mostrar" submessage="Completa un cuestionario para ver la gráfica" />
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#FDEEE6" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#A78BFA" fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

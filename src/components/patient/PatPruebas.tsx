import { useActivePatient } from '../../context/PatientContext'
import { useTestResults } from '../../hooks/useClinicalData'
import EmptyState from '../layout/EmptyState'

const severityColor = (severity: string) => {
  if (severity.includes('Severa') || severity.includes('Extrema')) return 'bg-pink/20 text-pink'
  if (severity.includes('mod')) return 'bg-peach/20 text-orange-600'
  if (severity.includes('Leve')) return 'bg-fox-light text-fox-dark'
  return 'bg-mint-light text-emerald-700'
}

export default function PatPruebas() {
  const { patientId } = useActivePatient()
  const { results } = useTestResults(patientId || undefined)

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <h1 className="text-2xl font-extrabold text-fox-dark">Mis cuestionarios</h1>
      {results.length === 0 ? (
        <EmptyState message="Sin resultados aún" submessage="Completarás cuestionarios cuando tu psicólogo te los asigne" />
      ) : (
        <div className="flex flex-col gap-3">
          {results.map((r) => (
            <div key={r.id} className="card">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-fox-dark">{r.test_type}</h3>
                <span className={`pill text-xs ${severityColor(r.severity)}`}>{r.severity}</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Puntuación: <strong>{r.score}</strong>
              </p>
              <p className="text-xs text-gray-400">{formatDate(r.date)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

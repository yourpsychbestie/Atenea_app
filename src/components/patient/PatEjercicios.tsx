import { useActivePatient } from '../../context/PatientContext'
import { useExercises } from '../../hooks/useClinicalData'
import EmptyState from '../layout/EmptyState'

export default function PatEjercicios() {
  const { patientId } = useActivePatient()
  const { exercises } = useExercises(patientId || undefined)
  const shared = exercises.filter((e) => e.shared_with_patient)

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('es-ES') : ''

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <h1 className="text-2xl font-extrabold text-fox-dark">Mis ejercicios</h1>
      {shared.length === 0 ? (
        <EmptyState message="Aún no tienes ejercicios compartidos" submessage="Tu psicólogo los habilitará pronto" />
      ) : (
        <div className="flex flex-col gap-3">
          {shared.map((ex) => (
            <div key={ex.id} className="card">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-fox-dark capitalize">{ex.type.replace('_', ' ')}</h3>
                <span className="pill bg-mint-light text-emerald-700 text-xs">Compartido</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">{formatDate(ex.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

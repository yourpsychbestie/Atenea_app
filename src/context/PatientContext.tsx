import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { usePatients } from '../hooks/usePatient'

interface PatientContextValue {
  patientId: string | null
  setPatientId: (id: string) => void
}

const PatientContext = createContext<PatientContextValue | null>(null)

const STORAGE_KEY = 'zorrito_active_patient_id'

// Simula la "sesión" del paciente: como no hay login real, guardamos el
// paciente activo elegido desde el selector del Topbar.
export function PatientProvider({ children }: { children: ReactNode }) {
  const { patients } = usePatients()
  const [patientId, setPatientIdState] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEY) || null,
  )

  useEffect(() => {
    if (!patientId && patients.length > 0) {
      setPatientIdState(patients[0].id)
    }
  }, [patientId, patients])

  function setPatientId(id: string) {
    localStorage.setItem(STORAGE_KEY, id)
    setPatientIdState(id)
  }

  return (
    <PatientContext.Provider value={{ patientId, setPatientId }}>
      {children}
    </PatientContext.Provider>
  )
}

export function useActivePatient() {
  const ctx = useContext(PatientContext)
  if (!ctx) throw new Error('useActivePatient debe usarse dentro de PatientProvider')
  return ctx
}

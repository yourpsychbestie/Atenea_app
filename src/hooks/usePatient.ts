import { useCallback, useEffect, useState } from 'react'
import { subscribePatients, addPatient as addPatientService, updatePatient as updatePatientService, deletePatient as deletePatientService } from '../services/firestoreService'
import type { Patient } from '../lib/types'

interface NewPatientInput {
  alias: string
  emoji?: string
  age?: number
  notes?: string
  color?: string
  motivo_consulta?: string
}

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribePatients((data) => {
      setPatients(data)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    // subscribePatients ya se encarga de sincronizar
    setTimeout(() => setLoading(false), 200)
  }, [])

  const addPatient = useCallback(async (input: NewPatientInput) => {
    const newPatient = await addPatientService({
      psychologist_id: '', // se rellena en el servicio
      alias: input.alias.trim(),
      emoji: input.emoji?.trim() || '👤',
      motivo_consulta: input.notes?.trim() || '',
      created_at: new Date().toISOString(),
      tags: [],
    } as any)
    setPatients((prev) => [newPatient, ...prev])
    return newPatient
  }, [])

  const updatePatient = useCallback(async (id: string, patch: Partial<Patient>) => {
    await updatePatientService(id, patch)
  }, [])

  const deletePatient = useCallback(async (id: string) => {
    await deletePatientService(id)
  }, [])

  return { patients, loading, addPatient, updatePatient, deletePatient, refresh }
}

export function usePatient(patientId: string | undefined) {
  const { patients, updatePatient, loading } = usePatients()
  const patient = patients.find((p) => p.id === patientId)
  return { patient, patients, updatePatient, loading }
}

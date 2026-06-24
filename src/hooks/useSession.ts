import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { localStore, genId } from '../lib/localStore'
import type { Session } from '../lib/types'

// Hook análogo a usePatients pero para el expediente clínico (sesiones).
export function useSessions(patientId?: string) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    if (isSupabaseConfigured) {
      let query = supabase.from('sessions').select('*').order('date', { ascending: false })
      if (patientId) query = query.eq('patient_id', patientId)
      const { data, error } = await query
      if (!error && data) {
        setSessions(data as Session[])
        setLoading(false)
        return
      }
    }
    const all = localStore.getSessions()
    const filtered = patientId ? all.filter((s) => s.patient_id === patientId) : all
    setSessions(filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    setLoading(false)
  }, [patientId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addSession = useCallback(
    async (session: Omit<Session, 'id'>) => {
      const newSession: Session = { ...session, id: genId('ses') }
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('sessions').insert(newSession)
        if (!error) {
          await refresh()
          return newSession
        }
      }
      const all = localStore.getSessions()
      const updated = [newSession, ...all]
      localStore.setSessions(updated)
      await refresh()
      return newSession
    },
    [refresh],
  )

  return { sessions, loading, addSession, refresh }
}

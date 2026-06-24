import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { localStore, genId } from '../lib/localStore'
import type { Exercise, TestResult, DiaryEntry, Character, ExerciseType } from '../lib/types'

export function useExercises(patientId?: string) {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    if (isSupabaseConfigured) {
      let query = supabase.from('exercises').select('*')
      if (patientId) query = query.eq('patient_id', patientId)
      const { data, error } = await query
      if (!error && data) {
        setExercises(data as Exercise[])
        setLoading(false)
        return
      }
    }
    const all = localStore.getExercises()
    setExercises(patientId ? all.filter((e) => e.patient_id === patientId) : all)
    setLoading(false)
  }, [patientId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const upsertExercise = useCallback(
    async (pid: string, type: ExerciseType, data: any, shared?: boolean) => {
      const all = localStore.getExercises()
      const existingIdx = all.findIndex((e) => e.patient_id === pid && e.type === type)
      if (existingIdx >= 0) {
        all[existingIdx] = {
          ...all[existingIdx],
          data,
          shared_with_patient: shared ?? all[existingIdx].shared_with_patient,
        }
      } else {
        all.push({
          id: genId('ex'),
          patient_id: pid,
          type,
          data,
          shared_with_patient: shared ?? true,
          created_at: new Date().toISOString(),
        })
      }
      localStore.setExercises(all)
      if (isSupabaseConfigured) {
        await supabase.from('exercises').upsert(all.filter((e) => e.patient_id === pid))
      }
      await refresh()
    },
    [refresh],
  )

  const toggleShared = useCallback(
    async (exerciseId: string, shared: boolean) => {
      const all = localStore.getExercises()
      const updated = all.map((e) => (e.id === exerciseId ? { ...e, shared_with_patient: shared } : e))
      localStore.setExercises(updated)
      if (isSupabaseConfigured) {
        await supabase.from('exercises').update({ shared_with_patient: shared }).eq('id', exerciseId)
      }
      await refresh()
    },
    [refresh],
  )

  return { exercises, loading, upsertExercise, toggleShared, refresh }
}

export function useTestResults(patientId?: string) {
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    if (isSupabaseConfigured) {
      let query = supabase.from('test_results').select('*').order('date', { ascending: true })
      if (patientId) query = query.eq('patient_id', patientId)
      const { data, error } = await query
      if (!error && data) {
        setResults(data as TestResult[])
        setLoading(false)
        return
      }
    }
    const all = localStore.getTestResults()
    const filtered = patientId ? all.filter((t) => t.patient_id === patientId) : all
    setResults(filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
    setLoading(false)
  }, [patientId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addResult = useCallback(
    async (result: Omit<TestResult, 'id'>) => {
      const newResult: TestResult = { ...result, id: genId('tr') }
      const all = localStore.getTestResults()
      localStore.setTestResults([...all, newResult])
      if (isSupabaseConfigured) {
        await supabase.from('test_results').insert(newResult)
      }
      await refresh()
      return newResult
    },
    [refresh],
  )

  return { results, loading, addResult, refresh }
}

export function useDiary(patientId?: string) {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    if (isSupabaseConfigured) {
      let query = supabase.from('diary_entries').select('*').order('date', { ascending: false })
      if (patientId) query = query.eq('patient_id', patientId)
      const { data, error } = await query
      if (!error && data) {
        setEntries(data as DiaryEntry[])
        setLoading(false)
        return
      }
    }
    const all = localStore.getDiaryEntries()
    const filtered = patientId ? all.filter((d) => d.patient_id === patientId) : all
    setEntries(filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    setLoading(false)
  }, [patientId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addEntry = useCallback(
    async (entry: Omit<DiaryEntry, 'id'>) => {
      const newEntry: DiaryEntry = { ...entry, id: genId('de') }
      const all = localStore.getDiaryEntries()
      localStore.setDiaryEntries([newEntry, ...all])
      if (isSupabaseConfigured) {
        await supabase.from('diary_entries').insert(newEntry)
      }
      await refresh()
      return newEntry
    },
    [refresh],
  )

  const toggleShared = useCallback(
    async (entryId: string, shared: boolean) => {
      const all = localStore.getDiaryEntries()
      const updated = all.map((d) => (d.id === entryId ? { ...d, shared } : d))
      localStore.setDiaryEntries(updated)
      if (isSupabaseConfigured) {
        await supabase.from('diary_entries').update({ shared }).eq('id', entryId)
      }
      await refresh()
    },
    [refresh],
  )

  return { entries, loading, addEntry, toggleShared, refresh }
}

export function useCharacters(patientId?: string) {
  const [characters, setCharacters] = useState<Character[]>([])

  const refresh = useCallback(async () => {
    const all = localStore.getCharacters()
    setCharacters(patientId ? all.filter((c) => c.patient_id === patientId) : all)
  }, [patientId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const saveCharacter = useCallback(
    async (character: Character) => {
      const all = localStore.getCharacters()
      const idx = all.findIndex((c) => c.patient_id === character.patient_id)
      if (idx >= 0) all[idx] = character
      else all.push(character)
      localStore.setCharacters(all)
      await refresh()
    },
    [refresh],
  )

  return { characters, saveCharacter, refresh }
}

// Servicio CRUD unificado: Firebase Firestore → Supabase → localStorage fallback
// Los hooks existentes (usePatient, useSession, useClinicalData) usarán este servicio.
import { db } from '../lib/firebase'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { localStore, genId } from '../lib/localStore'
import { DEMO_PSYCHOLOGIST_ID } from '../data/mockPatients'
import type { Patient, Session, Exercise, ExerciseType, TestResult, DiaryEntry, Character } from '../lib/types'
import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot,
} from 'firebase/firestore'

const USE_FIREBASE = !!import.meta.env.VITE_FIREBASE_API_KEY

// ─── HELPERS ─────────────────────────────────────
function fbOk() {
  if (USE_FIREBASE) return true
  return false
}

function getPsyId() {
  return DEMO_PSYCHOLOGIST_ID
}

// ─── PATIENTS ────────────────────────────────────
export async function getPatients(): Promise<Patient[]> {
  if (fbOk()) {
    const snap = await getDocs(query(collection(db, 'patients'), orderBy('created_at', 'desc')))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Patient)
  }
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('patients').select('*').order('created_at', { ascending: false })
    if (!error && data) return data as Patient[]
  }
  return localStore.getPatients()
}

export function subscribePatients(callback: (patients: Patient[]) => void) {
  if (fbOk()) {
    return onSnapshot(query(collection(db, 'patients'), orderBy('created_at', 'desc')), (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Patient))
    })
  }
  callback(localStore.getPatients())
  return () => {}
}

export async function addPatient(p: Omit<Patient, 'id' | 'created_at'>): Promise<Patient> {
  const payload = { ...p, psychologist_id: getPsyId(), created_at: new Date().toISOString() }
  if (fbOk()) {
    const ref = await addDoc(collection(db, 'patients'), payload)
    return { id: ref.id, ...payload } as Patient
  }
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('patients').insert(payload).select().single()
    if (!error && data) return data as Patient
  }
  const current = localStore.getPatients()
  const newP = { ...payload, id: crypto.randomUUID() } as Patient
  localStore.setPatients([newP, ...current])
  return newP
}

export async function updatePatient(id: string, patch: Partial<Patient>) {
  if (fbOk()) {
    await updateDoc(doc(db, 'patients', id), patch)
    return
  }
  if (isSupabaseConfigured) {
    await supabase.from('patients').update(patch).eq('id', id)
    return
  }
  const current = localStore.getPatients()
  localStore.setPatients(current.map((p) => (p.id === id ? { ...p, ...patch } : p)))
}

export async function deletePatient(id: string) {
  if (fbOk()) {
    await deleteDoc(doc(db, 'patients', id))
    return
  }
  if (isSupabaseConfigured) {
    await supabase.from('patients').delete().eq('id', id)
    return
  }
  const current = localStore.getPatients()
  localStore.setPatients(current.filter((p) => p.id !== id))
}

// ─── SESSIONS ────────────────────────────────────
export async function getSessions(patientId?: string): Promise<Session[]> {
  if (fbOk()) {
    let q = query(collection(db, 'sessions'), orderBy('date', 'desc'))
    if (patientId) q = query(q, where('patient_id', '==', patientId))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Session)
  }
  if (isSupabaseConfigured) {
    let q = supabase.from('sessions').select('*').order('date', { ascending: false })
    if (patientId) q = q.eq('patient_id', patientId)
    const { data, error } = await q
    if (!error && data) return data as Session[]
  }
  const all = localStore.getSessions()
  return patientId ? all.filter((s) => s.patient_id === patientId) : all
}

export function subscribeSessions(patientId: string | undefined, callback: (sessions: Session[]) => void) {
  if (fbOk()) {
    let q = query(collection(db, 'sessions'), orderBy('date', 'desc'))
    if (patientId) q = query(q, where('patient_id', '==', patientId))
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Session))
    })
  }
  const all = localStore.getSessions()
  callback(patientId ? all.filter((s) => s.patient_id === patientId) : all)
  return () => {}
}

export async function addSession(s: Omit<Session, 'id' | 'created_at'>): Promise<Session> {
  const payload = { ...s, created_at: new Date().toISOString() }
  if (fbOk()) {
    const ref = await addDoc(collection(db, 'sessions'), payload)
    return { id: ref.id, ...payload } as Session
  }
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('sessions').insert(payload).select().single()
    if (!error && data) return data as Session
  }
  const current = localStore.getSessions()
  const newS = { ...payload, id: genId('ses') } as Session
  localStore.setSessions([newS, ...current])
  return newS
}

// ─── EXERCISES ───────────────────────────────────
export async function getExercises(patientId?: string): Promise<Exercise[]> {
  if (fbOk()) {
    let q = query(collection(db, 'exercises'), orderBy('created_at', 'desc'))
    if (patientId) q = query(q, where('patient_id', '==', patientId))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Exercise)
  }
  if (isSupabaseConfigured) {
    let q = supabase.from('exercises').select('*').order('created_at', { ascending: false })
    if (patientId) q = q.eq('patient_id', patientId)
    const { data, error } = await q
    if (!error && data) return data as Exercise[]
  }
  const all = localStore.getExercises()
  return patientId ? all.filter((e) => e.patient_id === patientId) : all
}

export async function upsertExercise(patientId: string, type: ExerciseType, data: object, sharedWithPatient = false): Promise<void> {
  if (fbOk()) {
    await addDoc(collection(db, 'exercises'), { patient_id: patientId, type, data, shared_with_patient: sharedWithPatient, created_at: new Date().toISOString() })
    return
  }
  if (isSupabaseConfigured) {
    await supabase.from('exercises').insert({ patient_id: patientId, type, data, shared_with_patient: sharedWithPatient })
    return
  }
  const all = localStore.getExercises()
  const existing = all.find((e) => e.patient_id === patientId && e.type === type)
  if (existing) {
    localStore.setExercises(all.map((e) => (e.id === existing.id ? { ...e, data, shared_with_patient: sharedWithPatient } : e)))
  } else {
    localStore.setExercises([{ id: genId('ex'), patient_id: patientId, type, data, shared_with_patient: sharedWithPatient, created_at: new Date().toISOString() }, ...all])
  }
}

// ─── TEST RESULTS ────────────────────────────────
export async function getTestResults(patientId?: string): Promise<TestResult[]> {
  if (fbOk()) {
    let q = query(collection(db, 'test_results'), orderBy('date', 'desc'))
    if (patientId) q = query(q, where('patient_id', '==', patientId))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TestResult)
  }
  if (isSupabaseConfigured) {
    let q = supabase.from('test_results').select('*').order('date', { ascending: false })
    if (patientId) q = q.eq('patient_id', patientId)
    const { data, error } = await q
    if (!error && data) return data as TestResult[]
  }
  const all = localStore.getTestResults()
  return patientId ? all.filter((t) => t.patient_id === patientId) : all
}

export async function addTestResult(r: Omit<TestResult, 'id'>): Promise<TestResult> {
  if (fbOk()) {
    const ref = await addDoc(collection(db, 'test_results'), r)
    return { id: ref.id, ...r } as TestResult
  }
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('test_results').insert(r).select().single()
    if (!error && data) return data as TestResult
  }
  const current = localStore.getTestResults()
  const newR = { ...r, id: genId('tr') } as TestResult
  localStore.setTestResults([newR, ...current])
  return newR
}

// ─── DIARY ENTRIES ───────────────────────────────
export async function getDiaryEntries(patientId?: string): Promise<DiaryEntry[]> {
  if (fbOk()) {
    let q = query(collection(db, 'diary_entries'), orderBy('date', 'desc'))
    if (patientId) q = query(q, where('patient_id', '==', patientId))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as DiaryEntry)
  }
  if (isSupabaseConfigured) {
    let q = supabase.from('diary_entries').select('*').order('date', { ascending: false })
    if (patientId) q = q.eq('patient_id', patientId)
    const { data, error } = await q
    if (!error && data) return data as DiaryEntry[]
  }
  const all = localStore.getDiaryEntries()
  return patientId ? all.filter((e) => e.patient_id === patientId) : all
}

export async function addDiaryEntry(e: Omit<DiaryEntry, 'id'>): Promise<DiaryEntry> {
  if (fbOk()) {
    const ref = await addDoc(collection(db, 'diary_entries'), e)
    return { id: ref.id, ...e } as DiaryEntry
  }
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('diary_entries').insert(e).select().single()
    if (!error && data) return data as DiaryEntry
  }
  const current = localStore.getDiaryEntries()
  const newE = { ...e, id: genId('de') } as DiaryEntry
  localStore.setDiaryEntries([newE, ...current])
  return newE
}

export async function toggleDiaryShared(id: string, shared: boolean) {
  if (fbOk()) {
    await updateDoc(doc(db, 'diary_entries', id), { shared })
    return
  }
  if (isSupabaseConfigured) {
    await supabase.from('diary_entries').update({ shared }).eq('id', id)
    return
  }
  const all = localStore.getDiaryEntries()
  localStore.setDiaryEntries(all.map((e) => (e.id === id ? { ...e, shared } : e)))
}

// ─── CHARACTERS ──────────────────────────────────
export async function getCharacters(patientId?: string): Promise<Character[]> {
  if (fbOk()) {
    let q = query(collection(db, 'characters'))
    if (patientId) q = query(q, where('patient_id', '==', patientId))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Character)
  }
  if (isSupabaseConfigured) {
    let q = supabase.from('characters').select('*')
    if (patientId) q = q.eq('patient_id', patientId)
    const { data, error } = await q
    if (!error && data) return data as Character[]
  }
  return localStore.getCharacters().filter((c) => !patientId || c.patient_id === patientId)
}

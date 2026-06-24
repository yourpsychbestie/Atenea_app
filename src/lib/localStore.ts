// Store local simple basado en localStorage, usado como fallback de "modo demo"
// cuando Supabase no está configurado. Persiste colecciones completas como JSON.
import type {
  Patient,
  Session,
  Exercise,
  TestResult,
  DiaryEntry,
  Character,
} from './types'

const KEYS = {
  patients: 'zorrito_patients',
  sessions: 'zorrito_sessions',
  exercises: 'zorrito_exercises',
  testResults: 'zorrito_test_results',
  diaryEntries: 'zorrito_diary_entries',
  characters: 'zorrito_characters',
  quickNote: 'zorrito_quick_note',
} as const

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage no disponible (modo privado, etc.) — silenciosamente ignoramos
  }
}

// Versión del esquema de datos. Cambiarla limpia automáticamente el localStorage
// al recargar la app (útil para borrar datos de demo de sesiones anteriores).
const DATA_VERSION = '2'
const VERSION_KEY = 'atenea_data_version'

function initStore() {
  if (localStorage.getItem(VERSION_KEY) !== DATA_VERSION) {
    // Limpiar todas las claves de datos (demo o versiones anteriores)
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
    localStorage.setItem(VERSION_KEY, DATA_VERSION)
  }
}

initStore()

export const localStore = {
  getPatients: (): Patient[] => load(KEYS.patients, []),
  setPatients: (v: Patient[]) => save(KEYS.patients, v),

  getSessions: (): Session[] => load(KEYS.sessions, []),
  setSessions: (v: Session[]) => save(KEYS.sessions, v),

  getExercises: (): Exercise[] => load(KEYS.exercises, []),
  setExercises: (v: Exercise[]) => save(KEYS.exercises, v),

  getTestResults: (): TestResult[] => load(KEYS.testResults, []),
  setTestResults: (v: TestResult[]) => save(KEYS.testResults, v),

  getDiaryEntries: (): DiaryEntry[] => load(KEYS.diaryEntries, []),
  setDiaryEntries: (v: DiaryEntry[]) => save(KEYS.diaryEntries, v),

  getCharacters: (): Character[] => load(KEYS.characters, []),
  setCharacters: (v: Character[]) => save(KEYS.characters, v),

  getQuickNote: (): string => load(KEYS.quickNote, ''),
  setQuickNote: (v: string) => save(KEYS.quickNote, v),
}

export function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`
}

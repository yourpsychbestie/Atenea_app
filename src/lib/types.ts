// Tipos centrales del dominio clínico de Zorrito.
// Se usa `any` pragmáticamente en campos jsonb para no sobre-modelar datos flexibles.

export interface Patient {
  id: string
  psychologist_id: string
  alias: string
  emoji: string
  created_at: string
  motivo_consulta?: string
  enfoque?: string
  diagnostico_cie10?: string
  tags?: string[]
}

export interface Session {
  id: string
  patient_id: string
  date: string
  duration_min: number
  summary: string
  field_notes: string
  interventions: string
  homework: string
  mood_score: number // 1-10
  insight_level: number // 1-5
  tags: string[]
}

export interface Exercise {
  id: string
  patient_id: string
  type: ExerciseType
  data: any
  shared_with_patient: boolean
  created_at?: string
}

export type ExerciseType =
  | 'externalizacion'
  | 'tabla_etiquetas'
  | 'respiracion'
  | 'carta_compasiva'
  | 'mapa_valores'
  | 'bienvenida_yo'

export interface TestResult {
  id: string
  patient_id: string
  test_type: TestType
  score: number
  severity: string
  answers: any
  date: string
}

export type TestType = 'PHQ-9' | 'GAD-7' | 'PCL-5' | 'BDI-II' | 'DASS-21'

export interface DiaryEntry {
  id: string
  patient_id: string
  content: string
  date: string
  shared: boolean
  prompt?: string
}

export interface Character {
  id: string
  patient_id: string
  name: string
  emoji: string
  description: string
  voice_quote: string
}

export interface ChatMessage {
  role: 'patient' | 'character'
  content: string
}

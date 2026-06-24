-- Zorrito — Supabase Schema (init.sql)
-- Ejecutar esto en el SQL Editor de Supabase Dashboard

-- PACIENTES
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psychologist_id UUID NOT NULL,
  alias TEXT NOT NULL,
  emoji TEXT DEFAULT '👤',
  motivo_consulta TEXT DEFAULT '',
  enfoque TEXT DEFAULT 'TCC',
  diagnostico_cie10 TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY patients_owner ON patients
  FOR ALL USING (psychologist_id = auth.uid());

-- SESIONES CLÍNICAS
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  date TIMESTAMPTZ DEFAULT NOW(),
  duration_min INT CHECK (duration_min >= 5 AND duration_min <= 180),
  summary TEXT DEFAULT '',
  field_notes TEXT DEFAULT '',
  interventions TEXT DEFAULT '',
  homework TEXT DEFAULT '',
  mood_score INT CHECK (mood_score BETWEEN 1 AND 10),
  insight_level INT CHECK (insight_level BETWEEN 1 AND 5),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY sessions_owner ON sessions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = sessions.patient_id AND patients.psychologist_id = auth.uid())
  );

-- EJERCICIOS TERAPÉUTICOS
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  shared_with_patient BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY exercises_owner ON exercises
  FOR ALL USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = exercises.patient_id AND patients.psychologist_id = auth.uid())
  );
CREATE POLICY exercises_patient ON exercises
  FOR SELECT USING (shared_with_patient = true);

-- RESULTADOS DE TESTS
CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL,
  score INT,
  severity TEXT,
  answers JSONB DEFAULT '{}',
  date TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY test_results_owner ON test_results
  FOR ALL USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = test_results.patient_id AND patients.psychologist_id = auth.uid())
  );

-- ENTRADAS DE DIARIO
CREATE TABLE diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  shared BOOLEAN DEFAULT false,
  prompt TEXT
);

ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY diary_entries_owner ON diary_entries
  FOR ALL USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = diary_entries.patient_id AND patients.psychologist_id = auth.uid())
  );

-- PERSONAJES DE EXTERNALIZACIÓN
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  emoji TEXT,
  description TEXT,
  voice_quote TEXT
);

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY characters_owner ON characters
  FOR ALL USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = characters.patient_id AND patients.psychologist_id = auth.uid())
  );

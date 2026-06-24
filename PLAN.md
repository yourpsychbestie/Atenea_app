# Zorrito - Plan de Construcción

## Contexto Existente
- Vite + React 19 + TypeScript + TailwindCSS 3
- Types en `src/lib/types.ts`: Patient, Session, Exercise, TestResult, DiaryEntry, Character, ChatMessage
- Hooks en `src/hooks/`: usePatients, usePatient, useSessions, useExercises, useTestResults, useDiary, useCharacters
- Contexto en `src/context/PatientContext.tsx`: PatientProvider, useActivePatient
- Layout existente: Topbar, Sidebar, Toast, FoxLogo, EmptyState, PatientNav
- Ejercicios existentes: Externalizacion.tsx, Respiracion.tsx
- Mocks ricos en `src/data/mockPatients.ts`
- Almacenamiento local: `src/data/localStore.ts` (seeded con mocks si vacío)
- Supabase fallback a localStorage si no hay credenciales

## Colores Tailwind (ya definidos)
fox #E8733A, fox-light #FDEEE6, fox-dark #C45A24
lav #A78BFA, lav-light #EDE9FE, lav-dark #7C5FC7
mint #34D399, mint-light #D1FAE5
peach #FDBA74, pink #F9A8D4, cream #FFF8F5

## Clases CSS ya definidas en index.css
.card, .btn-primary, .btn-secondary, .pill

## Estructura de Carpetas Requerida
```
src/components/psy/ (Dashboard, Expediente, Ejercicios, Pruebas, Formacion, NuevaSesion)
src/components/patient/ (PatHome, PatEjercicios, PatPruebas, PatDiario)
src/components/exercises/ (ya existen Externalizacion, Respiracion; crear TablaEtiquetas, CartaCompasiva, MapaValores, BienvenidaYo)
src/components/tests/ (PHQ9, GAD7, PCL5, BDIII, DASS21)
supabase/
```

---

## SECCIÓN A: App.tsx + Routing + Vistas Psicólogo

### App.tsx
- BrowserRouter (sin SSR, así que funciona en dev local)
- Layout dos columnas para /psy/*: Sidebar izquierda + contenido derecho
- Layout para /patient/*: PatientNav arriba + contenido debajo
- Envolver todo en PatientProvider + ToastProvider
- Rutas:
  - /psy/dashboard -> Dashboard
  - /psy/expediente -> Expediente (lista)
  - /psy/expediente/:patientId -> Expediente (detalle)
  - /psy/nueva-sesion/:patientId -> NuevaSesion
  - /psy/ejercicios -> EjerciciosHub
  - /psy/ejercicios/:type/:patientId -> <ExerciseComponent/>
  - /psy/pruebas -> PruebasHub
  - /psy/pruebas/:testType/:patientId -> <TestComponent/>
  - /psy/formacion -> Formacion
  - /patient/home -> PatHome
  - /patient/ejercicios -> PatEjercicios
  - /patient/pruebas -> PatPruebas
  - /patient/diario -> PatDiario
  - / -> redirige a /psy/dashboard

### Dashboard.tsx
- Métricas en cards: total pacientes, sesiones esta semana (contar de mockSessions date > hoy-7), promedio mood_score de todas las sesiones.
- Timeline: sesiones recientes ordenadas. Card por sesión: emoji paciente, alias, fecha formateada (DD/MM/YYYY), resumen corto, mood Score indicator (emoji)
- Quick Note: textarea persistente en localStorage (usa localStore.getQuickNote, setQuickNote)
- Usa useSessions, usePatients

### Expediente.tsx
- Modo lista: buscador por alias, cards de pacientes con emoji, alias, motivo, enfoque, diagnóstico, tags como pills.
- Modo detalle: sección editable con inputs para motivo_consulta, enfoque (select: TCC, ACT, EMDR, Narrativa, DBT, Gestalt), diagnostico_cie10, tags (input con Enter para agregar, X para quitar). Usa usePatient.updatePatient.
- Lista de sesiones del paciente (useSessions con patientId). Cada sesión muestra fecha, duración, resumen, mood_slider, insight_level.
- Botón "Nueva sesión" -> navega a /psy/nueva-sesion/:patientId
- Botón "Volver" cuando está en detalle.

### NuevaSesion.tsx
- Formulario: date (input type="date"), duration_min (number), summary (textarea), field_notes (textarea), interventions (textarea), homework (textarea).
- Sliders: mood_score (1-10, mostrar valor), insight_level (1-5, mostrar valor).
- Tags: input que crea pill al presionar Enter. Cada tag es un pill con X para eliminar.
- "Guardar sesión" -> useSessions.addSession. Toast de éxito. Redirige a /psy/expediente/:patientId.

### EjerciciosHub.tsx
- Grid de 6 cards: Externalización 🎭, Tabla de Etiquetas 🏷️, Respiración 🌬️, Carta Compasiva 💌, Mapa de Valores 🧭, Bienvenida del Yo 🪞.
- Cada card: emoji, nombre, descripción breve.
- Clic -> selecciona paciente en modal/dropdown (o usa el de la URL) y navega a /psy/ejercicios/:type/:patientId.

### PruebasHub.tsx
- Grid de 5 cards: PHQ-9, GAD-7, PCL-5, BDI-II, DASS-21. Cada card muestra nombre y descripción breve.
- Selector de paciente.
- Clic -> navega a /psy/pruebas/:testType/:patientId.
- Debajo: gráfica Recharts (ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip) con historial de test_results del paciente seleccionado. X=fecha, Y=score. Filtro por test_type con tabs.

### Formacion.tsx
- Grid de cards. Use trainingResources del mock.
- Filtro por tag: muestra tags únicos de los pacientes (usePatients). Si se selecciona un tag, filtra resources que contengan ese tag.
- Card: título, tipo (badge), duración, tags pills.

---

## SECCIÓN B: Vistas Paciente + Ejercicios + Cuestionarios

### PatHome.tsx
- Card de mood check-in: 5 emojis grandes clickeables 😔 😐 🙂 😊 😄.
- Al clic: crea diary entry con `useDiary.addEntry({ content: "Mood: 😊", date: now, shared: true })`. Confetti con canvas-confetti.
- Card "Tu personaje": muestra character del paciente si existe, con emoji, nombre, voice_quote.
- Card "Próxima tarea": última homework de session reciente.
- Mini cards con conteos: días con check-in esta semana, ejercicios compartidos, tests completados.

### PatEjercicios.tsx
- Lista de ejercicios del paciente activo donde shared_with_patient=true. Usa useExercises.
- Card por ejercicio: muestra tipo, fecha, shared badge.
- Clic abre el componente correspondiente en modo "ver/compartir". Para ejercicios que son solo datos (tabla_etiquetas, mapa_valores) muestra visualización.

### PatPruebas.tsx
- Lista de test_results del paciente activo. Card por test: test_type, score, severity, fecha formateada.
- Badge de severity colorido (rojo severo, naranja moderado, verde leve).

### PatDiario.tsx
- Lista de diary_entries ordenadas por fecha. Card con fecha, contenido, badge "Compartido" si shared=true.
- Formulario nueva entrada: textarea grande, checkbox "Compartir con mi psicólogo", botón Guardar.
- Botón para cambiar shared en entries existentes.

### TablaEtiquetas.tsx
- Lista de pills draggables (rojo: bg-pink/20 text-pink). @dnd-kit/core + @dnd-kit/sortable para reordenar.
- Input + botón "Agregar pensamiento" crea nueva pill.
- Doble clic en pill abre panel con pregunta socrática: "¿Qué evidencia real tienes de que esto es 100% cierto? ¿Qué le dirías a un amigo/a con este pensamiento?"
- Textarea para escribir reformulación. Al guardar el pill cambia a verde (bg-mint-light text-emerald-700).
- Guarda todo en useExercises.upsertExercise type 'tabla_etiquetas' con data: { pills: [{ id, text, reframe, restructured: bool }] }.

### CartaCompasiva.tsx
- Textarea grande editable, título "Carta compasiva a mí mismo/a". Botón Guardar. Visualización del texto guardado. Más abajo un área de reflexión: "¿Qué notaste al escribirte con ternura?"
- Guarda en useExercises.upsertExercise type 'carta_compasiva'.

### MapaValores.tsx
- Grid 2x4 de dominios ACT: Familia, Relaciones, Salud, Trabajo, Ocio, Creatividad, Comunidad, Espiritualidad.
- Cada dominio = card clickeable. Clic marca/desmarca. Máximo 3 pueden estar marcados a full opacity; los demás van bajando opacidad.
- Barra "Tu Top 3" muestra los seleccionados.
- Guarda en useExercises.upsertExercise type 'mapa_valores'.

### BienvenidaYo.tsx
- Mensaje introductorio sobre auto-compasión y aceptación. Texto cálido.
- FoxLogo grande (size=120).
- Botón "Comenzar": al clic, canvas-confetti gold/peach. Muestra mensaje de éxito.
- Guarda en useExercises.upsertExercise type 'bienvenida_yo'.

### PHQ9.tsx
- 9 preguntas, opciones 0-3 (Nunca, Varios días, Más de la mitad, Casi todos los días).
- Score 0-27. Severity: 0-4 mínima, 5-9 leve, 10-14 moderada, 15-19 moderadamente severa, 20-27 severa.
- Botón Finalizar muestra resultado. Botón Guardar -> useTestResults.addResult.
- Confetti.

### GAD7.tsx
- 7 preguntas, opciones 0-3. Score 0-21. Severity: 0-4 mínima, 5-9 leve, 10-14 moderada, 15-21 severa.
- Mismo patrón visual.

### PCL5.tsx
- 20 preguntas, opciones 0-4 (Nada, Un poco, Moderadamente, Bastante, Extremadamente). Score 0-80.
- Severity: 0-31 mínima, 31-33 moderada, 33-49 moderadamente severa, 49-80 severa.

### BDIII.tsx
- 21 preguntas, opciones 0-3. Score 0-63.
- Severity: 0-13 mínima, 14-19 leve, 20-28 moderada, 29-63 severa.

### DASS21.tsx
- 21 preguntas, opciones 0-3.
- Subescalas: depresión ítems [3,5,10,13,16,17,21], ansiedad [2,4,7,9,15,19,20], estrés [1,6,8,11,12,14,18].
- Score subescala = suma * 2.
- Severity: depresión (0-9 normal, 10-13 leve, 14-20 mod, 21-27 severa, 28+ extrema), ansiedad (0-7 normal, 8-9 leve, 10-14 mod, 15-19 severa, 20+ extrema), estrés (0-14 normal, 15-18 leve, 19-25 mod, 26-33 severa, 34+ extrema).

---

## SECCIÓN C: SQL + README

### supabase/init.sql
Todas las tablas + triggers + RLS.

```sql
-- PACIENTES
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psychologist_id UUID NOT NULL,
  alias TEXT NOT NULL,
  emoji TEXT,
  motivo_consulta TEXT,
  enfoque TEXT,
  diagnostico_cie10 TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY patients_owner ON patients FOR ALL USING (psychologist_id = auth.uid());

-- SESIONES
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  date TIMESTAMPTZ,
  duration_min INT,
  summary TEXT,
  field_notes TEXT,
  interventions TEXT,
  homework TEXT,
  mood_score INT CHECK (mood_score BETWEEN 1 AND 10),
  insight_level INT CHECK (insight_level BETWEEN 1 AND 5),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY sessions_owner ON sessions FOR ALL USING (
  EXISTS (SELECT 1 FROM patients WHERE patients.id = sessions.patient_id AND patients.psychologist_id = auth.uid())
);

-- EJERCICIOS
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  shared_with_patient BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY exercises_owner ON exercises FOR ALL USING (
  EXISTS (SELECT 1 FROM patients WHERE patients.id = exercises.patient_id AND patients.psychologist_id = auth.uid())
);
CREATE POLICY exercises_patient ON exercises FOR SELECT USING (shared_with_patient = true);

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
CREATE POLICY test_results_owner ON test_results FOR ALL USING (
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
CREATE POLICY diary_entries_owner ON diary_entries FOR ALL USING (
  EXISTS (SELECT 1 FROM patients WHERE patients.id = diary_entries.patient_id AND patients.psychologist_id = auth.uid())
);
CREATE POLICY diary_entries_patient ON diary_entries FOR SELECT USING (
  EXISTS (SELECT 1 FROM patients WHERE patients.id = diary_entries.patient_id)
);

-- PERSONAJES
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  emoji TEXT,
  description TEXT,
  voice_quote TEXT
);
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY characters_owner ON characters FOR ALL USING (
  EXISTS (SELECT 1 FROM patients WHERE patients.id = characters.patient_id AND patients.psychologist_id = auth.uid())
);
CREATE POLICY characters_patient ON characters FOR SELECT USING (
  EXISTS (SELECT 1 FROM patients WHERE patients.id = characters.patient_id)
);
```

### README.md
- Título: Zorrito · Psicología Clínica
- Descripción: App kawaii para psicólogos millennials
- Requisitos: Node 20+, npm, cuenta Supabase (opcional para demo)
- Setup paso a paso
- Crear .env a partir de .env.example
- Conexión Supabase y SQL
- npm run dev
- Screenshots placeholder

---

## REGLAS GLOBALES
1. Usa SOLO colores y clases definidos en tailwind.config.ts e index.css.
2. rounded-2xl para cards/contenedores, rounded-full para pills/botones.
3. NO uses CSS inline arbitrario. Solo para valores dinámicos de animación.
4. Usa los hooks existentes (usePatients, useSessions, etc.).
5. Todos los componentes export default function.
6. TypeScript estricto. Evita `any`.
7. EmptyState para listas vacías.
8. Toast para feedback de acciones (usa useToast del Toast.tsx provider existente).
9. NO modifiques archivos existentes salvo App.tsx si necesitas ajustar imports.

# 🦊 Zorrito · Psicología Clínica

> App de psicología clínica para psicólogos millennials con estética kawaii.

## Stack

- ⚡ Vite + React 19 + TypeScript
- 🎨 TailwindCSS 3
- 📊 Recharts
- 🔮 Supabase (Auth + Base de datos)
- 🤖 Anthropic Claude API (externalización)
- 🧩 @dnd-kit

## Requisitos

- Node.js 20+
- npm
- Cuenta de [Supabase](https://supabase.com) (opcional para demo con datos locales)
- Clave de API de Anthropic (opcional para personaje de externalización)

## Setup

1. Clona el repo e instala dependencias:

```bash
cd Zorrito
npm install
```

2. Crea tu fichero de entorno:

```bash
cp .env.example .env
```

3. Rellena las variables:

| Variable | Descripción |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima (public) de Supabase |
| `VITE_ANTHROPIC_API_KEY` | Clave de Anthropic para el ejercicio de externalización |

4. En tu dashboard de Supabase, ejecuta el schema completo que está en [`supabase/init.sql`](./supabase/init.sql).

5. Corre en modo desarrollo:

```bash
npm run dev
```

Abre tu navegador en `http://localhost:5173/`.

## Modo demo (sin Supabase)

Si no configuras credenciales de Supabase, la app funciona en modo demo con datos locales almacenados en `localStorage`. Incluye 4 pacientes de ejemplo con sesiones, ejercicios, personajes y resultados de pruebas.

## Estructura

```
src/
  components/
    layout/       # Topbar, Sidebar, Toast, FoxLogo, PatientNav
    psy/          # Vistas del psicólogo
    patient/      # Vistas del paciente
    exercises/    # Ejercicios terapéuticos
    tests/        # Cuestionarios clínicos
  hooks/          # usePatients, useSessions, useClinicalData
  lib/            # types, supabase, anthropic
  data/           # Datos mock
  context/        # PatientContext
```

## Features

### Vista Psicólogo
- Dashboard con métricas y timeline
- Expedientes clínicos con edición inline
- Registro de nuevas sesiones
- Ejercicios terapéuticos interactivos
- 5 cuestionarios clínicos con historial gráfico
- Formación filtrada por temas activos

### Vista Paciente
- Mood check-in diario con emojis
- Chat de externalización con personaje (Claude API)
- Ejercicios compartidos por el psicólogo
- Tablero de etiquetas arrastrable
- Diario privado / compartido
- Cuestionarios asignados

## Licencia

MIT

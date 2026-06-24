import { useMemo, useState } from 'react'
import { usePatients } from '../../hooks/usePatient'
import { useCourses } from '../../hooks/useCourses'

const trainingResources = [
  {
    id: 'res-001',
    title: 'Manejo de ansiedad generalizada con TCC de tercera ola',
    type: 'Curso',
    tags: ['ansiedad', 'estrés laboral'],
    duration: '3 horas',
    url: '#',
  },
  {
    id: 'res-002',
    title: 'Intervenciones breves para insomnio en adultos',
    type: 'Artículo',
    tags: ['insomnio', 'ansiedad'],
    duration: '15 min',
    url: '#',
  },
  {
    id: 'res-003',
    title: 'Duelo y pérdida: acompañamiento desde ACT',
    type: 'Curso',
    tags: ['duelo', 'depresión'],
    duration: '2.5 horas',
    url: '#',
  },
  {
    id: 'res-004',
    title: 'Reconstruyendo la autoestima tras una ruptura',
    type: 'Artículo',
    tags: ['autoestima', 'depresión', 'duelo'],
    duration: '12 min',
    url: '#',
  },
  {
    id: 'res-005',
    title: 'EMDR aplicado a trauma por accidentes',
    type: 'Curso',
    tags: ['trauma'],
    duration: '4 horas',
    url: '#',
  },
  {
    id: 'res-006',
    title: 'Trabajando con evitación experiencial',
    type: 'Artículo',
    tags: ['trauma', 'ansiedad'],
    duration: '10 min',
    url: '#',
  },
  {
    id: 'res-007',
    title: 'Perfeccionismo clínico: del crítico interno a la autocompasión',
    type: 'Curso',
    tags: ['perfeccionismo', 'autoestima'],
    duration: '2 horas',
    url: '#',
  },
  {
    id: 'res-008',
    title: 'Terapia narrativa: técnicas de externalización del problema',
    type: 'Artículo',
    tags: ['perfeccionismo', 'ansiedad'],
    duration: '18 min',
    url: '#',
  },
  {
    id: 'res-009',
    title: 'Mindfulness aplicado al estrés laboral millennial',
    type: 'Curso',
    tags: ['estrés laboral', 'ansiedad'],
    duration: '1.5 horas',
    url: '#',
  },
  {
    id: 'res-010',
    title: 'Nutrición y sueño: bases biológicas del bienestar emocional',
    type: 'Artículo',
    tags: ['insomnio'],
    duration: '8 min',
    url: '#',
  },
]

export default function Formacion() {
  const { patients } = usePatients()
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [customSearch, setCustomSearch] = useState('')

  const patientTags = useMemo(() => {
    const set = new Set<string>()
    patients.forEach((p) => (p.tags || []).forEach((t) => set.add(t)))
    return Array.from(set)
  }, [patients])

  // Query para Udemy: etiqueta activa > búsqueda manual > default
  const udemyQuery = activeTag
    ? `${activeTag} psicología terapia`
    : customSearch.trim() || 'psicología clínica terapia cognitiva'

  const { courses, loading, notConfigured, error } = useCourses(udemyQuery)

  const filteredStatic = useMemo(() => {
    if (!activeTag) return trainingResources
    return trainingResources.filter((r) => r.tags.includes(activeTag))
  }, [activeTag])

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <h1 className="text-2xl font-extrabold text-fox-dark dark:text-cream">Formación continua</h1>

      {/* Filtros por etiqueta de pacientes */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTag(null)}
          className={`pill transition ${!activeTag ? 'bg-fox text-white' : 'bg-fox-light text-fox-dark dark:bg-[#3a2d1f] dark:text-cream'}`}
        >
          Todos
        </button>
        {patientTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`pill transition ${activeTag === tag ? 'bg-fox text-white' : 'bg-fox-light text-fox-dark dark:bg-[#3a2d1f] dark:text-cream'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* ── Sección Udemy ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎓</span>
            <h2 className="text-lg font-extrabold text-fox-dark dark:text-cream">Cursos en Udemy</h2>
            {!notConfigured && (
              <span className="pill bg-lav-light text-lav-dark text-xs">en vivo</span>
            )}
          </div>
          {/* Búsqueda manual (solo visible si no hay etiqueta activa) */}
          {!activeTag && (
            <form
              onSubmit={(e) => { e.preventDefault() }}
              className="flex gap-2"
            >
              <input
                type="search"
                value={customSearch}
                onChange={(e) => setCustomSearch(e.target.value)}
                placeholder="Buscar tema…"
                className="rounded-xl border-[1.5px] border-[#FDDCCA] bg-white px-3 py-2 text-sm dark:bg-[#2a1d15] dark:border-[#3a2d1f] dark:text-cream focus:outline-none focus:border-fox w-44"
              />
            </form>
          )}
        </div>

        {notConfigured ? (
          <div className="card border-dashed text-center py-8 space-y-3">
            <p className="text-2xl">🔑</p>
            <p className="font-bold text-fox-dark dark:text-cream">Configura tus credenciales de Udemy</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Añade <code className="bg-fox-light px-1 rounded text-xs">UDEMY_CLIENT_ID</code> y{' '}
              <code className="bg-fox-light px-1 rounded text-xs">UDEMY_CLIENT_SECRET</code> en las
              variables de entorno de Netlify.{' '}
              <a
                href="https://www.udemy.com/user/edit-api-clients/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fox underline"
              >
                Obtener claves gratis →
              </a>
            </p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse space-y-3">
                <div className="h-28 rounded-xl bg-fox-light dark:bg-[#3a2d1f]" />
                <div className="h-3 w-3/4 rounded bg-fox-light dark:bg-[#3a2d1f]" />
                <div className="h-3 w-1/2 rounded bg-fox-light dark:bg-[#3a2d1f]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : courses.length === 0 ? (
          <p className="text-sm text-gray-400">Sin resultados para «{udemyQuery}»</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <a
                key={c.id}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card group flex flex-col gap-2 hover:border-fox transition-colors no-underline"
              >
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    className="w-full rounded-xl object-cover h-28"
                  />
                )}
                <div className="flex items-center justify-between">
                  <span className="pill bg-[#a435f0]/10 text-[#a435f0] text-xs font-bold">Udemy</span>
                  {c.rating && (
                    <span className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                      ★ {c.rating}
                      <span className="text-gray-400 font-normal">({c.num_reviews.toLocaleString()})</span>
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-fox-dark dark:text-cream line-clamp-2 group-hover:text-fox transition-colors">
                  {c.title}
                </p>
                {c.headline && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{c.headline}</p>
                )}
                <span className="mt-auto text-xs font-semibold text-fox">
                  {c.is_paid ? 'De pago' : 'Gratis'} · Ver curso →
                </span>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* ── Recursos curados ──────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📌</span>
          <h2 className="text-lg font-extrabold text-fox-dark dark:text-cream">Recursos curados</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStatic.map((r) => (
            <div key={r.id} className="card">
              <div className="flex items-center justify-between">
                <span className="pill bg-lav-light text-lav-dark text-xs">{r.type}</span>
                <span className="text-xs text-gray-400">{r.duration}</span>
              </div>
              <h3 className="mt-2 text-sm font-extrabold text-fox-dark dark:text-cream">{r.title}</h3>
              <div className="mt-2 flex flex-wrap gap-1">
                {r.tags.map((t) => (
                  <span key={t} className="pill bg-cream text-gray-500 text-xs dark:bg-[#2a1d15]">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

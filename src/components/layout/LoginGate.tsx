import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import FoxLogo from './FoxLogo'

export default function LoginGate({ children }: { children?: React.ReactNode }) {
  const { user, loading, login } = useAuth()
  const [email, setEmail] = useState('demo@atenea.app')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'psychologist' | 'patient' | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream p-6 dark:bg-[#1a1210]">
        <div className="card flex items-center gap-3">
          <FoxLogo size={32} variant="sit" />
          <span className="text-sm font-semibold text-fox-dark dark:text-cream">Cargando Atenea…</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream p-6 dark:bg-[#1a1210]">
        <div className="card w-full max-w-sm space-y-5 text-center">
          <div className="flex justify-center">
            <FoxLogo size={72} variant="sit" />
          </div>
          <h1 className="text-2xl font-extrabold text-fox-dark dark:text-cream">Atenea</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">App de psicología clínica</p>

          {!mode ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-fox-dark dark:text-cream">¿Cómo quieres entrar?</p>
              <button onClick={() => setMode('psychologist')} className="btn-primary w-full">🧑‍⚕️ Psicólogo</button>
              <button onClick={() => setMode('patient')} className="btn-secondary w-full">🐰 Paciente</button>
            </div>
          ) : (
            <div className="space-y-3">
              <button onClick={() => { setMode(null); setError('') }} className="text-xs text-lav-dark hover:underline">← Cambiar a {mode === 'psychologist' ? 'paciente' : 'psicólogo'}</button>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-xl border-[1.5px] border-[#FDDCCA] bg-white px-4 py-3 text-sm dark:bg-[#2a1d15] dark:border-[#3a2d1f] dark:text-cream focus:outline-none focus:border-fox"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full rounded-xl border-[1.5px] border-[#FDDCCA] bg-white px-4 py-3 text-sm dark:bg-[#2a1d15] dark:border-[#3a2d1f] dark:text-cream focus:outline-none focus:border-fox"
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button
                disabled={submitting || !email}
                onClick={async () => {
                  setSubmitting(true)
                  setError('')
                  const res = await login(mode, email, password)
                  if (res.error) setError(res.error)
                  setSubmitting(false)
                }}
                className="btn-primary w-full"
              >
                {submitting ? 'Entrando…' : `Entrar como ${mode === 'psychologist' ? 'Psicólogo' : 'Paciente'}`}
              </button>
              <p className="text-[10px] text-gray-400">Modo demo — si no hay credenciales de Supabase, no requiere contraseña.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return <>{children}</>
}

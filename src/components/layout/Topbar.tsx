import { useLocation, useNavigate } from 'react-router-dom'
import FoxLogo from './FoxLogo'
import { usePatients } from '../../hooks/usePatient'
import { useActivePatient } from '../../context/PatientContext'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

export default function Topbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const isPatientView = location.pathname.startsWith('/patient')
  const { patients } = usePatients()
  const { patientId, setPatientId } = useActivePatient()
  const { dark, toggle } = useTheme()
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b-[1.5px] border-[#FDDCCA] bg-white px-4 py-3 dark:bg-[#2a1d15] dark:border-[#3a2d1f] md:px-6">
      <div className="flex items-center gap-2">
        <FoxLogo size={38} />
        <span className="text-lg md:text-xl font-extrabold text-fox-dark dark:text-cream">Atenea</span>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button onClick={toggle} className="rounded-full p-2 text-sm transition hover:bg-fox-light dark:hover:bg-[#3a2d1f]" title={dark ? 'Modo claro' : 'Modo oscuro'}>
          {dark ? '☀️' : '🌙'}
        </button>

        {isPatientView && (
          <select
            value={patientId ?? ''}
            onChange={(e) => setPatientId(e.target.value)}
            className="rounded-full border-[1.5px] border-[#FDDCCA] bg-white px-3 py-1.5 text-sm font-semibold text-fox-dark focus:outline-none dark:bg-[#2a1d15] dark:border-[#3a2d1f] dark:text-cream"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.emoji} {p.alias}
              </option>
            ))}
          </select>
        )}

        <div className="hidden items-center gap-1 rounded-full bg-fox-light p-1 sm:flex dark:bg-[#3a2d1f]">
          <button
            onClick={() => navigate('/psy/dashboard')}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
              !isPatientView ? 'bg-fox text-white' : 'text-fox-dark hover:bg-white/60 dark:text-cream dark:hover:bg-[#4a3d2f]'
            }`}
          >
            🧑‍⚕️ Psicólogo
          </button>
          <button
            onClick={() => navigate('/patient/home')}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
              isPatientView ? 'bg-fox text-white' : 'text-fox-dark hover:bg-white/60 dark:text-cream dark:hover:bg-[#4a3d2f]'
            }`}
          >
            🐰 Paciente
          </button>
        </div>

        {user && (
          <button
            onClick={async () => {
              await logout()
              navigate('/', { replace: true })
            }}
            className="rounded-full p-2 text-sm font-semibold text-fox-dark transition hover:bg-fox-light dark:text-cream dark:hover:bg-[#3a2d1f]"
            title="Cerrar sesión"
          >
            Salir
          </button>
        )}
      </div>
    </header>
  )
}

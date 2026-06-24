import { NavLink } from 'react-router-dom'
import FoxLogo from './FoxLogo'

const links = [
  { to: '/psy/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/psy/expediente', label: 'Expedientes', icon: '📋' },
  { to: '/psy/ejercicios', label: 'Ejercicios', icon: '🧩' },
  { to: '/psy/pruebas', label: 'Pruebas', icon: '📊' },
  { to: '/psy/formacion', label: 'Formación', icon: '🎓' },
  { to: '/psy/calendario', label: 'Calendario', icon: '📅' },
]

export default function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r-[1.5px] border-[#FDDCCA] bg-white px-3 py-5 dark:bg-[#2a1d15] dark:border-[#3a2d1f] lg:block">
      <div className="mb-4 flex items-center gap-2 px-2">
        <FoxLogo size={30} variant="face" />
        <span className="text-base font-extrabold text-fox-dark dark:text-cream">Atenea</span>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-2.5 font-semibold text-sm transition ${
                isActive
                  ? 'bg-fox-light text-fox-dark dark:bg-[#3a2d1f] dark:text-cream'
                  : 'text-gray-500 hover:bg-fox-light/60 dark:hover:bg-[#3a2d1f] dark:text-gray-400 dark:hover:text-cream'
              }`
            }
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

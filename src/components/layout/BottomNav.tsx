import { NavLink } from 'react-router-dom'
import FoxLogo from './FoxLogo'

const LINKS = [
  { to: '/psy/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/psy/expediente', icon: '📁', label: 'Expediente' },
  { to: '/psy/ejercicios', icon: '🧘', label: 'Ejercicios' },
  { to: '/psy/pruebas', icon: '📋', label: 'Pruebas' },
  { to: '/psy/formacion', icon: '🎓', label: 'Formación' },
  { to: '/psy/calendario', icon: '📅', label: 'Calendario' },
]

export default function BottomNav() {
  return (
    <nav className="flex lg:hidden items-center justify-around border-t-[1.5px] border-[#FDDCCA] bg-white px-2 py-2 dark:bg-[#2a1d15] dark:border-[#3a2d1f]">
      <div className="flex flex-col items-center gap-0.5 px-2">
        <FoxLogo size={20} variant="curl" />
      </div>
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 text-[10px] font-bold transition ${
              isActive
                ? 'text-fox dark:text-cream'
                : 'text-gray-400 hover:text-fox-dark dark:hover:text-cream'
            }`
          }
        >
          <span className="text-lg">{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}

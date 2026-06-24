import { NavLink } from 'react-router-dom'

const links = [
  { to: '/patient/home', label: 'Inicio', icon: '🏠' },
  { to: '/patient/ejercicios', label: 'Ejercicios', icon: '🧩' },
  { to: '/patient/pruebas', label: 'Cuestionarios', icon: '📊' },
  { to: '/patient/diario', label: 'Diario', icon: '📔' },
]

export default function PatientNav() {
  return (
    <nav className="flex items-center gap-2 border-b-[1.5px] border-[#FDDCCA] bg-white px-6 py-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
              isActive ? 'bg-fox text-white' : 'text-fox-dark hover:bg-fox-light'
            }`
          }
        >
          <span>{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}

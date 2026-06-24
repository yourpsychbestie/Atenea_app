import { BrowserRouter, Navigate, Outlet, Route, Routes, useParams, useNavigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PatientProvider } from './context/PatientContext'
import { ToastProvider } from './components/layout/Toast'
import { ThemeProvider } from './context/ThemeContext'
import { useAuth } from './context/AuthContext'
import Topbar from './components/layout/Topbar'
import Sidebar from './components/layout/Sidebar'
import BottomNav from './components/layout/BottomNav'
import PatientNav from './components/layout/PatientNav'
import LoginGate from './components/layout/LoginGate'

import Dashboard from './components/psy/Dashboard'
import Expediente from './components/psy/Expediente'
import NuevaSesion from './components/psy/NuevaSesion'
import EjerciciosHub from './components/psy/EjerciciosHub'
import PruebasHub from './components/psy/PruebasHub'
import Formacion from './components/psy/Formacion'
import Calendario from './components/psy/Calendario'

import PatHome from './components/patient/PatHome'
import PatEjercicios from './components/patient/PatEjercicios'
import PatPruebas from './components/patient/PatPruebas'
import PatDiario from './components/patient/PatDiario'

import Externalizacion from './components/exercises/Externalizacion'
import TablaEtiquetas from './components/exercises/TablaEtiquetas'
import Respiracion from './components/exercises/Respiracion'
import CartaCompasiva from './components/exercises/CartaCompasiva'
import MapaValores from './components/exercises/MapaValores'
import BienvenidaYo from './components/exercises/BienvenidaYo'

import PHQ9 from './components/tests/PHQ9'
import GAD7 from './components/tests/GAD7'
import PCL5 from './components/tests/PCL5'
import BDIII from './components/tests/BDIII'
import DASS21 from './components/tests/DASS21'

function ExerciseWrapper({ Component }: { Component: React.FC<{ patientId: string }> }) {
  const { patientId } = useParams<{ patientId: string }>()
  if (!patientId) return <Navigate to="/psy/ejercicios" replace />
  return <Component patientId={patientId} />
}
function TestWrapper({ Component }: { Component: React.FC<{ patientId: string }> }) {
  const { patientId } = useParams<{ patientId: string }>()
  if (!patientId) return <Navigate to="/psy/pruebas" replace />
  return <Component patientId={patientId} />
}

function LogoutButton() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  if (!user) return null
  return (
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
  )
}

function PsyLayout() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
function PatientLayout() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <PatientNav />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  )
}

function RoleRedirect() {
  const { user } = useAuth()
  if (!user) return <LoginGate />
  return user.role === 'psychologist'
    ? <Navigate to="/psy/dashboard" replace />
    : <Navigate to="/patient/home" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <PatientProvider>
            <ToastProvider>
              <Routes>
                <Route path="/" element={<RoleRedirect />} />
                <Route
                  path="/*"
                  element={
                    <LoginGate>
                      <div className="flex h-screen flex-col bg-cream dark:bg-[#1a1210]">
                        <Topbar />
                        <Routes>
                          <Route element={<PsyLayout />}>
                            <Route path="psy/dashboard" element={<Dashboard />} />
                          <Route path="psy/expediente" element={<Expediente />} />
                          <Route path="psy/expediente/:patientId" element={<Expediente />} />
                          <Route path="psy/nueva-sesion/:patientId" element={<NuevaSesion />} />
                          <Route path="psy/ejercicios" element={<EjerciciosHub />} />
                          <Route path="psy/ejercicios/externalizacion/:patientId" element={<ExerciseWrapper Component={Externalizacion} />} />
                          <Route path="psy/ejercicios/tabla_etiquetas/:patientId" element={<ExerciseWrapper Component={TablaEtiquetas} />} />
                          <Route path="psy/ejercicios/respiracion/:patientId" element={<ExerciseWrapper Component={Respiracion} />} />
                          <Route path="psy/ejercicios/carta_compasiva/:patientId" element={<ExerciseWrapper Component={CartaCompasiva} />} />
                          <Route path="psy/ejercicios/mapa_valores/:patientId" element={<ExerciseWrapper Component={MapaValores} />} />
                          <Route path="psy/ejercicios/bienvenida_yo/:patientId" element={<ExerciseWrapper Component={BienvenidaYo} />} />
                          <Route path="psy/pruebas" element={<PruebasHub />} />
                          <Route path="psy/pruebas/PHQ-9/:patientId" element={<TestWrapper Component={PHQ9} />} />
                          <Route path="psy/pruebas/GAD-7/:patientId" element={<TestWrapper Component={GAD7} />} />
                          <Route path="psy/pruebas/PCL-5/:patientId" element={<TestWrapper Component={PCL5} />} />
                          <Route path="psy/pruebas/BDI-II/:patientId" element={<TestWrapper Component={BDIII} />} />
                          <Route path="psy/pruebas/DASS-21/:patientId" element={<TestWrapper Component={DASS21} />} />
                          <Route path="psy/formacion" element={<Formacion />} />
                          <Route path="psy/calendario" element={<Calendario />} />
                        </Route>

                        <Route element={<PatientLayout />}>
                          <Route path="patient/home" element={<PatHome />} />
                          <Route path="patient/ejercicios" element={<PatEjercicios />} />
                          <Route path="patient/pruebas" element={<PatPruebas />} />
                          <Route path="patient/diario" element={<PatDiario />} />
                        </Route>
                      </Routes>
                    </div>
                  </LoginGate>
                }
              />
            </Routes>
            </ToastProvider>
          </PatientProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

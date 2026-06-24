import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import FoxLogo from './FoxLogo'

type ToastVariant = 'success' | 'info'

interface ToastItem {
  id: number
  message: string
  variant: ToastVariant
  leaving?: boolean
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)))
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 300)
    }, 2800)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 rounded-2xl border-[1.5px] px-4 py-3 shadow-lg transition-all duration-300 ${
              t.leaving ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'
            } ${
              t.variant === 'success'
                ? 'border-mint bg-mint-light text-emerald-700'
                : 'border-lav bg-lav-light text-lav-dark'
            }`}
            style={{ animation: t.leaving ? undefined : 'toast-in 0.3s ease-out' }}
          >
            <FoxLogo size={28} />
            <span className="font-semibold text-sm">{t.message}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toast-in {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider')
  return ctx
}

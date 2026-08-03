import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
}

interface ToastContextValue {
  notify: (type: ToastType, title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const ICONS: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2, error: AlertCircle, info: Info,
}

const COLORS: Record<ToastType, { bg: string; color: string }> = {
  success: { bg: '#d1fae5', color: '#065f46' },
  error: { bg: '#fee2e2', color: '#991b1b' },
  info: { bg: '#dbeafe', color: '#1e40af' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const dismiss = useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), [])
  const notify = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, type, title, message }])
    setTimeout(() => dismiss(id), 4000)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="sol-toast-container">
        {toasts.map((t) => {
          const Icon = ICONS[t.type]
          const { bg, color } = COLORS[t.type]
          return (
            <div key={t.id} className="sol-toast">
              <div className="sol-toast-icon" style={{ background: bg, color }}><Icon size={18} /></div>
              <div style={{ flex: 1 }}>
                <div className="sol-toast-title">{t.title}</div>
                {t.message && <div className="sol-toast-msg">{t.message}</div>}
              </div>
              <button onClick={() => dismiss(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-neutral-400)' }}><X size={16} /></button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

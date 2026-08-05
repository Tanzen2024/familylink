import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import type { RequestCategory, RequestStatus, UrgencyLevel } from './types'
import { CATEGORY_BADGES, STATUS_BADGES, URGENCY_BADGES } from './types'

export function Modal({ title, onClose, children, maxWidth = '600px' }: {
  title: string
  onClose: () => void
  children: ReactNode
  maxWidth?: string
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export function CategoryBadge({ category }: { category: RequestCategory }) {
  const s = CATEGORY_BADGES[category]
  return <span className="sol-badge" style={{ background: s.bg, color: s.color }}>{category}</span>
}

export function StatusBadge({ status }: { status: RequestStatus }) {
  const s = STATUS_BADGES[status]
  return <span className="sol-badge" style={{ background: s.bg, color: s.color }}>{status}</span>
}

export function UrgencyBadge({ urgency }: { urgency: UrgencyLevel }) {
  const s = URGENCY_BADGES[urgency]
  return <span className="sol-badge" style={{ background: s.bg, color: s.color }}>{urgency}</span>
}

export function ProgressBar({ value, max, color }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="sol-progress">
      <div className="sol-progress-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

export function Avatar({ name, size = 'md' }: { name: string; size?: 'md' | 'lg' }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  return <div className={`sol-avatar ${size === 'lg' ? 'sol-avatar-lg' : ''}`}>{initials}</div>
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="empty-state">
      <p>{message}</p>
    </div>
  )
}

export function formatMoney(amount: number): string {
  const formatted = new Intl.NumberFormat('fr-FR').format(amount)
  return formatted + '\u202FFCFA'
}

// R\u00E9duit progressivement la police d'une valeur de carte KPI \u00E0 mesure que le texte
// s'allonge, pour qu'un montant reste toujours visible sur une seule ligne \u2014 calibr\u00E9
// pour la largeur plancher garantie par `.kpi-grid` (260px). Voir `src/finances/ui.tsx`
// pour le d\u00E9tail du calcul, identique dans les trois modules (m\u00EAme gabarit `.sol-kpi`).
export function kpiValueSizeClass(value: string): string {
  const len = value.length
  if (len > 24) return 'sol-kpi-value-xxs'
  if (len > 20) return 'sol-kpi-value-xs'
  if (len > 16) return 'sol-kpi-value-sm'
  if (len > 13) return 'sol-kpi-value-md'
  if (len > 11) return 'sol-kpi-value-lg'
  return ''
}

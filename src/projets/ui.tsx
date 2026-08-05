import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import type { IdeaStatus, ProjectStatus, Priority } from './types'
import { IDEA_STATUS_BADGES, PROJECT_STATUS_BADGES, PRIORITY_BADGES } from './types'

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

export function IdeaStatusBadge({ status }: { status: IdeaStatus }) {
  const s = IDEA_STATUS_BADGES[status]
  return <span className="sol-badge" style={{ background: s.bg, color: s.color }}>{status}</span>
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const s = PROJECT_STATUS_BADGES[status]
  return <span className="sol-badge" style={{ background: s.bg, color: s.color }}>{status}</span>
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const s = PRIORITY_BADGES[priority]
  return <span className="sol-badge" style={{ background: s.bg, color: s.color }}>{priority}</span>
}

export function ProgressBar({ value, max, color }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="sol-progress">
      <div className="sol-progress-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return <div className="empty-state"><p>{message}</p></div>
}

export function formatMoney(amount: number): string {
  const formatted = new Intl.NumberFormat('fr-FR').format(amount)
  return formatted + '\u202FFCFA'
}

export function formatMoneyShort(amount: number): string {
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'M'
  if (amount >= 1000) return (amount / 1000).toFixed(0) + 'K'
  return String(amount)
}

// Réduit progressivement la police d'une valeur de carte KPI à mesure que le texte
// s'allonge, pour qu'un montant reste toujours visible sur une seule ligne — calibré
// pour la largeur plancher garantie par `.kpi-grid` (260px). Voir `src/finances/ui.tsx`
// pour le détail du calcul, identique dans les trois modules (même gabarit `.sol-kpi`).
export function kpiValueSizeClass(value: string): string {
  const len = value.length
  if (len > 24) return 'sol-kpi-value-xxs'
  if (len > 20) return 'sol-kpi-value-xs'
  if (len > 16) return 'sol-kpi-value-sm'
  if (len > 13) return 'sol-kpi-value-md'
  if (len > 11) return 'sol-kpi-value-lg'
  return ''
}

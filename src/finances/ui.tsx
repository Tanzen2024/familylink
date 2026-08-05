import type { CSSProperties, ReactNode } from 'react'
import { X, type LucideIcon } from 'lucide-react'
import type { ContributionStatus, PaymentStatus, IncomeOrigin, ExpenseCategory } from './types'
import {
  CONTRIBUTION_STATUS_BADGES, PAYMENT_STATUS_BADGES,
  INCOME_ORIGIN_BADGES, EXPENSE_CATEGORY_BADGES,
} from './types'

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

export function ContributionStatusBadge({ status }: { status: ContributionStatus }) {
  const s = CONTRIBUTION_STATUS_BADGES[status]
  return <span className="sol-badge" style={{ background: s.bg, color: s.color }}>{status}</span>
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const s = PAYMENT_STATUS_BADGES[status]
  return <span className="sol-badge" style={{ background: s.bg, color: s.color }}>{status}</span>
}

export function IncomeOriginBadge({ origin }: { origin: IncomeOrigin }) {
  const s = INCOME_ORIGIN_BADGES[origin]
  return <span className="sol-badge" style={{ background: s.bg, color: s.color }}>{origin}</span>
}

export function ExpenseCategoryBadge({ category }: { category: ExpenseCategory }) {
  const s = EXPENSE_CATEGORY_BADGES[category]
  return <span className="sol-badge" style={{ background: s.bg, color: s.color }}>{category}</span>
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

// Un montant financier peut aller de "0 FCFA" à "1 250 000 000 FCFA" (voire plus).
// Cette échelle réduit progressivement la police à mesure que le texte s'allonge — jamais
// par paliers binaires trop larges — pour qu'il reste toujours entièrement visible, sur une
// seule ligne, sans jamais recourir à un troncage (overflow/ellipsis). Les seuils sont
// calibrés pour la largeur minimale garantie d'une carte KPI (voir `.kpi-grid`,
// `minmax(260px, 1fr)`) : à cette largeur plancher, chaque palier a été vérifié pour
// laisser suffisamment de place à sa police avant de passer au palier suivant, plus petit.
// Fonction identique (dupliquée volontairement) dans solidarite/ui.tsx et projets/ui.tsx,
// qui suivent chacun leur propre kit UI indépendant plutôt qu'un composant partagé.
function kpiValueSizeClass(value: string): string {
  const len = value.length
  if (len > 24) return 'sol-kpi-value-xxs'
  if (len > 20) return 'sol-kpi-value-xs'
  if (len > 16) return 'sol-kpi-value-sm'
  if (len > 13) return 'sol-kpi-value-md'
  if (len > 11) return 'sol-kpi-value-lg'
  return ''
}

/**
 * Carte KPI standard du module Finances : icône teintée + valeur (police
 * auto-adaptative) + libellé. `onClick` optionnel rend la carte activable
 * (bouton natif, focus clavier) ; sans `onClick`, simple carte statique.
 */
export function KpiCard({ icon: Icon, label, value, bg, color, onClick, style }: {
  icon: LucideIcon
  label: string
  value: string
  bg: string
  color: string
  onClick?: () => void
  style?: CSSProperties
}) {
  const inner = (
    <>
      <div className="sol-kpi-icon" style={{ background: bg, color }} aria-hidden="true">
        <Icon size={24} />
      </div>
      <div>
        <div className={`sol-kpi-value ${kpiValueSizeClass(value)}`}>{value}</div>
        <div className="sol-kpi-label">{label}</div>
      </div>
    </>
  )

  if (onClick) {
    return (
      <button className="sol-kpi" style={style} onClick={onClick} aria-label={`${label} : ${value}`}>
        {inner}
      </button>
    )
  }

  return <div className="sol-kpi" style={style}>{inner}</div>
}

// Fonction utilitaire unique pour tout montant FCFA affiché dans le module Finances.
// Le séparateur de milliers (espace fine insécable, déjà produite par Intl.NumberFormat
// en fr-FR) et le "\u202F" (espace fine insécable, écrite en séquence d'échappement pour
// rester un caractère ASCII lisible dans le code source) avant "FCFA" sont tous deux
// insécables : le navigateur ne peut jamais couper la ligne à l'intérieur d'un montant,
// ni entre le nombre et son suffixe — quel que soit le conteneur qui l'affiche.
export function formatCurrencyFCFA(amount: number): string {
  const formatted = new Intl.NumberFormat('fr-FR').format(amount)
  return formatted + '\u202FFCFA'
}

export function formatMoneyShort(amount: number): string {
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'M'
  if (amount >= 1000) return (amount / 1000).toFixed(0) + 'K'
  return String(amount)
}

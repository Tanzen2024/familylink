import type { ReactNode } from 'react'
import { X } from 'lucide-react'
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

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

export function formatMoneyShort(amount: number): string {
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'M'
  if (amount >= 1000) return (amount / 1000).toFixed(0) + 'K'
  return String(amount)
}

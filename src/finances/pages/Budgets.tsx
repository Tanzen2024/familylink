import { useState } from 'react'
import { Plus, Wallet, TrendingDown } from 'lucide-react'
import { mockBudgets } from '../mockData'
import { useToast } from '../toast'
import { Modal, ProgressBar, formatMoney, EmptyState } from '../ui'
import type { Budget } from '../types'

export default function Budgets() {
  const { notify } = useToast()
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets)
  const [showForm, setShowForm] = useState(false)

  const totalPlanned = budgets.reduce((s, b) => s + b.planned, 0)
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0)
  const totalBalance = totalPlanned - totalSpent

  const handleCreate = (data: { name: string; fiscalYear: string; planned: number; color: string }) => {
    const newBudget: Budget = { ...data, id: `b${Date.now()}`, spent: 0 }
    setBudgets((prev) => [...prev, newBudget])
    setShowForm(false)
    notify('success', 'Budget créé', `Le budget "${data.name}" a été créé pour ${data.fiscalYear}.`)
  }

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Budgets</h1>
          <p>Budgets annuels par catégorie</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} style={{ marginRight: '0.25rem' }} /> Nouveau budget
        </button>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="sol-kpi">
          <div className="sol-kpi-icon" style={{ background: '#dbeafe', color: '#1e40af' }}><Wallet size={24} /></div>
          <div><div className="sol-kpi-value" style={{ fontSize: '1.25rem' }}>{formatMoney(totalPlanned)}</div><div className="sol-kpi-label">Total prévu</div></div>
        </div>
        <div className="sol-kpi">
          <div className="sol-kpi-icon" style={{ background: '#fee2e2', color: '#991b1b' }}><TrendingDown size={24} /></div>
          <div><div className="sol-kpi-value" style={{ fontSize: '1.25rem' }}>{formatMoney(totalSpent)}</div><div className="sol-kpi-label">Total dépensé</div></div>
        </div>
        <div className="sol-kpi">
          <div className="sol-kpi-icon" style={{ background: '#d1fae5', color: '#065f46' }}><Wallet size={24} /></div>
          <div><div className="sol-kpi-value" style={{ fontSize: '1.25rem' }}>{formatMoney(totalBalance)}</div><div className="sol-kpi-label">Solde disponible</div></div>
        </div>
      </div>

      {budgets.length === 0 ? <EmptyState message="Aucun budget défini." /> : (
        <div className="grid-2">
          {budgets.map((b) => {
            const pct = b.planned > 0 ? Math.min(100, (b.spent / b.planned) * 100) : 0
            const balance = b.planned - b.spent
            return (
              <div key={b.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: b.color, opacity: 0.15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '4px', background: b.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{b.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>Exercice {b.fiscalYear}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: pct >= 80 ? '#991b1b' : 'var(--color-neutral-900)' }}>{pct.toFixed(0)}%</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)' }}>consommé</div>
                  </div>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-neutral-500)' }}>Prévu: <strong style={{ color: 'var(--color-neutral-800)' }}>{formatMoney(b.planned)}</strong></span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-neutral-500)' }}>Dépensé: <strong style={{ color: '#991b1b' }}>{formatMoney(b.spent)}</strong></span>
                  </div>
                  <ProgressBar value={b.spent} max={b.planned} color={pct >= 80 ? '#ef4444' : b.color} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  <span style={{ color: 'var(--color-neutral-500)' }}>Solde:</span>
                  <span style={{ fontWeight: 700, color: balance >= 0 ? '#065f46' : '#991b1b' }}>{formatMoney(balance)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showForm && <BudgetForm onClose={() => setShowForm(false)} onCreate={handleCreate} />}
    </div>
  )
}

function BudgetForm({ onClose, onCreate }: { onClose: () => void; onCreate: (data: { name: string; fiscalYear: string; planned: number; color: string }) => void }) {
  const [form, setForm] = useState({ name: '', fiscalYear: '2025', planned: 0, color: '#3b82f6' })
  return (
    <Modal title="Nouveau budget" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onCreate({ ...form, planned: Number(form.planned) }) }}>
        <div className="form-group"><label className="form-label">Nom du budget *</label><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Exercice *</label><input className="form-input" value={form.fiscalYear} onChange={(e) => setForm({ ...form, fiscalYear: e.target.value })} required /></div>
          <div className="form-group"><label className="form-label">Montant prévu (FCFA) *</label><input type="number" className="form-input" value={form.planned || ''} onChange={(e) => setForm({ ...form, planned: Number(e.target.value) })} required min="1" /></div>
        </div>
        <div className="form-group"><label className="form-label">Couleur</label><input type="color" className="form-input" style={{ height: '40px', padding: '4px' }} value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></div>
        <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button><button type="submit" className="btn btn-primary">Créer</button></div>
      </form>
    </Modal>
  )
}

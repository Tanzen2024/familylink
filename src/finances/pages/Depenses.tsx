import { useState, useMemo } from 'react'
import { Plus, Search, TrendingDown, CheckCircle2, XCircle, Paperclip } from 'lucide-react'
import { mockExpenses } from '../mockData'
import { useToast } from '../toast'
import { Modal, ExpenseCategoryBadge, formatMoney, EmptyState, KpiCard } from '../ui'
import type { Expense, ExpenseCategory } from '../types'

const CATEGORIES: ExpenseCategory[] = ['Solidarité', 'Projet', 'Fonctionnement', 'Communication', 'Formation', 'Événements', 'Administration']

export default function Depenses() {
  const { notify } = useToast()
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [fCat, setFCat] = useState('')
  const [fValidated, setFValidated] = useState('')

  const filtered = useMemo(() => expenses.filter((e) => {
    if (search && !e.beneficiary.toLowerCase().includes(search.toLowerCase()) && !e.reference.toLowerCase().includes(search.toLowerCase())) return false
    if (fCat && e.category !== fCat) return false
    if (fValidated === 'validated' && !e.validated) return false
    if (fValidated === 'pending' && e.validated) return false
    return true
  }), [expenses, search, fCat, fValidated])

  const total = filtered.reduce((s, e) => s + e.amount, 0)
  const validatedTotal = expenses.filter((e) => e.validated).reduce((s, e) => s + e.amount, 0)
  const pendingCount = expenses.filter((e) => !e.validated).length

  const handleValidate = (id: string) => {
    setExpenses((prev) => prev.map((e) => e.id === id ? { ...e, validated: true } : e))
    notify('success', 'Dépense validée', 'La dépense a été validée par le président.')
  }

  const handleCreate = (data: { category: ExpenseCategory; project: string; beneficiary: string; amount: number; receipt: string }) => {
    const num = `DEP-2025-${String(expenses.length + 1).padStart(3, '0')}`
    const newExp: Expense = {
      ...data, id: `e${Date.now()}`, reference: num,
      date: new Date().toISOString().slice(0, 10),
      project: data.project || null, receipt: data.receipt || null,
      validated: false,
    }
    setExpenses((prev) => [newExp, ...prev])
    setShowForm(false)
    notify('success', 'Dépense créée', `${num} - ${formatMoney(data.amount)} pour ${data.beneficiary}.`)
  }

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Dépenses</h1>
          <p>Toutes les sorties d'argent de l'association</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} style={{ marginRight: '0.25rem' }} /> Nouvelle dépense
        </button>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <KpiCard icon={TrendingDown} label="Total filtré" value={formatMoney(total)} bg="#fee2e2" color="#991b1b" />
        <KpiCard icon={CheckCircle2} label="Dépenses validées" value={formatMoney(validatedTotal)} bg="#d1fae5" color="#065f46" />
        <KpiCard icon={XCircle} label="En attente de validation" value={String(pendingCount)} bg="#fef3c7" color="#92400e" />
      </div>

      <div className="sol-filters">
        <div className="sol-search">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-400)' }} />
            <input className="form-input" style={{ paddingLeft: '2.25rem' }} placeholder="Rechercher une dépense…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <select className="form-select" value={fCat} onChange={(e) => setFCat(e.target.value)}>
          <option value="">Toutes les catégories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="form-select" value={fValidated} onChange={(e) => setFValidated(e.target.value)}>
          <option value="">Toutes les validations</option>
          <option value="validated">Validées</option>
          <option value="pending">En attente</option>
        </select>
      </div>

      {filtered.length === 0 ? <EmptyState message="Aucune dépense ne correspond à vos filtres." /> : (
        <div className="sol-chart sol-chart-flush">
          <table className="sol-table">
            <thead><tr><th>Référence</th><th>Catégorie</th><th>Projet</th><th>Bénéficiaire</th><th>Montant</th><th>Date</th><th>Justificatif</th><th>Validation</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 600, fontSize: '0.8rem' }}>{e.reference}</td>
                  <td><ExpenseCategoryBadge category={e.category} /></td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--color-neutral-500)' }}>{e.project ?? '—'}</td>
                  <td style={{ fontWeight: 500 }}>{e.beneficiary}</td>
                  <td style={{ fontWeight: 700, color: '#991b1b' }}>{formatMoney(e.amount)}</td>
                  <td>{new Date(e.date).toLocaleDateString('fr-FR')}</td>
                  <td>{e.receipt ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary-600)' }}><Paperclip size={14} /> {e.receipt}</span> : '—'}</td>
                  <td>
                    {e.validated ? (
                      <span className="fin-validation-badge" style={{ background: '#d1fae5', color: '#065f46' }}><CheckCircle2 size={12} /> Validée</span>
                    ) : (
                      <span className="fin-validation-badge" style={{ background: '#fef3c7', color: '#92400e' }}><XCircle size={12} /> En attente</span>
                    )}
                  </td>
                  <td>
                    {!e.validated && <button className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => handleValidate(e.id)}>Valider</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && <ExpenseForm onClose={() => setShowForm(false)} onCreate={handleCreate} />}
    </div>
  )
}

function ExpenseForm({ onClose, onCreate }: { onClose: () => void; onCreate: (data: { category: ExpenseCategory; project: string; beneficiary: string; amount: number; receipt: string }) => void }) {
  const [form, setForm] = useState({ category: 'Fonctionnement' as ExpenseCategory, project: '', beneficiary: '', amount: 0, receipt: '' })
  return (
    <Modal title="Nouvelle dépense" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onCreate({ ...form, amount: Number(form.amount) }) }}>
        <div className="form-group"><label className="form-label">Catégorie *</label>
          <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ExpenseCategory })}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group"><label className="form-label">Projet</label><input className="form-input" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} placeholder="Optionnel" /></div>
        <div className="form-group"><label className="form-label">Bénéficiaire *</label><input className="form-input" value={form.beneficiary} onChange={(e) => setForm({ ...form, beneficiary: e.target.value })} required /></div>
        <div className="form-group"><label className="form-label">Montant (FCFA) *</label><input type="number" className="form-input" value={form.amount || ''} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} required min="1" /></div>
        <div className="form-group"><label className="form-label">Pièce justificative</label><input className="form-input" value={form.receipt} onChange={(e) => setForm({ ...form, receipt: e.target.value })} placeholder="Nom du fichier" /></div>
        <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button><button type="submit" className="btn btn-primary">Créer</button></div>
      </form>
    </Modal>
  )
}

import { useState, useMemo } from 'react'
import { Plus, Search, Bell, CheckCircle2, Clock } from 'lucide-react'
import { mockContributions } from '../mockData'
import { useToast } from '../toast'
import { Modal, ContributionStatusBadge, formatCurrencyFCFA, EmptyState, KpiCard } from '../ui'
import type { Contribution, ContributionStatus } from '../types'

const STATUSES: ContributionStatus[] = ['En attente', 'Partiellement payé', 'Payé', 'En retard']

export default function Cotisations() {
  const { notify } = useToast()
  const [contributions, setContributions] = useState<Contribution[]>(mockContributions)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [fStatus, setFStatus] = useState('')

  const filtered = useMemo(() => contributions.filter((c) => {
    if (search && !c.member.toLowerCase().includes(search.toLowerCase()) && !c.number.toLowerCase().includes(search.toLowerCase())) return false
    if (fStatus && c.status !== fStatus) return false
    return true
  }), [contributions, search, fStatus])

  const totalExpected = contributions.reduce((s, c) => s + c.expectedAmount, 0)
  const totalPaid = contributions.reduce((s, c) => s + c.paidAmount, 0)
  const lateCount = contributions.filter((c) => c.status === 'En retard').length
  const paidCount = contributions.filter((c) => c.status === 'Payé').length

  const handleRemind = (c: Contribution) => {
    notify('info', 'Rappel envoyé', `Un rappel a été envoyé à ${c.member} pour la cotisation ${c.number}.`)
  }

  const handleCreate = (data: { member: string; fiscalYear: string; type: string; expectedAmount: number; dueDate: string }) => {
    const num = `COT-2025-${String(contributions.length + 1).padStart(3, '0')}`
    const newCot: Contribution = {
      ...data, id: `c${Date.now()}`, number: num, paidAmount: 0, paymentDate: null,
      status: 'En attente', paymentMethod: null,
    }
    setContributions((prev) => [newCot, ...prev])
    setShowForm(false)
    notify('success', 'Cotisation créée', `${num} pour ${data.member}.`)
  }

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Cotisations</h1>
          <p>Gérez les cotisations des membres</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} style={{ marginRight: '0.25rem' }} /> Nouvelle cotisation
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <KpiCard icon={Clock} label="Montant attendu" value={formatCurrencyFCFA(totalExpected)} bg="#dbeafe" color="#1e40af" />
        <KpiCard icon={CheckCircle2} label="Montant payé" value={formatCurrencyFCFA(totalPaid)} bg="#d1fae5" color="#065f46" />
        <KpiCard icon={CheckCircle2} label="Membres à jour" value={String(paidCount)} bg="#d1fae5" color="#065f46" />
        <KpiCard icon={Clock} label="Membres en retard" value={String(lateCount)} bg="#fee2e2" color="#991b1b" />
      </div>

      <div className="sol-filters">
        <div className="sol-search">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-400)' }} />
            <input className="form-input" style={{ paddingLeft: '2.25rem' }} placeholder="Rechercher par membre ou numéro…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <select className="form-select" value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? <EmptyState message="Aucune cotisation ne correspond à vos filtres." /> : (
        <div className="sol-chart sol-chart-flush">
          <table className="sol-table">
            <thead>
              <tr><th>Numéro</th><th>Membre</th><th>Exercice</th><th>Attendu</th><th>Payé</th><th>Solde</th><th>Échéance</th><th>Paiement</th><th>Statut</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const balance = c.expectedAmount - c.paidAmount
                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600, fontSize: '0.8rem' }}>{c.number}</td>
                    <td style={{ fontWeight: 500 }}>{c.member}</td>
                    <td>{c.fiscalYear}</td>
                    <td>{formatCurrencyFCFA(c.expectedAmount)}</td>
                    <td style={{ color: '#065f46', fontWeight: 500 }}>{formatCurrencyFCFA(c.paidAmount)}</td>
                    <td style={{ color: balance > 0 ? '#991b1b' : 'var(--color-neutral-500)' }}>{formatCurrencyFCFA(balance)}</td>
                    <td>{new Date(c.dueDate).toLocaleDateString('fr-FR')}</td>
                    <td>{c.paymentDate ? new Date(c.paymentDate).toLocaleDateString('fr-FR') : '—'}</td>
                    <td><ContributionStatusBadge status={c.status} /></td>
                    <td>
                      {(c.status === 'En retard' || c.status === 'Partiellement payé') && (
                        <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => handleRemind(c)} title="Envoyer un rappel"><Bell size={14} /></button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && <CotisationForm onClose={() => setShowForm(false)} onCreate={handleCreate} />}
    </div>
  )
}

function CotisationForm({ onClose, onCreate }: { onClose: () => void; onCreate: (data: { member: string; fiscalYear: string; type: string; expectedAmount: number; dueDate: string }) => void }) {
  const [form, setForm] = useState({ member: '', fiscalYear: '2025', type: 'Ordinaire', expectedAmount: 50000, dueDate: '' })
  return (
    <Modal title="Nouvelle cotisation" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onCreate({ ...form, expectedAmount: Number(form.expectedAmount) }) }}>
        <div className="form-group"><label className="form-label">Membre *</label><input className="form-input" value={form.member} onChange={(e) => setForm({ ...form, member: e.target.value })} required /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Exercice *</label><input className="form-input" value={form.fiscalYear} onChange={(e) => setForm({ ...form, fiscalYear: e.target.value })} required /></div>
          <div className="form-group"><label className="form-label">Type *</label>
            <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="Ordinaire">Ordinaire</option><option value="Extraordinaire">Extraordinaire</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Montant attendu (FCFA) *</label><input type="number" className="form-input" value={form.expectedAmount} onChange={(e) => setForm({ ...form, expectedAmount: Number(e.target.value) })} required min="1" /></div>
          <div className="form-group"><label className="form-label">Date limite *</label><input type="date" className="form-input" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required /></div>
        </div>
        <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button><button type="submit" className="btn btn-primary">Créer</button></div>
      </form>
    </Modal>
  )
}

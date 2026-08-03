import { useState, useMemo } from 'react'
import { Search, CreditCard, FileText, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { mockPayments } from '../mockData'
import { PaymentStatusBadge, formatMoney, EmptyState } from '../ui'
import type { PaymentStatus } from '../types'

const STATUSES: PaymentStatus[] = ['En attente', 'Effectué', 'Rejeté']

export default function Paiements() {
  const [search, setSearch] = useState('')
  const [fStatus, setFStatus] = useState('')
  const [tab, setTab] = useState<'all' | PaymentStatus>('all')

  const filtered = useMemo(() => mockPayments.filter((p) => {
    if (search && !p.label.toLowerCase().includes(search.toLowerCase()) && !p.reference.toLowerCase().includes(search.toLowerCase()) && !p.recipient.toLowerCase().includes(search.toLowerCase())) return false
    if (fStatus && p.status !== fStatus) return false
    if (tab !== 'all' && p.status !== tab) return false
    return true
  }), [search, fStatus, tab])

  const total = filtered.reduce((s, p) => s + p.amount, 0)
  const counts = {
    'Effectué': mockPayments.filter((p) => p.status === 'Effectué').length,
    'En attente': mockPayments.filter((p) => p.status === 'En attente').length,
    'Rejeté': mockPayments.filter((p) => p.status === 'Rejeté').length,
  }

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Paiements</h1>
          <p>Centre de gestion des paiements</p>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="sol-kpi" style={{ cursor: 'pointer' }} onClick={() => setTab('Effectué')}>
          <div className="sol-kpi-icon" style={{ background: '#d1fae5', color: '#065f46' }}><CheckCircle2 size={24} /></div>
          <div><div className="sol-kpi-value">{counts['Effectué']}</div><div className="sol-kpi-label">Paiements effectués</div></div>
        </div>
        <div className="sol-kpi" style={{ cursor: 'pointer' }} onClick={() => setTab('En attente')}>
          <div className="sol-kpi-icon" style={{ background: '#fef3c7', color: '#92400e' }}><Clock size={24} /></div>
          <div><div className="sol-kpi-value">{counts['En attente']}</div><div className="sol-kpi-label">Paiements en attente</div></div>
        </div>
        <div className="sol-kpi" style={{ cursor: 'pointer' }} onClick={() => setTab('Rejeté')}>
          <div className="sol-kpi-icon" style={{ background: '#fee2e2', color: '#991b1b' }}><XCircle size={24} /></div>
          <div><div className="sol-kpi-value">{counts['Rejeté']}</div><div className="sol-kpi-label">Paiements rejetés</div></div>
        </div>
      </div>

      <div className="sol-tabs">
        <div className={`sol-tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>Historique ({mockPayments.length})</div>
        <div className={`sol-tab ${tab === 'En attente' ? 'active' : ''}`} onClick={() => setTab('En attente')}>En attente ({counts['En attente']})</div>
        <div className={`sol-tab ${tab === 'Effectué' ? 'active' : ''}`} onClick={() => setTab('Effectué')}>Effectués ({counts['Effectué']})</div>
        <div className={`sol-tab ${tab === 'Rejeté' ? 'active' : ''}`} onClick={() => setTab('Rejeté')}>Rejetés ({counts['Rejeté']})</div>
      </div>

      <div className="sol-filters">
        <div className="sol-search">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-400)' }} />
            <input className="form-input" style={{ paddingLeft: '2.25rem' }} placeholder="Rechercher un paiement…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <select className="form-select" value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? <EmptyState message="Aucun paiement ne correspond à vos filtres." /> : (
        <div className="sol-chart" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-neutral-200)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>{filtered.length} paiement(s)</span>
            <span>Total: {formatMoney(total)}</span>
          </div>
          <table className="sol-table">
            <thead><tr><th>Référence</th><th>Libellé</th><th>Bénéficiaire</th><th>Montant</th><th>Date</th><th>Méthode</th><th>Statut</th><th>Reçu</th></tr></thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, fontSize: '0.8rem' }}>{p.reference}</td>
                  <td style={{ fontWeight: 500 }}>{p.label}</td>
                  <td>{p.recipient}</td>
                  <td style={{ fontWeight: 700 }}>{formatMoney(p.amount)}</td>
                  <td>{new Date(p.date).toLocaleDateString('fr-FR')}</td>
                  <td><span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CreditCard size={14} style={{ color: 'var(--color-neutral-400)' }} /> {p.method}</span></td>
                  <td><PaymentStatusBadge status={p.status} /></td>
                  <td>{p.status === 'Effectué' ? <button style={{ background: 'none', border: 'none', color: 'var(--color-primary-600)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}><FileText size={14} /> Reçu</button> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

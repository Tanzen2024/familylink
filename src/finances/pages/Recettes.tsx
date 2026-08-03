import { useState, useMemo } from 'react'
import { Search, TrendingUp } from 'lucide-react'
import { mockIncomes } from '../mockData'
import { IncomeOriginBadge, formatMoney, EmptyState } from '../ui'
import type { IncomeOrigin } from '../types'

const ORIGINS: IncomeOrigin[] = ['Cotisations', 'Dons', 'Collectes', 'Subventions', 'Revenus des projets', 'Autres recettes']

export default function Recettes() {
  const [search, setSearch] = useState('')
  const [fOrigin, setFOrigin] = useState('')

  const filtered = useMemo(() => mockIncomes.filter((i) => {
    if (search && !i.description.toLowerCase().includes(search.toLowerCase()) && !i.reference.toLowerCase().includes(search.toLowerCase())) return false
    if (fOrigin && i.origin !== fOrigin) return false
    return true
  }), [search, fOrigin])

  const total = filtered.reduce((s, i) => s + i.amount, 0)

  const byOrigin: Record<string, number> = {}
  mockIncomes.forEach((i) => { byOrigin[i.origin] = (byOrigin[i.origin] || 0) + i.amount })

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Recettes</h1>
          <p>Toutes les entrées d'argent de l'association</p>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        {ORIGINS.map((origin) => (
          <div key={origin} className="sol-kpi" style={{ cursor: 'pointer' }} onClick={() => setFOrigin(fOrigin === origin ? '' : origin)}>
            <div className="sol-kpi-icon" style={{ background: '#d1fae5', color: '#065f46' }}><TrendingUp size={20} /></div>
            <div>
              <div className="sol-kpi-value" style={{ fontSize: '1.1rem' }}>{formatMoney(byOrigin[origin] || 0)}</div>
              <div className="sol-kpi-label">{origin}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="sol-filters">
        <div className="sol-search">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-400)' }} />
            <input className="form-input" style={{ paddingLeft: '2.25rem' }} placeholder="Rechercher une recette…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <select className="form-select" value={fOrigin} onChange={(e) => setFOrigin(e.target.value)}>
          <option value="">Toutes les origines</option>
          {ORIGINS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? <EmptyState message="Aucune recette ne correspond à vos filtres." /> : (
        <div className="sol-chart" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-neutral-200)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>{filtered.length} recette(s)</span>
            <span style={{ color: '#065f46' }}>Total: {formatMoney(total)}</span>
          </div>
          <table className="sol-table">
            <thead><tr><th>Référence</th><th>Origine</th><th>Description</th><th>Montant</th><th>Date</th><th>Compte</th></tr></thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id}>
                  <td style={{ fontWeight: 600, fontSize: '0.8rem' }}>{i.reference}</td>
                  <td><IncomeOriginBadge origin={i.origin} /></td>
                  <td style={{ fontWeight: 500 }}>{i.description}</td>
                  <td style={{ fontWeight: 700, color: '#065f46' }}>{formatMoney(i.amount)}</td>
                  <td>{new Date(i.date).toLocaleDateString('fr-FR')}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>{i.account}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

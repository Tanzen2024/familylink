import { useState, useMemo } from 'react'
import { Search, ShieldCheck, User, FileText } from 'lucide-react'
import { mockAuditEntries } from '../mockData'
import { formatCurrencyFCFA, EmptyState } from '../ui'

export default function Audit() {
  const [search, setSearch] = useState('')
  const [fActor, setFActor] = useState('')

  const actors = Array.from(new Set(mockAuditEntries.map((e) => e.actor)))

  const filtered = useMemo(() => mockAuditEntries.filter((e) => {
    if (search && !e.action.toLowerCase().includes(search.toLowerCase()) && !e.entity.toLowerCase().includes(search.toLowerCase())) return false
    if (fActor && e.actor !== fActor) return false
    return true
  }), [search, fActor])

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Audit</h1>
          <p>Journal de toutes les opérations financières</p>
        </div>
      </div>

      <div className="sol-filters">
        <div className="sol-search">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-400)' }} />
            <input className="form-input" style={{ paddingLeft: '2.25rem' }} placeholder="Rechercher dans le journal…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <select className="form-select" value={fActor} onChange={(e) => setFActor(e.target.value)}>
          <option value="">Tous les auteurs</option>
          {actors.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? <EmptyState message="Aucune entrée d'audit ne correspond." /> : (
        <div className="sol-chart">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <ShieldCheck size={20} style={{ color: 'var(--color-primary-600)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{filtered.length} entrée(s) d'audit</span>
          </div>
          <div className="sol-timeline">
            {filtered.map((e) => (
              <div key={e.id} className="sol-timeline-item">
                <div className="sol-timeline-dot" />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {e.actor === 'Système' ? <FileText size={16} style={{ color: 'var(--color-neutral-500)' }} /> : <User size={16} style={{ color: 'var(--color-primary-600)' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="sol-timeline-date">{new Date(e.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })} à {new Date(e.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="sol-timeline-title">{e.action}</div>
                    <div className="sol-timeline-desc">
                      <span style={{ fontWeight: 500 }}>{e.actor}</span> - {e.entity}
                      {e.amount !== null && <span style={{ marginLeft: '0.5rem', fontWeight: 600, color: 'var(--color-primary-600)' }}>{formatCurrencyFCFA(e.amount)}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--color-neutral-500)' }}>Ancienne valeur: <strong>{e.oldValue}</strong></span>
                      <span style={{ color: 'var(--color-neutral-500)' }}>Nouvelle valeur: <strong style={{ color: 'var(--color-primary-600)' }}>{e.newValue}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

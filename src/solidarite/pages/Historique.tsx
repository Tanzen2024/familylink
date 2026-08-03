import { useState } from 'react'
import { Search, HelpCircle, PiggyBank, Calendar, UserCheck } from 'lucide-react'
import { mockHistory } from '../mockData'
import { EmptyState } from '../ui'
import type { HistoryEntry } from '../types'

const TYPE_ICONS: Record<HistoryEntry['type'], typeof HelpCircle> = {
  'Aide': HelpCircle,
  'Collecte': PiggyBank,
  'Événement': Calendar,
  'Accompagnement': UserCheck,
}

const TYPE_COLORS: Record<HistoryEntry['type'], { bg: string; color: string }> = {
  'Aide': { bg: '#dbeafe', color: '#1e40af' },
  'Collecte': { bg: '#fef3c7', color: '#92400e' },
  'Événement': { bg: '#fce7f3', color: '#9d174d' },
  'Accompagnement': { bg: '#d1fae5', color: '#065f46' },
}

export default function Historique() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')

  const filtered = mockHistory.filter((h) => {
    if (search && !h.title.toLowerCase().includes(search.toLowerCase()) && !h.description.toLowerCase().includes(search.toLowerCase())) return false
    if (filterType && h.type !== filterType) return false
    return true
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Historique</h1>
          <p>Toutes les actions de solidarité, dans l'ordre chronologique</p>
        </div>
      </div>

      <div className="sol-filters">
        <div className="sol-search">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-400)' }} />
            <input className="form-input" style={{ paddingLeft: '2.25rem' }} placeholder="Rechercher dans l'historique…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">Tous les types</option>
          <option value="Aide">Aide</option>
          <option value="Collecte">Collecte</option>
          <option value="Événement">Événement</option>
          <option value="Accompagnement">Accompagnement</option>
        </select>
      </div>

      {filtered.length === 0 ? <EmptyState message="Aucune entrée d'historique ne correspond." /> : (
        <div className="sol-chart">
          <div className="sol-timeline">
            {filtered.map((h) => {
              const Icon = TYPE_ICONS[h.type]
              const { bg, color } = TYPE_COLORS[h.type]
              return (
                <div key={h.id} className="sol-timeline-item">
                  <div className="sol-timeline-dot" style={{ background: color, boxShadow: `0 0 0 2px ${bg}` }} />
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="sol-timeline-date">{new Date(h.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
                      <div className="sol-timeline-title">{h.title}</div>
                      <div className="sol-timeline-desc">{h.description}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-400)', marginTop: '0.25rem' }}>
                        <span className="sol-badge" style={{ background: bg, color }}>{h.type}</span>
                        <span style={{ marginLeft: '0.5rem' }}>par {h.actor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

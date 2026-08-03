import { Building2, MapPin, Calendar, TrendingUp } from 'lucide-react'
import { mockHeritage, mockProjects } from '../mockData'
import { formatMoney, EmptyState } from '../ui'

export default function Patrimoine() {
  const totalValue = mockHeritage.reduce((s, h) => s + h.value, 0)

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Patrimoine créé</h1>
          <p>Biens et réalisations durables de l'association</p>
        </div>
      </div>

      <div className="sol-kpi" style={{ marginBottom: '1.5rem', maxWidth: '350px' }}>
        <div className="sol-kpi-icon" style={{ background: '#e0e7ff', color: '#3730a3' }}><Building2 size={24} /></div>
        <div>
          <div className="sol-kpi-value">{formatMoney(totalValue)}</div>
          <div className="sol-kpi-label">Valeur totale du patrimoine</div>
        </div>
      </div>

      {mockHeritage.length === 0 ? <EmptyState message="Aucun patrimoine créé pour le moment." /> : (
        <div className="grid-2">
          {mockHeritage.map((h) => {
            const project = mockProjects.find((p) => p.id === h.projectId)
            return (
              <div key={h.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-sm)', background: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={26} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{h.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>{h.category}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--color-neutral-500)', marginBottom: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {h.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> {new Date(h.completedDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.75rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)' }}>
                  <TrendingUp size={16} style={{ color: 'var(--color-primary-600)' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary-600)' }}>{formatMoney(h.value)}</span>
                </div>
                {project && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>
                    Issu du projet: <strong style={{ color: 'var(--color-neutral-700)' }}>{project.number}</strong>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

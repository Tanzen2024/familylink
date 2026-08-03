import { HelpCircle, CheckCircle2, PiggyBank, Calendar, TrendingUp, ArrowRight } from 'lucide-react'
import { mockRequests, mockCollections, mockHistory } from '../mockData'
import { CategoryBadge, StatusBadge, formatMoney, ProgressBar } from '../ui'

export default function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const openCount = mockRequests.filter((r) => r.status === 'Nouvelle' || r.status === 'En cours').length
  const treatedCount = mockRequests.filter((r) => r.status === 'Terminée' || r.status === 'Validée').length
  const activeCollections = mockCollections.filter((c) => c.collectedAmount < c.targetAmount).length
  const totalCollected = mockCollections.reduce((sum, c) => sum + c.collectedAmount, 0)

  const recentRequests = mockRequests.slice(0, 5)
  const recentAids = mockHistory.filter((h) => h.type === 'Aide' || h.type === 'Collecte').slice(0, 5)

  const monthlyData = [
    { month: 'Fév', value: 3 },
    { month: 'Mar', value: 5 },
    { month: 'Avr', value: 4 },
    { month: 'Mai', value: 7 },
    { month: 'Jun', value: 6 },
    { month: 'Juil', value: 10 },
  ]
  const maxVal = Math.max(...monthlyData.map((d) => d.value))

  const kpis = [
    { label: 'Demandes ouvertes', value: openCount, icon: HelpCircle, bg: '#dbeafe', color: '#1e40af' },
    { label: 'Demandes traitées', value: treatedCount, icon: CheckCircle2, bg: '#d1fae5', color: '#065f46' },
    { label: 'Collectes en cours', value: activeCollections, icon: PiggyBank, bg: '#fef3c7', color: '#92400e' },
    { label: 'Total collecté', value: formatMoney(totalCollected), icon: TrendingUp, bg: '#fce7f3', color: '#9d174d' },
  ]

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Tableau de bord</h1>
          <p>Vue d'ensemble des activités de solidarité</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="sol-kpi">
              <div className="sol-kpi-icon" style={{ background: kpi.bg, color: kpi.color }}>
                <Icon size={24} />
              </div>
              <div>
                <div className="sol-kpi-value">{kpi.value}</div>
                <div className="sol-kpi-label">{kpi.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Chart + upcoming events */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="sol-chart">
          <h3>Demandes par mois (2025)</h3>
          <div className="sol-bar-chart">
            {monthlyData.map((d) => (
              <div key={d.month} className="sol-bar-wrap">
                <div className="sol-bar-value">{d.value}</div>
                <div className="sol-bar" style={{ height: `${(d.value / maxVal) * 100}%` }} />
                <div className="sol-bar-label">{d.month}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="sol-chart">
          <h3>Prochains événements</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { date: '01/08/2025', label: 'Inhumation - Papa Samuel Menthong', loc: 'Douala' },
              { date: '15/09/2025', label: 'Mariage Suzanne & Marc', loc: 'Bafoussam' },
              { date: '20/09/2025', label: 'Réunion générale trimestrielle', loc: 'Yaoundé' },
              { date: '05/10/2025', label: 'Carnaval culturel Menthong', loc: 'Bafoussam' },
            ].map((ev, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-neutral-50)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: 'var(--color-primary-100)', color: 'var(--color-primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Calendar size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-neutral-900)' }}>{ev.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>{ev.date} - {ev.loc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent requests + recent aids */}
      <div className="grid-2">
        <div className="sol-chart">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3>Dernières demandes</h3>
            <button onClick={() => onNavigate('demandes')} style={{ background: 'none', border: 'none', color: 'var(--color-primary-600)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Voir tout <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentRequests.map((r) => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-neutral-200)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{r.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)', marginBottom: '0.5rem' }}>{r.number} - {r.author}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <CategoryBadge category={r.category} />
                    <StatusBadge status={r.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sol-chart">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3>Dernières aides accordées</h3>
            <button onClick={() => onNavigate('historique')} style={{ background: 'none', border: 'none', color: 'var(--color-primary-600)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Voir tout <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentAids.map((h) => (
              <div key={h.id} style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-neutral-200)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{h.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>{h.date} - par {h.actor}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active collections summary */}
      <div style={{ marginTop: '1.5rem' }}>
        <div className="sol-chart">
          <h3>Collectes en cours</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mockCollections.filter((c) => c.collectedAmount < c.targetAmount).map((c) => (
              <div key={c.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.title}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>{formatMoney(c.collectedAmount)} / {formatMoney(c.targetAmount)}</span>
                </div>
                <ProgressBar value={c.collectedAmount} max={c.targetAmount} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

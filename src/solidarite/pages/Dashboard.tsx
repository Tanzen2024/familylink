import { HelpCircle, CheckCircle2, PiggyBank, Calendar, TrendingUp, ArrowRight } from 'lucide-react'
import { mockRequests, mockCollections, mockHistory } from '../mockData'
import { CategoryBadge, StatusBadge, formatMoney, ProgressBar, kpiValueSizeClass } from '../ui'

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

  const upcomingEvents = [
    { date: '01/08/2025', label: 'Inhumation - Papa Samuel Menthong', loc: 'Douala' },
    { date: '15/09/2025', label: 'Mariage Suzanne & Marc', loc: 'Bafoussam' },
    { date: '20/09/2025', label: 'Réunion générale trimestrielle', loc: 'Yaoundé' },
    { date: '05/10/2025', label: 'Carnaval culturel Menthong', loc: 'Bafoussam' },
  ]

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Tableau de bord</h1>
          <p>Vue d'ensemble des activités de solidarité</p>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          const value = String(kpi.value)
          return (
            <div key={kpi.label} className="sol-kpi">
              <div className="sol-kpi-icon" style={{ background: kpi.bg, color: kpi.color }}>
                <Icon size={24} />
              </div>
              <div>
                <div className={`sol-kpi-value ${kpiValueSizeClass(value)}`}>{value}</div>
                <div className="sol-kpi-label">{kpi.label}</div>
              </div>
            </div>
          )
        })}
      </div>

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
          <div className="sol-stack">
            {upcomingEvents.map((ev, i) => (
              <div key={i} className="sol-event-item">
                <div className="sol-event-icon">
                  <Calendar size={20} />
                </div>
                <div>
                  <div className="sol-event-title">{ev.label}</div>
                  <div className="sol-event-meta">{ev.date} - {ev.loc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="sol-chart">
          <div className="sol-panel-header">
            <h3>Dernières demandes</h3>
            <button className="sol-link-btn" onClick={() => onNavigate('demandes')}>
              Voir tout <ArrowRight size={14} />
            </button>
          </div>
          <div className="sol-stack">
            {recentRequests.map((r) => (
              <div key={r.id} className="sol-list-item">
                <div className="sol-list-item-title">{r.title}</div>
                <div className="sol-list-item-meta">{r.number} - {r.author}</div>
                <div className="sol-list-item-tags">
                  <CategoryBadge category={r.category} />
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sol-chart">
          <div className="sol-panel-header">
            <h3>Dernières aides accordées</h3>
            <button className="sol-link-btn" onClick={() => onNavigate('historique')}>
              Voir tout <ArrowRight size={14} />
            </button>
          </div>
          <div className="sol-stack">
            {recentAids.map((h) => (
              <div key={h.id} className="sol-list-item">
                <div className="sol-list-item-title">{h.title}</div>
                <div className="sol-list-item-meta" style={{ marginBottom: 0 }}>{h.date} - par {h.actor}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <div className="sol-chart">
          <h3>Collectes en cours</h3>
          <div className="sol-stack sol-stack-lg">
            {mockCollections.filter((c) => c.collectedAmount < c.targetAmount).map((c) => (
              <div key={c.id}>
                <div className="sol-collect-row">
                  <span className="sol-collect-title">{c.title}</span>
                  <span className="sol-collect-amount">{formatMoney(c.collectedAmount)} / {formatMoney(c.targetAmount)}</span>
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

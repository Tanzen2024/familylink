import { useMemo } from 'react'
import {
  Wallet, Users, Gift, PiggyBank, TrendingDown, TrendingUp, ArrowRight,
  CheckCircle2, AlertCircle,
} from 'lucide-react'
import {
  mockContributions, mockDonations, mockFinCollections, mockExpenses,
  mockIncomes, mockAccounts, monthlyIncomeData, monthlyExpenseData,
} from '../mockData'
import { formatMoney, formatMoneyShort, KpiCard } from '../ui'

// Teintes bg/texte réutilisées par plusieurs KPI et par les opérations récentes —
// centralisées ici plutôt que répétées en dur à chaque usage (voir .finances en CSS).
const FIN_TINTS = {
  blue: { bg: 'var(--fin-blue-bg)', color: 'var(--fin-blue)' },
  green: { bg: 'var(--fin-green-bg)', color: 'var(--fin-green)' },
  pink: { bg: 'var(--fin-pink-bg)', color: 'var(--fin-pink)' },
  amber: { bg: 'var(--fin-amber-bg)', color: 'var(--fin-amber)' },
  red: { bg: 'var(--fin-red-bg)', color: 'var(--fin-red)' },
} as const

export default function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const totalBalance = mockAccounts.reduce((s, a) => s + a.balance, 0)
  const totalContributions = mockContributions.reduce((s, c) => s + c.paidAmount, 0)
  const totalDonations = mockDonations.reduce((s, d) => s + d.amount, 0)
  const totalCollections = mockFinCollections.reduce((s, c) => s + c.collectedAmount, 0)
  const monthExpenses = mockExpenses.filter((e) => e.date.startsWith('2025-07')).reduce((s, e) => s + e.amount, 0)
  const monthIncomes = mockIncomes.filter((i) => i.date.startsWith('2025-07')).reduce((s, i) => s + i.amount, 0)
  const upToDateCount = mockContributions.filter((c) => c.status === 'Payé').length
  const lateCount = mockContributions.filter((c) => c.status === 'En retard').length

  const kpis = [
    { label: 'Solde actuel', value: formatMoney(totalBalance), icon: Wallet, ...FIN_TINTS.blue, nav: 'comptes' },
    { label: 'Total cotisations', value: formatMoney(totalContributions), icon: Users, ...FIN_TINTS.green, nav: 'cotisations' },
    { label: 'Total dons', value: formatMoney(totalDonations), icon: Gift, ...FIN_TINTS.pink, nav: 'dons' },
    { label: 'Total collectes', value: formatMoney(totalCollections), icon: PiggyBank, ...FIN_TINTS.amber, nav: 'collectes' },
    { label: 'Recettes du mois', value: formatMoney(monthIncomes), icon: TrendingUp, ...FIN_TINTS.green, nav: 'recettes' },
    { label: 'Dépenses du mois', value: formatMoney(monthExpenses), icon: TrendingDown, ...FIN_TINTS.red, nav: 'depenses' },
    { label: 'Membres à jour', value: `${upToDateCount} / ${mockContributions.length}`, icon: CheckCircle2, ...FIN_TINTS.green, nav: 'cotisations' },
    { label: 'Membres en retard', value: String(lateCount), icon: AlertCircle, ...FIN_TINTS.red, nav: 'cotisations' },
  ]

  const maxIncome = Math.max(...monthlyIncomeData.map((d) => d.cotisations + d.dons + d.collectes + d.subventions + d.autres))
  const maxExpense = Math.max(...monthlyExpenseData.map((d) => d.total))

  const incomeColors: Record<string, string> = {
    'Cotisations': '#3b82f6', 'Dons': '#ec4899', 'Collectes': '#f59e0b',
    'Subventions': '#10b981', 'Revenus des projets': '#6366f1', 'Autres recettes': '#6b7280',
  }
  const expenseColors: Record<string, string> = {
    'Solidarité': '#ef4444', 'Projet': '#3b82f6', 'Fonctionnement': '#6b7280',
    'Communication': '#ec4899', 'Formation': '#10b981', 'Événements': '#f59e0b', 'Administration': '#6366f1',
  }

  // Agrégations un peu plus coûteuses (itération + allocation) : mémorisées pour ne pas
  // être recalculées à chaque rendu tant que les données sources (mock, figées) ne changent pas.
  const incomeByOrigin = useMemo(() => {
    const acc: Record<string, number> = {}
    mockIncomes.forEach((i) => { acc[i.origin] = (acc[i.origin] || 0) + i.amount })
    return acc
  }, [])

  const expenseByCategory = useMemo(() => {
    const acc: Record<string, number> = {}
    mockExpenses.forEach((e) => { acc[e.category] = (acc[e.category] || 0) + e.amount })
    return acc
  }, [])

  const recentOps = useMemo(() => [
    ...mockIncomes.map((i) => ({ ...i, opType: 'credit' as const, label: i.description })),
    ...mockExpenses.map((e) => ({ ...e, opType: 'debit' as const, label: `${e.category} - ${e.beneficiary}` })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5), [])

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Tableau de bord financier</h1>
          <p>Vue d'ensemble de la santé financière de l'association</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        {kpis.map((kpi) => (
          <KpiCard
            key={kpi.label}
            icon={kpi.icon}
            label={kpi.label}
            value={kpi.value}
            bg={kpi.bg}
            color={kpi.color}
            onClick={() => onNavigate(kpi.nav)}
          />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="sol-chart">
          <div className="sol-panel-header">
            <h2>Évolution des recettes (2025)</h2>
            <button className="sol-link-btn" onClick={() => onNavigate('recettes')}>
              Voir détail <ArrowRight size={14} />
            </button>
          </div>
          <div className="sol-bar-chart">
            {monthlyIncomeData.map((d) => {
              const total = d.cotisations + d.dons + d.collectes + d.subventions + d.autres
              return (
                <div key={d.month} className="sol-bar-wrap">
                  <div className="sol-bar-value">{formatMoneyShort(total)}</div>
                  <div className="sol-bar" style={{ height: `${(total / maxIncome) * 100}%`, background: '#10b981' }} />
                  <div className="sol-bar-label">{d.month}</div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="sol-chart">
          <div className="sol-panel-header">
            <h2>Évolution des dépenses (2025)</h2>
            <button className="sol-link-btn" onClick={() => onNavigate('depenses')}>
              Voir détail <ArrowRight size={14} />
            </button>
          </div>
          <div className="sol-bar-chart">
            {monthlyExpenseData.map((d) => (
              <div key={d.month} className="sol-bar-wrap">
                <div className="sol-bar-value">{formatMoneyShort(d.total)}</div>
                <div className="sol-bar" style={{ height: `${(d.total / maxExpense) * 100}%`, background: '#ef4444' }} />
                <div className="sol-bar-label">{d.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 - Donuts */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="sol-chart">
          <div className="sol-panel-header">
            <h2>Répartition des recettes</h2>
            <button className="sol-link-btn" onClick={() => onNavigate('recettes')}>
              Voir détail <ArrowRight size={14} />
            </button>
          </div>
          <div className="fin-donut-row">
            <DonutChart data={incomeByOrigin} colors={incomeColors} centerLabel="Total" centerValue={formatMoneyShort(Object.values(incomeByOrigin).reduce((a, b) => a + b, 0))} />
            <div className="fin-legend">
              {Object.entries(incomeByOrigin).map(([key, val]) => (
                <div key={key} className="fin-legend-item">
                  <div className="fin-legend-dot" style={{ background: incomeColors[key] }} aria-hidden="true" />
                  <span className="fin-legend-label">{key}</span>
                  <span className="fin-legend-value">{formatMoneyShort(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="sol-chart">
          <div className="sol-panel-header">
            <h2>Répartition des dépenses</h2>
            <button className="sol-link-btn" onClick={() => onNavigate('depenses')}>
              Voir détail <ArrowRight size={14} />
            </button>
          </div>
          <div className="fin-donut-row">
            <DonutChart data={expenseByCategory} colors={expenseColors} centerLabel="Total" centerValue={formatMoneyShort(Object.values(expenseByCategory).reduce((a, b) => a + b, 0))} />
            <div className="fin-legend">
              {Object.entries(expenseByCategory).map(([key, val]) => (
                <div key={key} className="fin-legend-item">
                  <div className="fin-legend-dot" style={{ background: expenseColors[key] }} aria-hidden="true" />
                  <span className="fin-legend-label">{key}</span>
                  <span className="fin-legend-value">{formatMoneyShort(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cotisations by month + recent ops */}
      <div className="grid-2">
        <div className="sol-chart">
          <div className="sol-panel-header">
            <h2>Cotisations par mois</h2>
            <button className="sol-link-btn" onClick={() => onNavigate('cotisations')}>
              Voir détail <ArrowRight size={14} />
            </button>
          </div>
          <div className="sol-bar-chart">
            {monthlyIncomeData.map((d) => (
              <div key={d.month} className="sol-bar-wrap">
                <div className="sol-bar-value">{formatMoneyShort(d.cotisations)}</div>
                <div className="sol-bar" style={{ height: `${maxIncome > 0 ? (d.cotisations / maxIncome) * 100 : 0}%`, background: '#3b82f6' }} />
                <div className="sol-bar-label">{d.month}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="sol-chart">
          <div className="sol-panel-header">
            <h2>Dernières opérations</h2>
            <button className="sol-link-btn" onClick={() => onNavigate('recettes')}>
              Voir tout <ArrowRight size={14} />
            </button>
          </div>
          <div className="sol-stack" style={{ gap: '0.5rem' }}>
            {recentOps.map((op) => (
              <div key={op.id} className="fin-op-item">
                <div
                  className="fin-op-icon"
                  style={op.opType === 'credit' ? FIN_TINTS.green : FIN_TINTS.red}
                  aria-hidden="true"
                >
                  {op.opType === 'credit' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </div>
                <div className="fin-op-body">
                  <div className="fin-op-label">{op.label}</div>
                  <div className="fin-op-date">{new Date(op.date).toLocaleDateString('fr-FR')}</div>
                </div>
                <div className="fin-op-amount" style={{ color: op.opType === 'credit' ? 'var(--fin-green)' : 'var(--fin-red)' }}>
                  {op.opType === 'credit' ? '+' : '-'}{formatMoneyShort(op.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DonutChart({ data, colors, centerLabel, centerValue }: {
  data: Record<string, number>
  colors: Record<string, string>
  centerLabel: string
  centerValue: string
}) {
  const total = Object.values(data).reduce((a, b) => a + b, 0)
  const radius = 60
  const circumference = 2 * Math.PI * radius
  let offset = 0
  const segments = Object.entries(data).map(([key, val]) => {
    const pct = total > 0 ? val / total : 0
    const dash = pct * circumference
    const seg = { key, color: colors[key] || '#ccc', dash, gap: circumference - dash, offset }
    offset += dash
    return seg
  })

  return (
    <div className="fin-donut" role="img" aria-label={`${centerLabel} : ${centerValue}`}>
      <svg className="fin-donut-svg" width="160" height="160" viewBox="0 0 160 160" aria-hidden="true">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="var(--color-neutral-100)" strokeWidth="20" />
        {segments.map((seg) => (
          <circle
            key={seg.key}
            cx="80" cy="80" r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth="20"
            strokeDasharray={`${seg.dash} ${seg.gap}`}
            strokeDashoffset={-seg.offset}
          />
        ))}
      </svg>
      <div className="fin-donut-center" aria-hidden="true">
        <div className="fin-donut-center-value">{centerValue}</div>
        <div className="fin-donut-center-label">{centerLabel}</div>
      </div>
    </div>
  )
}

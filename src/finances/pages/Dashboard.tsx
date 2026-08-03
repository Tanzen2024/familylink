import {
  Wallet, Users, Gift, PiggyBank, TrendingDown, TrendingUp, ArrowRight,
  CheckCircle2, AlertCircle, Banknote,
} from 'lucide-react'
import {
  mockContributions, mockDonations, mockFinCollections, mockExpenses,
  mockIncomes, mockAccounts, monthlyIncomeData, monthlyExpenseData,
} from '../mockData'
import { formatMoney, formatMoneyShort, ProgressBar } from '../ui'
import type { IncomeOrigin, ExpenseCategory } from '../types'
import { INCOME_ORIGIN_BADGES, EXPENSE_CATEGORY_BADGES } from '../types'

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
    { label: 'Solde actuel', value: formatMoney(totalBalance), icon: Wallet, bg: '#dbeafe', color: '#1e40af' },
    { label: 'Total cotisations', value: formatMoney(totalContributions), icon: Users, bg: '#d1fae5', color: '#065f46' },
    { label: 'Total dons', value: formatMoney(totalDonations), icon: Gift, bg: '#fce7f3', color: '#9d174d' },
    { label: 'Total collectes', value: formatMoney(totalCollections), icon: PiggyBank, bg: '#fef3c7', color: '#92400e' },
    { label: 'Recettes du mois', value: formatMoney(monthIncomes), icon: TrendingUp, bg: '#d1fae5', color: '#065f46' },
    { label: 'Dépenses du mois', value: formatMoney(monthExpenses), icon: TrendingDown, bg: '#fee2e2', color: '#991b1b' },
    { label: 'Membres à jour', value: `${upToDateCount} / ${mockContributions.length}`, icon: CheckCircle2, bg: '#d1fae5', color: '#065f46' },
    { label: 'Membres en retard', value: String(lateCount), icon: AlertCircle, bg: '#fee2e2', color: '#991b1b' },
  ]

  const maxIncome = Math.max(...monthlyIncomeData.map((d) => d.cotisations + d.dons + d.collectes + d.subventions + d.autres))
  const maxExpense = Math.max(...monthlyExpenseData.map((d) => d.total))

  // Income breakdown for donut
  const incomeByOrigin: Record<string, number> = {}
  mockIncomes.forEach((i) => { incomeByOrigin[i.origin] = (incomeByOrigin[i.origin] || 0) + i.amount })
  const incomeColors: Record<string, string> = {
    'Cotisations': '#3b82f6', 'Dons': '#ec4899', 'Collectes': '#f59e0b',
    'Subventions': '#10b981', 'Revenus des projets': '#6366f1', 'Autres recettes': '#6b7280',
  }

  // Expense breakdown for donut
  const expenseByCategory: Record<string, number> = {}
  mockExpenses.forEach((e) => { expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount })
  const expenseColors: Record<string, string> = {
    'Solidarité': '#ef4444', 'Projet': '#3b82f6', 'Fonctionnement': '#6b7280',
    'Communication': '#ec4899', 'Formation': '#10b981', 'Événements': '#f59e0b', 'Administration': '#6366f1',
  }

  const recentOps = [
    ...mockIncomes.map((i) => ({ ...i, opType: 'credit' as const, label: i.description })),
    ...mockExpenses.map((e) => ({ ...e, opType: 'debit' as const, label: `${e.category} - ${e.beneficiary}` })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

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
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="sol-kpi">
              <div className="sol-kpi-icon" style={{ background: kpi.bg, color: kpi.color }}>
                <Icon size={24} />
              </div>
              <div>
                <div className="sol-kpi-value" style={{ fontSize: kpi.value.length > 15 ? '1.1rem' : '1.75rem' }}>{kpi.value}</div>
                <div className="sol-kpi-label">{kpi.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts row 1 */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="sol-chart">
          <h3>Évolution des recettes (2025)</h3>
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
          <h3>Évolution des dépenses (2025)</h3>
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
          <h3>Répartition des recettes</h3>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <DonutChart data={incomeByOrigin} colors={incomeColors} centerLabel="Total" centerValue={formatMoneyShort(Object.values(incomeByOrigin).reduce((a, b) => a + b, 0))} />
            <div className="fin-legend" style={{ flex: 1, minWidth: '180px' }}>
              {Object.entries(incomeByOrigin).map(([key, val]) => (
                <div key={key} className="fin-legend-item">
                  <div className="fin-legend-dot" style={{ background: incomeColors[key] }} />
                  <span style={{ flex: 1 }}>{key}</span>
                  <span style={{ fontWeight: 600 }}>{formatMoneyShort(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="sol-chart">
          <h3>Répartition des dépenses</h3>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <DonutChart data={expenseByCategory} colors={expenseColors} centerLabel="Total" centerValue={formatMoneyShort(Object.values(expenseByCategory).reduce((a, b) => a + b, 0))} />
            <div className="fin-legend" style={{ flex: 1, minWidth: '180px' }}>
              {Object.entries(expenseByCategory).map(([key, val]) => (
                <div key={key} className="fin-legend-item">
                  <div className="fin-legend-dot" style={{ background: expenseColors[key] }} />
                  <span style={{ flex: 1 }}>{key}</span>
                  <span style={{ fontWeight: 600 }}>{formatMoneyShort(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cotisations by month + recent ops */}
      <div className="grid-2">
        <div className="sol-chart">
          <h3>Cotisations par mois</h3>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3>Dernières opérations</h3>
            <button onClick={() => onNavigate('recettes')} style={{ background: 'none', border: 'none', color: 'var(--color-primary-600)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Voir tout <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {recentOps.map((op) => (
              <div key={op.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-neutral-200)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: op.opType === 'credit' ? '#d1fae5' : '#fee2e2', color: op.opType === 'credit' ? '#065f46' : '#991b1b' }}>
                  {op.opType === 'credit' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{op.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)' }}>{new Date(op.date).toLocaleDateString('fr-FR')}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: op.opType === 'credit' ? '#065f46' : '#991b1b', whiteSpace: 'nowrap' }}>
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
    <div className="fin-donut">
      <svg className="fin-donut-svg" width="160" height="160" viewBox="0 0 160 160">
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
      <div className="fin-donut-center">
        <div className="fin-donut-center-value">{centerValue}</div>
        <div className="fin-donut-center-label">{centerLabel}</div>
      </div>
    </div>
  )
}

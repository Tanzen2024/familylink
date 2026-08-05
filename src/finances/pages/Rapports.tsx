import { useState } from 'react'
import { FileBarChart, Download, Users, TrendingUp, TrendingDown, Scale } from 'lucide-react'
import { useToast } from '../toast'
import { formatCurrencyFCFA } from '../ui'
import { mockContributions, mockIncomes, mockExpenses, monthlyIncomeData, monthlyExpenseData } from '../mockData'

type ReportType = 'monthly' | 'annual' | 'contributions' | 'expenses' | 'incomes' | 'balance'

const REPORTS: { id: ReportType; label: string; icon: typeof FileBarChart; description: string }[] = [
  { id: 'monthly', label: 'Rapport mensuel', icon: FileBarChart, description: 'Synthèse financière du mois en cours' },
  { id: 'annual', label: 'Rapport annuel', icon: FileBarChart, description: 'Bilan complet de l\'exercice 2025' },
  { id: 'contributions', label: 'État des cotisations', icon: Users, description: 'Situation des cotisations des membres' },
  { id: 'expenses', label: 'État des dépenses', icon: TrendingDown, description: 'Détail des dépenses par catégorie' },
  { id: 'incomes', label: 'État des recettes', icon: TrendingUp, description: 'Détail des recettes par origine' },
  { id: 'balance', label: 'Bilan financier', icon: Scale, description: 'Équilibre recettes / dépenses' },
]

export default function Rapports() {
  const { notify } = useToast()
  const [selected, setSelected] = useState<ReportType | null>(null)

  const handleExport = (format: 'PDF' | 'Excel') => {
    notify('success', `Export ${format}`, `Le rapport a été exporté au format ${format}.`)
  }

  const totalIncome = mockIncomes.reduce((s, i) => s + i.amount, 0)
  const totalExpense = mockExpenses.reduce((s, e) => s + e.amount, 0)
  const balance = totalIncome - totalExpense

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Rapports</h1>
          <p>Générez et exportez vos rapports financiers</p>
        </div>
      </div>

      {!selected ? (
        <div className="grid-3">
          {REPORTS.map((r) => {
            const Icon = r.icon
            return (
              <div key={r.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(r.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{r.label}</div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-neutral-600)', lineHeight: 1.5, marginBottom: '0.75rem' }}>{r.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary" style={{ fontSize: '0.8rem', flex: 1 }} onClick={(e) => { e.stopPropagation(); handleExport('PDF') }}><Download size={14} style={{ marginRight: '0.25rem' }} /> PDF</button>
                  <button className="btn btn-secondary" style={{ fontSize: '0.8rem', flex: 1 }} onClick={(e) => { e.stopPropagation(); handleExport('Excel') }}><Download size={14} style={{ marginRight: '0.25rem' }} /> Excel</button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="sol-chart">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }} onClick={() => setSelected(null)}>← Retour</button>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{REPORTS.find((r) => r.id === selected)?.label}</h3>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-primary" style={{ fontSize: '0.8rem' }} onClick={() => handleExport('PDF')}><Download size={14} style={{ marginRight: '0.25rem' }} /> PDF</button>
              <button className="btn btn-primary" style={{ fontSize: '0.8rem' }} onClick={() => handleExport('Excel')}><Download size={14} style={{ marginRight: '0.25rem' }} /> Excel</button>
            </div>
          </div>

          {selected === 'monthly' && (
            <div>
              <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', background: '#d1fae5', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#065f46' }}>Recettes du mois</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#065f46' }}>{formatCurrencyFCFA(monthlyIncomeData[6].cotisations + monthlyIncomeData[6].dons + monthlyIncomeData[6].collectes + monthlyIncomeData[6].subventions + monthlyIncomeData[6].autres)}</div>
                </div>
                <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#991b1b' }}>Dépenses du mois</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#991b1b' }}>{formatCurrencyFCFA(monthlyExpenseData[6].total)}</div>
                </div>
                <div style={{ padding: '1rem', background: balance >= 0 ? '#dbeafe' : '#fef3c7', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: balance >= 0 ? '#1e40af' : '#92400e' }}>Solde du mois</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: balance >= 0 ? '#1e40af' : '#92400e' }}>{formatCurrencyFCFA(monthlyIncomeData[6].cotisations + monthlyIncomeData[6].dons + monthlyIncomeData[6].collectes + monthlyIncomeData[6].subventions + monthlyIncomeData[6].autres - monthlyExpenseData[6].total)}</div>
                </div>
              </div>
              <table className="sol-table">
                <thead><tr><th>Mois</th><th>Recettes</th><th>Dépenses</th><th>Solde</th></tr></thead>
                <tbody>
                  {monthlyIncomeData.map((d, i) => {
                    const inc = d.cotisations + d.dons + d.collectes + d.subventions + d.autres
                    const exp = monthlyExpenseData[i].total
                    return <tr key={d.month}><td>{d.month}</td><td style={{ color: '#065f46' }}>{formatCurrencyFCFA(inc)}</td><td style={{ color: '#991b1b' }}>{formatCurrencyFCFA(exp)}</td><td style={{ fontWeight: 700, color: inc - exp >= 0 ? '#065f46' : '#991b1b' }}>{formatCurrencyFCFA(inc - exp)}</td></tr>
                  })}
                </tbody>
              </table>
            </div>
          )}

          {selected === 'annual' && (
            <div>
              <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
                <div style={{ padding: '1.5rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-neutral-500)', marginBottom: '0.25rem' }}>Total recettes 2025</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: '#065f46' }}>{formatCurrencyFCFA(totalIncome)}</div>
                </div>
                <div style={{ padding: '1.5rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-neutral-500)', marginBottom: '0.25rem' }}>Total dépenses 2025</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: '#991b1b' }}>{formatCurrencyFCFA(totalExpense)}</div>
                </div>
              </div>
              <div style={{ padding: '1rem', background: balance >= 0 ? '#d1fae5' : '#fee2e2', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: balance >= 0 ? '#065f46' : '#991b1b' }}>Bilan financier</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: balance >= 0 ? '#065f46' : '#991b1b' }}>{formatCurrencyFCFA(balance)}</div>
              </div>
              <table className="sol-table">
                <thead><tr><th>Mois</th><th>Recettes</th><th>Dépenses</th><th>Solde</th></tr></thead>
                <tbody>
                  {monthlyIncomeData.map((d, i) => {
                    const inc = d.cotisations + d.dons + d.collectes + d.subventions + d.autres
                    const exp = monthlyExpenseData[i].total
                    return <tr key={d.month}><td>{d.month} 2025</td><td style={{ color: '#065f46' }}>{formatCurrencyFCFA(inc)}</td><td style={{ color: '#991b1b' }}>{formatCurrencyFCFA(exp)}</td><td style={{ fontWeight: 700, color: inc - exp >= 0 ? '#065f46' : '#991b1b' }}>{formatCurrencyFCFA(inc - exp)}</td></tr>
                  })}
                </tbody>
              </table>
            </div>
          )}

          {selected === 'contributions' && (
            <table className="sol-table">
              <thead><tr><th>Membre</th><th>Numéro</th><th>Attendu</th><th>Payé</th><th>Solde</th><th>Statut</th></tr></thead>
              <tbody>
                {mockContributions.map((c) => (
                  <tr key={c.id}><td style={{ fontWeight: 500 }}>{c.member}</td><td style={{ fontSize: '0.8rem' }}>{c.number}</td><td>{formatCurrencyFCFA(c.expectedAmount)}</td><td style={{ color: '#065f46' }}>{formatCurrencyFCFA(c.paidAmount)}</td><td style={{ color: c.expectedAmount - c.paidAmount > 0 ? '#991b1b' : 'inherit' }}>{formatCurrencyFCFA(c.expectedAmount - c.paidAmount)}</td><td>{c.status}</td></tr>
                ))}
              </tbody>
            </table>
          )}

          {selected === 'expenses' && (
            <table className="sol-table">
              <thead><tr><th>Référence</th><th>Catégorie</th><th>Bénéficiaire</th><th>Montant</th><th>Date</th><th>Validée</th></tr></thead>
              <tbody>
                {mockExpenses.map((e) => (
                  <tr key={e.id}><td style={{ fontSize: '0.8rem' }}>{e.reference}</td><td>{e.category}</td><td>{e.beneficiary}</td><td style={{ fontWeight: 700, color: '#991b1b' }}>{formatCurrencyFCFA(e.amount)}</td><td>{new Date(e.date).toLocaleDateString('fr-FR')}</td><td>{e.validated ? 'Oui' : 'Non'}</td></tr>
                ))}
              </tbody>
            </table>
          )}

          {selected === 'incomes' && (
            <table className="sol-table">
              <thead><tr><th>Référence</th><th>Origine</th><th>Description</th><th>Montant</th><th>Date</th></tr></thead>
              <tbody>
                {mockIncomes.map((i) => (
                  <tr key={i.id}><td style={{ fontSize: '0.8rem' }}>{i.reference}</td><td>{i.origin}</td><td>{i.description}</td><td style={{ fontWeight: 700, color: '#065f46' }}>{formatCurrencyFCFA(i.amount)}</td><td>{new Date(i.date).toLocaleDateString('fr-FR')}</td></tr>
                ))}
              </tbody>
            </table>
          )}

          {selected === 'balance' && (
            <div>
              <div style={{ padding: '2rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-neutral-500)', marginBottom: '0.5rem' }}>Bilan financier 2025</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: balance >= 0 ? '#065f46' : '#991b1b' }}>{formatCurrencyFCFA(balance)}</div>
                <div style={{ fontSize: '0.85rem', color: balance >= 0 ? '#065f46' : '#991b1b', marginTop: '0.25rem' }}>{balance >= 0 ? 'Excédent' : 'Déficit'}</div>
              </div>
              <table className="sol-table">
                <thead><tr><th>Type</th><th>Montant</th></tr></thead>
                <tbody>
                  <tr><td style={{ fontWeight: 600 }}>Total recettes</td><td style={{ fontWeight: 700, color: '#065f46' }}>{formatCurrencyFCFA(totalIncome)}</td></tr>
                  <tr><td style={{ fontWeight: 600 }}>Total dépenses</td><td style={{ fontWeight: 700, color: '#991b1b' }}>{formatCurrencyFCFA(totalExpense)}</td></tr>
                  <tr><td style={{ fontWeight: 700 }}>Bilan</td><td style={{ fontWeight: 700, color: balance >= 0 ? '#065f46' : '#991b1b' }}>{formatCurrencyFCFA(balance)}</td></tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

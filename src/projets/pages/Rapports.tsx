import { useState } from 'react'
import { FileBarChart, Download, FolderKanban, Lightbulb, Hammer, CheckCircle2, Building2, TrendingUp } from 'lucide-react'
import { useToast } from '../toast'
import { formatMoney, formatMoneyShort, ProgressBar } from '../ui'
import { mockProjects, mockIdeas, mockHeritage, mockCategories } from '../mockData'

type ReportType = 'overview' | 'ideas' | 'projects' | 'budget' | 'heritage'

const REPORTS: { id: ReportType; label: string; icon: typeof FileBarChart; description: string }[] = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: FileBarChart, description: 'Synthèse globale des projets' },
  { id: 'ideas', label: 'Rapport des idées', icon: Lightbulb, description: 'Statistiques des idées proposées' },
  { id: 'projects', label: 'Rapport des projets', icon: FolderKanban, description: 'Détail par statut et catégorie' },
  { id: 'budget', label: 'Rapport budgétaire', icon: TrendingUp, description: 'Budgets et dépenses par projet' },
  { id: 'heritage', label: 'Rapport patrimoine', icon: Building2, description: 'Biens créés et leur valeur' },
]

export default function Rapports() {
  const { notify } = useToast()
  const [selected, setSelected] = useState<ReportType | null>(null)

  const handleExport = (format: 'PDF' | 'Excel') => {
    notify('success', `Export ${format}`, `Le rapport a été exporté au format ${format}.`)
  }

  const totalBudget = mockProjects.reduce((s, p) => s + p.budget, 0)
  const totalSpent = mockProjects.reduce((s, p) => s + p.spent, 0)
  const totalHeritageValue = mockHeritage.reduce((s, h) => s + h.value, 0)

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Rapports</h1>
          <p>Générez et exportez vos rapports de projets</p>
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

          {selected === 'overview' && (
            <div>
              <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
                <div className="sol-kpi"><div className="sol-kpi-icon" style={{ background: '#dbeafe', color: '#1e40af' }}><FolderKanban size={20} /></div><div><div className="sol-kpi-value">{mockProjects.length}</div><div className="sol-kpi-label">Projets</div></div></div>
                <div className="sol-kpi"><div className="sol-kpi-icon" style={{ background: '#fef3c7', color: '#92400e' }}><Lightbulb size={20} /></div><div><div className="sol-kpi-value">{mockIdeas.length}</div><div className="sol-kpi-label">Idées</div></div></div>
                <div className="sol-kpi"><div className="sol-kpi-icon" style={{ background: '#d1fae5', color: '#065f46' }}><Building2 size={20} /></div><div><div className="sol-kpi-value">{mockHeritage.length}</div><div className="sol-kpi-label">Patrimoine</div></div></div>
                <div className="sol-kpi"><div className="sol-kpi-icon" style={{ background: '#fce7f3', color: '#9d174d' }}><TrendingUp size={20} /></div><div><div className="sol-kpi-value" style={{ fontSize: '1.1rem' }}>{formatMoneyShort(totalBudget)}</div><div className="sol-kpi-label">Budget total</div></div></div>
              </div>
              <table className="sol-table">
                <thead><tr><th>Projet</th><th>Statut</th><th>Budget</th><th>Dépensé</th><th>Progression</th></tr></thead>
                <tbody>
                  {mockProjects.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 500 }}>{p.title}</td>
                      <td>{p.status}</td>
                      <td>{formatMoney(p.budget)}</td>
                      <td style={{ color: '#991b1b' }}>{formatMoney(p.spent)}</td>
                      <td style={{ fontWeight: 600 }}>{p.progress}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selected === 'ideas' && (
            <table className="sol-table">
              <thead><tr><th>Idée</th><th>Auteur</th><th>Statut</th><th>Soutiens</th><th>Votes favorables</th><th>Commentaires</th></tr></thead>
              <tbody>
                {mockIdeas.map((i) => (
                  <tr key={i.id}>
                    <td style={{ fontWeight: 500 }}>{i.title}</td>
                    <td>{i.author}</td>
                    <td>{i.status}</td>
                    <td>{i.supports}</td>
                    <td style={{ color: '#065f46', fontWeight: 600 }}>{i.votes.favorable}</td>
                    <td>{i.comments.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selected === 'projects' && (
            <div>
              <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', background: '#dbeafe', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#1e40af' }}>Planifiés</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e40af' }}>{mockProjects.filter((p) => p.status === 'Planifié').length}</div>
                </div>
                <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#92400e' }}>En cours</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#92400e' }}>{mockProjects.filter((p) => p.status === 'En cours').length}</div>
                </div>
                <div style={{ padding: '1rem', background: '#d1fae5', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#065f46' }}>Terminés</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#065f46' }}>{mockProjects.filter((p) => p.status === 'Terminé').length}</div>
                </div>
              </div>
              <table className="sol-table">
                <thead><tr><th>Projet</th><th>Catégorie</th><th>Responsable</th><th>Statut</th><th>Progression</th></tr></thead>
                <tbody>
                  {mockProjects.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 500 }}>{p.title}</td>
                      <td>{p.category}</td>
                      <td>{p.manager}</td>
                      <td>{p.status}</td>
                      <td style={{ fontWeight: 600 }}>{p.progress}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selected === 'budget' && (
            <div>
              <div style={{ padding: '1.5rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-neutral-500)' }}>Budget total vs Dépensé</div>
                <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                  <div><span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-neutral-900)' }}>{formatMoney(totalBudget)}</span> <span style={{ fontSize: '0.85rem', color: 'var(--color-neutral-500)' }}>prévu</span></div>
                  <div><span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#991b1b' }}>{formatMoney(totalSpent)}</span> <span style={{ fontSize: '0.85rem', color: 'var(--color-neutral-500)' }}>dépensé</span></div>
                </div>
                <ProgressBar value={totalSpent} max={totalBudget} color="#f59e0b" />
              </div>
              <table className="sol-table">
                <thead><tr><th>Projet</th><th>Budget</th><th>Dépensé</th><th>Solde</th><th>% consommé</th></tr></thead>
                <tbody>
                  {mockProjects.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 500 }}>{p.title}</td>
                      <td>{formatMoney(p.budget)}</td>
                      <td style={{ color: '#991b1b' }}>{formatMoney(p.spent)}</td>
                      <td style={{ color: p.budget - p.spent >= 0 ? '#065f46' : '#991b1b', fontWeight: 600 }}>{formatMoney(p.budget - p.spent)}</td>
                      <td style={{ fontWeight: 600 }}>{p.budget > 0 ? ((p.spent / p.budget) * 100).toFixed(0) : 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selected === 'heritage' && (
            <table className="sol-table">
              <thead><tr><th>Bien</th><th>Catégorie</th><th>Localisation</th><th>Valeur</th><th>Date d'achèvement</th></tr></thead>
              <tbody>
                {mockHeritage.map((h) => (
                  <tr key={h.id}>
                    <td style={{ fontWeight: 500 }}>{h.name}</td>
                    <td>{h.category}</td>
                    <td>{h.location}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary-600)' }}>{formatMoney(h.value)}</td>
                    <td>{new Date(h.completedDate).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: 700, background: 'var(--color-neutral-50)' }}>
                  <td colSpan={3}>Valeur totale</td>
                  <td style={{ color: 'var(--color-primary-600)' }}>{formatMoney(totalHeritageValue)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

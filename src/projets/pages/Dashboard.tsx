import {
  FolderKanban, Lightbulb, Hammer, CheckCircle2, Building2,
  ArrowRight, TrendingUp, Users, ThumbsUp, MessageCircle, Vote,
} from 'lucide-react'
import { mockProjects, mockIdeas, mockHeritage } from '../mockData'
import { formatMoney, formatMoneyShort, ProgressBar, ProjectStatusBadge, kpiValueSizeClass } from '../ui'

export default function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const planifies = mockProjects.filter((p) => p.status === 'Planifié')
  const enCours = mockProjects.filter((p) => p.status === 'En cours')
  const termines = mockProjects.filter((p) => p.status === 'Terminé')
  const idees = mockIdeas
  const totalBudget = mockProjects.reduce((s, p) => s + p.budget, 0)
  const totalSpent = mockProjects.reduce((s, p) => s + p.spent, 0)

  const kpis = [
    { label: 'Total projets', value: String(mockProjects.length), icon: FolderKanban, bg: '#dbeafe', color: '#1e40af' },
    { label: 'Idées proposées', value: String(idees.length), icon: Lightbulb, bg: '#fef3c7', color: '#92400e' },
    { label: 'En cours', value: String(enCours.length), icon: Hammer, bg: '#fed7aa', color: '#9a3412' },
    { label: 'Terminés', value: String(termines.length), icon: CheckCircle2, bg: '#d1fae5', color: '#065f46' },
    { label: 'Patrimoine créé', value: String(mockHeritage.length), icon: Building2, bg: '#e0e7ff', color: '#3730a3' },
    { label: 'Budget total', value: formatMoneyShort(totalBudget), icon: TrendingUp, bg: '#fce7f3', color: '#9d174d' },
  ]

  // Projects by status for bar chart
  const statusData = [
    { label: 'Planifiés', value: planifies.length, color: '#3b82f6' },
    { label: 'En cours', value: enCours.length, color: '#f59e0b' },
    { label: 'Terminés', value: termines.length, color: '#10b981' },
  ]

  // Ideas by status
  const ideaStatusData = [
    { label: 'Nouvelles', value: mockIdeas.filter((i) => i.status === 'Nouvelle').length },
    { label: 'Discussion', value: mockIdeas.filter((i) => i.status === 'En discussion').length },
    { label: 'À l\'étude', value: mockIdeas.filter((i) => i.status === "À l'étude").length },
    { label: 'Vote', value: mockIdeas.filter((i) => i.status === 'Soumise au vote').length },
    { label: 'Acceptées', value: mockIdeas.filter((i) => i.status === 'Acceptée').length },
    { label: 'Refusées', value: mockIdeas.filter((i) => i.status === 'Refusée').length },
    { label: 'Transformées', value: mockIdeas.filter((i) => i.status === 'Transformée en projet').length },
  ]
  const maxIdeaStatus = Math.max(...ideaStatusData.map((d) => d.value), 1)

  // Lifecycle visualization
  const lifecycleSteps = [
    { icon: Lightbulb, label: 'Idée', done: true },
    { icon: MessageCircle, label: 'Discussion', done: true },
    { icon: Vote, label: 'Vote', done: true },
    { icon: CheckCircle2, label: 'Validation', done: true },
    { icon: FolderKanban, label: 'Projet', done: true },
    { icon: Hammer, label: 'Réalisation', done: false, active: true },
    { icon: Building2, label: 'Patrimoine', done: false },
  ]

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Tableau de bord</h1>
          <p>Vue d'ensemble des projets de la communauté</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="sol-kpi">
              <div className="sol-kpi-icon" style={{ background: kpi.bg, color: kpi.color }}>
                <Icon size={24} />
              </div>
              <div>
                <div className={`sol-kpi-value ${kpiValueSizeClass(kpi.value)}`}>{kpi.value}</div>
                <div className="sol-kpi-label">{kpi.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lifecycle */}
      <div className="sol-chart" style={{ marginBottom: '1.5rem' }}>
        <h3>Cycle de vie des projets</h3>
        <div className="prj-lifecycle">
          {lifecycleSteps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i}>
                <div className={`prj-lifecycle-step ${step.done ? 'done' : ''} ${step.active ? 'active' : ''}`}>
                  <div className="prj-lifecycle-icon"><Icon size={20} /></div>
                  <div className="prj-lifecycle-label">{step.label}</div>
                </div>
                {i < lifecycleSteps.length - 1 && <div className="prj-lifecycle-arrow">↓</div>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="sol-chart">
          <h3>Projets par statut</h3>
          <div className="sol-bar-chart">
            {statusData.map((d) => (
              <div key={d.label} className="sol-bar-wrap">
                <div className="sol-bar-value">{d.value}</div>
                <div className="sol-bar" style={{ height: `${(d.value / Math.max(...statusData.map((s) => s.value), 1)) * 100}%`, background: d.color }} />
                <div className="sol-bar-label">{d.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="sol-chart">
          <h3>Idées par statut</h3>
          <div className="sol-bar-chart">
            {ideaStatusData.map((d) => (
              <div key={d.label} className="sol-bar-wrap">
                <div className="sol-bar-value">{d.value}</div>
                <div className="sol-bar" style={{ height: `${(d.value / maxIdeaStatus) * 100}%`, background: '#6366f1' }} />
                <div className="sol-bar-label">{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget overview + recent ideas */}
      <div className="grid-2">
        <div className="sol-chart">
          <div className="sol-panel-header">
            <h3>Budget global</h3>
            <button className="sol-link-btn" onClick={() => onNavigate('all')}>
              Voir projets <ArrowRight size={14} />
            </button>
          </div>
          <div className="prj-budget-panel">
            <div className="prj-budget-row">
              <span className="prj-budget-label">Budget total</span>
              <span className="prj-budget-value">{formatMoney(totalBudget)}</span>
            </div>
            <div className="prj-budget-row">
              <span className="prj-budget-label">Dépensé</span>
              <span className="prj-budget-value" style={{ color: '#991b1b' }}>{formatMoney(totalSpent)}</span>
            </div>
            <ProgressBar value={totalSpent} max={totalBudget} color="#f59e0b" />
            <div className="prj-budget-meta">
              {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}% consommé
            </div>
          </div>
          <div className="sol-stack" style={{ gap: '0.5rem' }}>
            {mockProjects.slice(0, 4).map((p) => (
              <div key={p.id} className="prj-mini-row">
                <div className="prj-mini-body">
                  <div className="prj-mini-title">{p.title}</div>
                  <div className="prj-mini-meta">{formatMoneyShort(p.spent)} / {formatMoneyShort(p.budget)}</div>
                </div>
                <div className="prj-mini-progress"><ProgressBar value={p.spent} max={p.budget} color={p.progress >= 100 ? '#10b981' : '#f59e0b'} /></div>
                <ProjectStatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="sol-chart">
          <div className="sol-panel-header">
            <h3>Dernières idées</h3>
            <button className="sol-link-btn" onClick={() => onNavigate('idees')}>
              Voir tout <ArrowRight size={14} />
            </button>
          </div>
          <div className="sol-stack" style={{ gap: '0.5rem' }}>
            {idees.slice(0, 5).map((idea) => (
              <div key={idea.id} className="prj-idea-mini">
                <div className="prj-idea-mini-title">{idea.title}</div>
                <div className="prj-idea-mini-footer">
                  <span>{idea.author}</span>
                  <span className="prj-idea-mini-stats">
                    <span className="prj-idea-mini-stat"><Users size={12} /> {idea.supports}</span>
                    <span className="prj-idea-mini-stat"><ThumbsUp size={12} /> {idea.votes.favorable}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

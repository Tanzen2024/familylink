import { useState, useMemo } from 'react'
import { Search, MapPin, Users, Calendar, Eye } from 'lucide-react'
import { mockProjects } from '../mockData'
import { Modal, ProjectStatusBadge, ProgressBar, formatMoney, EmptyState } from '../ui'
import type { Project, ProjectStatus } from '../types'

const STATUSES: ProjectStatus[] = ['Planifié', 'En cours', 'Terminé']

export default function AllProjects() {
  const [search, setSearch] = useState('')
  const [fStatus, setFStatus] = useState('')
  const [fCategory, setFCategory] = useState('')
  const [selected, setSelected] = useState<Project | null>(null)

  const categories = Array.from(new Set(mockProjects.map((p) => p.category)))

  const filtered = useMemo(() => mockProjects.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.number.toLowerCase().includes(search.toLowerCase())) return false
    if (fStatus && p.status !== fStatus) return false
    if (fCategory && p.category !== fCategory) return false
    return true
  }), [search, fStatus, fCategory])

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Tous les projets</h1>
          <p>Vue d'ensemble de tous les projets de la communauté</p>
        </div>
      </div>

      <div className="sol-filters">
        <div className="sol-search">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-400)' }} />
            <input className="form-input" style={{ paddingLeft: '2.25rem' }} placeholder="Rechercher un projet…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <select className="form-select" value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="form-select" value={fCategory} onChange={(e) => setFCategory(e.target.value)}>
          <option value="">Toutes les catégories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? <EmptyState message="Aucun projet ne correspond à vos filtres." /> : (
        <div className="grid-2">
          {filtered.map((p) => (
            <div key={p.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(p)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-neutral-400)', fontWeight: 600 }}>{p.number}</span>
                <ProjectStatusBadge status={p.status} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{p.title}</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-neutral-600)', marginBottom: '0.75rem', lineHeight: 1.5 }}>{p.description}</p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--color-neutral-500)', marginBottom: '0.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {p.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={14} /> {p.team.length} membres</span>
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-neutral-500)' }}>Budget: <strong style={{ color: 'var(--color-neutral-800)' }}>{formatMoney(p.budget)}</strong></span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-neutral-500)' }}>Dépensé: <strong style={{ color: '#991b1b' }}>{formatMoney(p.spent)}</strong></span>
                </div>
                <ProgressBar value={p.spent} max={p.budget} color={p.progress >= 100 ? '#10b981' : '#f59e0b'} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> {new Date(p.startDate).toLocaleDateString('fr-FR')}</span>
                <span style={{ fontWeight: 600, color: 'var(--color-primary-600)' }}>{p.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && <ProjectDetail project={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

export function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <Modal title={`${project.number} - ${project.title}`} onClose={onClose} maxWidth="700px">
      <div className="sol-info-row"><span className="sol-info-label">Statut</span><ProjectStatusBadge status={project.status} /></div>
      <div className="sol-info-row"><span className="sol-info-label">Catégorie</span><span className="sol-info-value">{project.category}</span></div>
      <div className="sol-info-row"><span className="sol-info-label">Localisation</span><span className="sol-info-value">{project.location}</span></div>
      <div className="sol-info-row"><span className="sol-info-label">Responsable</span><span className="sol-info-value">{project.manager}</span></div>
      <div className="sol-info-row"><span className="sol-info-label">Équipe</span><span className="sol-info-value">{project.team.join(', ')}</span></div>
      <div className="sol-info-row"><span className="sol-info-label">Période</span><span className="sol-info-value">{new Date(project.startDate).toLocaleDateString('fr-FR')} - {new Date(project.endDate).toLocaleDateString('fr-FR')}</span></div>

      <p style={{ fontSize: '0.9rem', color: 'var(--color-neutral-700)', lineHeight: 1.6, marginTop: '0.75rem', marginBottom: '1rem' }}>{project.description}</p>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Budget</span>
          <span style={{ fontSize: '0.875rem' }}>{formatMoney(project.spent)} / {formatMoney(project.budget)}</span>
        </div>
        <ProgressBar value={project.spent} max={project.budget} color={project.progress >= 100 ? '#10b981' : '#f59e0b'} />
        <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)', marginTop: '0.25rem' }}>{project.progress}% complété</div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Tâches ({project.tasks.filter((t) => t.done).length}/{project.tasks.length})</div>
        {project.tasks.map((t) => (
          <div key={t.id} className={`prj-checklist-item ${t.done ? 'done' : ''}`}>
            <div className={`sol-check ${t.done ? 'checked' : ''}`} />
            <span className="prj-checklist-text">{t.label}</span>
          </div>
        ))}
      </div>

      {project.documents.length > 0 && (
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Documents</div>
          {project.documents.map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
              <Eye size={16} style={{ color: 'var(--color-neutral-400)' }} /> {d}
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}

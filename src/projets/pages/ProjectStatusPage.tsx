import { useState } from 'react'
import { Search, CalendarClock, MapPin, Users } from 'lucide-react'
import { mockProjects } from '../mockData'
import { Modal, ProgressBar, formatMoney, EmptyState } from '../ui'
import { ProjectDetail } from './AllProjects'
import type { Project, ProjectStatus } from '../types'

export default function ProjectStatusPage({ status, title, description, icon: Icon }: {
  status: ProjectStatus
  title: string
  description: string
  icon: typeof CalendarClock
}) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Project | null>(null)

  const projects = mockProjects.filter((p) => p.status === status)
  const filtered = projects.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.number.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>

      <div className="sol-filters">
        <div className="sol-search">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-400)' }} />
            <input className="form-input" style={{ paddingLeft: '2.25rem' }} placeholder="Rechercher…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? <EmptyState message={`Aucun projet ${status.toLowerCase()}.`} /> : (
        <div className="grid-2">
          {filtered.map((p) => (
            <div key={p.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(p)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: status === 'Planifié' ? '#dbeafe' : status === 'En cours' ? '#fef3c7' : '#d1fae5',
                  color: status === 'Planifié' ? '#1e40af' : status === 'En cours' ? '#92400e' : '#065f46' }}>
                  <Icon size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-400)', fontWeight: 600 }}>{p.number}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{p.title}</div>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-neutral-600)', marginBottom: '0.75rem', lineHeight: 1.5 }}>{p.description}</p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--color-neutral-500)', marginBottom: '0.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {p.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={14} /> {p.team.length}</span>
              </div>
              {p.status !== 'Planifié' && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-neutral-500)' }}>Progression</span>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary-600)' }}>{p.progress}%</span>
                  </div>
                  <ProgressBar value={p.progress} max={100} color={p.progress >= 100 ? '#10b981' : '#f59e0b'} />
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>
                <span>Budget: {formatMoney(p.budget)}</span>
                <span>Resp: {p.manager}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && <ProjectDetail project={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

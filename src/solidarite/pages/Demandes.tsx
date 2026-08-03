import { useState, useMemo } from 'react'
import { Plus, Search, MessageSquare, Paperclip, Filter } from 'lucide-react'
import { mockRequests } from '../mockData'
import { useToast } from '../ToastContext'
import { Modal, CategoryBadge, StatusBadge, UrgencyBadge, EmptyState } from '../ui'
import type { HelpRequest, RequestCategory, RequestStatus, UrgencyLevel } from '../types'

const CATEGORIES: RequestCategory[] = ['Décès', 'Maladie', 'Mariage', 'Études', 'Emploi', 'Juridique', 'Administratif', 'Autre']
const STATUSES: RequestStatus[] = ['Nouvelle', 'En cours', 'Validée', 'Refusée', 'Terminée']
const URGENCIES: UrgencyLevel[] = ['Faible', 'Moyenne', 'Élevée', 'Critique']

export default function Demandes() {
  const { notify } = useToast()
  const [requests, setRequests] = useState<HelpRequest[]>(mockRequests)
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<HelpRequest | null>(null)
  const [search, setSearch] = useState('')
  const [fCat, setFCat] = useState('')
  const [fStatus, setFStatus] = useState('')
  const [fUrgency, setFUrgency] = useState('')
  const [view, setView] = useState<'list' | 'kanban'>('list')

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.number.toLowerCase().includes(search.toLowerCase())) return false
      if (fCat && r.category !== fCat) return false
      if (fStatus && r.status !== fStatus) return false
      if (fUrgency && r.urgency !== fUrgency) return false
      return true
    })
  }, [requests, search, fCat, fStatus, fUrgency])

  const kanbanCols: RequestStatus[] = ['Nouvelle', 'En cours', 'Validée', 'Refusée', 'Terminée']

  const handleCreate = (data: Omit<HelpRequest, 'id' | 'number' | 'status' | 'attachments' | 'comments'>) => {
    const num = `DEM-2025-${String(requests.length + 1).padStart(3, '0')}`
    const newReq: HelpRequest = {
      ...data, id: `r${Date.now()}`, number: num, status: 'Nouvelle', attachments: [], comments: [],
    }
    setRequests((prev) => [newReq, ...prev])
    setShowForm(false)
    notify('success', 'Demande créée', `${num} - ${data.title}`)
  }

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Demandes d'aide</h1>
          <p>Gérez et suivez toutes les demandes de la communauté</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} style={{ marginRight: '0.25rem' }} /> Nouvelle demande
        </button>
      </div>

      {/* Search + Filters */}
      <div className="sol-filters">
        <div className="sol-search">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-400)' }} />
            <input className="form-input" style={{ paddingLeft: '2.25rem' }} placeholder="Rechercher par titre ou numéro…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <select className="form-select" value={fCat} onChange={(e) => setFCat(e.target.value)}>
          <option value="">Toutes catégories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="form-select" value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
          <option value="">Tous statuts</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="form-select" value={fUrgency} onChange={(e) => setFUrgency(e.target.value)}>
          <option value="">Toutes urgences</option>
          {URGENCIES.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>

      {/* View toggle */}
      <div className="sol-tabs">
        <div className={`sol-tab ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>Liste</div>
        <div className={`sol-tab ${view === 'kanban' ? 'active' : ''}`} onClick={() => setView('kanban')}>Kanban</div>
      </div>

      {view === 'list' ? (
        filtered.length === 0 ? (
          <EmptyState message="Aucune demande ne correspond à vos filtres." />
        ) : (
          <div className="grid-2">
            {filtered.map((r) => (
              <div key={r.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(r)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-neutral-400)', fontWeight: 600 }}>{r.number}</span>
                  <UrgencyBadge urgency={r.urgency} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{r.title}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-neutral-600)', marginBottom: '0.75rem', lineHeight: 1.5 }}>{r.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <CategoryBadge category={r.category} />
                  <StatusBadge status={r.status} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--color-neutral-500)', borderTop: '1px solid var(--color-neutral-100)', paddingTop: '0.5rem' }}>
                  <span>{r.author}</span>
                  <span>{new Date(r.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-neutral-400)' }}>
                  {r.attachments.length > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Paperclip size={14} /> {r.attachments.length}</span>}
                  {r.comments.length > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MessageSquare size={14} /> {r.comments.length}</span>}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="sol-kanban">
          {kanbanCols.map((col) => {
            const items = filtered.filter((r) => r.status === col)
            return (
              <div key={col} className="sol-kanban-col">
                <div className="sol-kanban-col-header">
                  <span>{col}</span>
                  <span style={{ background: 'var(--color-neutral-200)', borderRadius: '999px', padding: '0.1rem 0.5rem', fontSize: '0.75rem' }}>{items.length}</span>
                </div>
                {items.map((r) => (
                  <div key={r.id} className="sol-kanban-card" onClick={() => setSelected(r)}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-400)', marginBottom: '0.25rem' }}>{r.number}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>{r.title}</div>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      <CategoryBadge category={r.category} />
                      <UrgencyBadge urgency={r.urgency} />
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}

      {/* New request form */}
      {showForm && <RequestForm onClose={() => setShowForm(false)} onCreate={handleCreate} />}

      {/* Detail modal */}
      {selected && <RequestDetail request={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function RequestForm({ onClose, onCreate }: {
  onClose: () => void
  onCreate: (data: Omit<HelpRequest, 'id' | 'number' | 'status' | 'attachments' | 'comments'>) => void
}) {
  const [form, setForm] = useState({
    title: '', description: '', category: 'Autre' as RequestCategory, urgency: 'Moyenne' as UrgencyLevel,
    date: new Date().toISOString().slice(0, 10), author: '', assignee: '', city: '', country: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreate({
      ...form,
      assignee: form.assignee || null,
      city: form.city || undefined,
      country: form.country || undefined,
    })
  }

  return (
    <Modal title="Nouvelle demande" onClose={onClose} maxWidth="600px">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Titre *</label>
          <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea className="form-textarea" style={{ minHeight: '100px' }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Catégorie *</label>
            <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as RequestCategory })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Urgence *</label>
            <select className="form-select" value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value as UrgencyLevel })}>
              {URGENCIES.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Date *</label>
            <input type="date" className="form-input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Auteur *</label>
            <input className="form-input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Responsable</label>
            <input className="form-input" value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Ville</label>
            <input className="form-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn btn-primary">Créer la demande</button>
        </div>
      </form>
    </Modal>
  )
}

function RequestDetail({ request, onClose }: { request: HelpRequest; onClose: () => void }) {
  return (
    <Modal title={`${request.number} - ${request.title}`} onClose={onClose} maxWidth="650px">
      <div className="sol-info-row"><span className="sol-info-label">Description</span></div>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-neutral-700)', lineHeight: 1.6, marginBottom: '1rem' }}>{request.description}</p>
      <div className="sol-info-row"><span className="sol-info-label">Catégorie</span><CategoryBadge category={request.category} /></div>
      <div className="sol-info-row"><span className="sol-info-label">Statut</span><StatusBadge status={request.status} /></div>
      <div className="sol-info-row"><span className="sol-info-label">Urgence</span><UrgencyBadge urgency={request.urgency} /></div>
      <div className="sol-info-row"><span className="sol-info-label">Date</span><span className="sol-info-value">{new Date(request.date).toLocaleDateString('fr-FR')}</span></div>
      <div className="sol-info-row"><span className="sol-info-label">Auteur</span><span className="sol-info-value">{request.author}</span></div>
      <div className="sol-info-row"><span className="sol-info-label">Responsable</span><span className="sol-info-value">{request.assignee ?? 'Non assigné'}</span></div>
      {request.city && <div className="sol-info-row"><span className="sol-info-label">Ville</span><span className="sol-info-value">{request.city}, {request.country}</span></div>}

      {request.attachments.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Pièces jointes</div>
          {request.attachments.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
              <Paperclip size={16} style={{ color: 'var(--color-neutral-400)' }} /> {a}
            </div>
          ))}
        </div>
      )}

      {request.comments.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Commentaires</div>
          {request.comments.map((c, i) => (
            <div key={i} style={{ padding: '0.75rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.author}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-neutral-400)' }}>{new Date(c.date).toLocaleDateString('fr-FR')}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-neutral-700)' }}>{c.text}</p>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}

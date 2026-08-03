import { useState, useMemo } from 'react'
import { Plus, Search, ThumbsUp, ThumbsDown, Minus, Eye, Users, MessageSquare, CheckCircle2, ArrowRight, Paperclip } from 'lucide-react'
import { mockIdeas, mockProjects } from '../mockData'
import { useToast } from '../toast'
import { Modal, IdeaStatusBadge, PriorityBadge, formatMoney, EmptyState } from '../ui'
import type { Idea, IdeaStatus, Priority, VoteChoice, IdeaComment } from '../types'
import { VOTE_COLORS } from '../types'

const STATUSES: IdeaStatus[] = ['Nouvelle', 'En discussion', "À l'étude", 'Soumise au vote', 'Acceptée', 'Refusée', 'Transformée en projet']
const PRIORITIES: Priority[] = ['Faible', 'Moyenne', 'Élevée', 'Critique']
const REACTION_TYPES = ['👍', '❤️', '👏']

export default function Idees() {
  const { notify } = useToast()
  const [ideas, setIdeas] = useState<Idea[]>(mockIdeas)
  const [projects, setProjects] = useState(mockProjects)
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<Idea | null>(null)
  const [search, setSearch] = useState('')
  const [fStatus, setFStatus] = useState('')

  const filtered = useMemo(() => ideas.filter((i) => {
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) && !i.author.toLowerCase().includes(search.toLowerCase())) return false
    if (fStatus && i.status !== fStatus) return false
    return true
  }), [ideas, search, fStatus])

  const handleVote = (id: string, choice: VoteChoice) => {
    setIdeas((prev) => prev.map((i) => {
      if (i.id !== id) return i
      const votes = { ...i.votes }
      votes[choice.toLowerCase() as 'favorable' | 'unfavorable' | 'abstention'] += 1
      return { ...i, votes }
    }))
    notify('success', 'Vote enregistré', `Vous avez voté: ${choice}.`)
  }

  const handleReact = (id: string, reactionType: string) => {
    setIdeas((prev) => prev.map((i) => {
      if (i.id !== id) return i
      const reactions = i.reactions.map((r) => r.type === reactionType ? { ...r, count: r.count + 1 } : r)
      return { ...i, reactions }
    }))
  }

  const handleSupport = (id: string) => {
    setIdeas((prev) => prev.map((i) => i.id === id ? { ...i, supports: i.supports + 1 } : i))
    notify('success', 'Soutien ajouté', 'Vous soutenez cette idée.')
  }

  const handleComment = (id: string, text: string, author: string) => {
    const comment: IdeaComment = { id: `c${Date.now()}`, author, date: new Date().toISOString().slice(0, 10), text }
    setIdeas((prev) => prev.map((i) => i.id === id ? { ...i, comments: [...i.comments, comment] } : i))
    setSelected((prev) => prev && prev.id === id ? { ...prev, comments: [...prev.comments, comment] } : prev)
  }

  const handleTransform = (idea: Idea) => {
    const num = `PRJ-2025-${String(projects.length + 1).padStart(3, '0')}`
    const newProject = {
      id: `p${Date.now()}`, number: num, title: idea.title, description: idea.description,
      category: idea.category, location: idea.location,
      budget: idea.estimatedBudget || 0, spent: 0,
      startDate: new Date().toISOString().slice(0, 10), endDate: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
      status: 'Planifié' as const, manager: idea.author, team: [idea.author], progress: 0,
      tasks: [], photos: idea.photos, documents: idea.documents, sourceIdeaId: idea.id, heritage: false,
    }
    setProjects((prev) => [...prev, newProject])
    setIdeas((prev) => prev.map((i) => i.id === idea.id ? {
      ...i, status: 'Transformée en projet', transformedProjectId: newProject.id,
      history: [...i.history, { id: `h${Date.now()}`, date: new Date().toISOString().slice(0, 10), event: `Transformée en projet ${num}`, actor: idea.author }],
    } : i))
    setSelected(null)
    notify('success', 'Idée transformée en projet', `Le projet ${num} a été créé à partir de cette idée.`)
  }

  const handleCreate = (data: { title: string; description: string; objective: string; category: string; location: string; benefits: string; estimatedBudget: number | null; author: string; priority: Priority }) => {
    const newIdea: Idea = {
      ...data, id: `id${Date.now()}`, photos: [], documents: [],
      createdAt: new Date().toISOString().slice(0, 10), status: 'Nouvelle',
      comments: [], reactions: REACTION_TYPES.map((t) => ({ type: t, count: 0 })),
      supports: 0, views: 1, votes: { favorable: 0, unfavorable: 0, abstention: 0 },
      history: [{ id: `h${Date.now()}`, date: new Date().toISOString().slice(0, 10), event: 'Idée proposée', actor: data.author }],
      transformedProjectId: null,
    }
    setIdeas((prev) => [newIdea, ...prev])
    setShowForm(false)
    notify('success', 'Idée proposée', 'Votre idée a été publiée et est visible par tous les membres.')
  }

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Idées de projets</h1>
          <p>Proposez, discutez et votez pour les initiatives de la communauté</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} style={{ marginRight: '0.25rem' }} /> Proposer une idée
        </button>
      </div>

      <div className="sol-filters">
        <div className="sol-search">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-400)' }} />
            <input className="form-input" style={{ paddingLeft: '2.25rem' }} placeholder="Rechercher une idée…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <select className="form-select" value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? <EmptyState message="Aucune idée ne correspond à vos filtres." /> : (
        <div className="grid-2">
          {filtered.map((idea) => {
            const totalVotes = idea.votes.favorable + idea.votes.unfavorable + idea.votes.abstention
            const approvalPct = totalVotes > 0 ? (idea.votes.favorable / totalVotes) * 100 : 0
            return (
              <div key={idea.id} className="prj-idea-card" style={{ cursor: 'pointer' }} onClick={() => setSelected(idea)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <IdeaStatusBadge status={idea.status} />
                  <PriorityBadge priority={idea.priority} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{idea.title}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-neutral-600)', marginBottom: '0.75rem', lineHeight: 1.5 }}>{idea.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <span className="sol-badge" style={{ background: 'var(--color-neutral-100)', color: 'var(--color-neutral-700)' }}>{idea.category}</span>
                  {idea.estimatedBudget && <span className="sol-badge" style={{ background: '#fef3c7', color: '#92400e' }}>{formatMoney(idea.estimatedBudget)}</span>}
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--color-neutral-500)', marginBottom: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Eye size={14} /> {idea.views}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={14} /> {idea.supports}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MessageSquare size={14} /> {idea.comments.length}</span>
                  {totalVotes > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><ThumbsUp size={14} /> {approvalPct.toFixed(0)}%</span>}
                </div>

                {/* Vote bar */}
                {totalVotes > 0 && (
                  <div className="prj-vote-bar" style={{ marginBottom: '0.75rem' }}>
                    <div className="prj-vote-segment" style={{ width: `${(idea.votes.favorable / totalVotes) * 100}%`, background: VOTE_COLORS['Favorable'] }}>{idea.votes.favorable > 0 ? idea.votes.favorable : ''}</div>
                    <div className="prj-vote-segment" style={{ width: `${(idea.votes.unfavorable / totalVotes) * 100}%`, background: VOTE_COLORS['Défavorable'] }}>{idea.votes.unfavorable > 0 ? idea.votes.unfavorable : ''}</div>
                    <div className="prj-vote-segment" style={{ width: `${(idea.votes.abstention / totalVotes) * 100}%`, background: VOTE_COLORS['Abstention'] }}>{idea.votes.abstention > 0 ? idea.votes.abstention : ''}</div>
                  </div>
                )}

                {/* Reactions */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {idea.reactions.map((r) => (
                    <span key={r.type} className="prj-reaction" onClick={(e) => { e.stopPropagation(); handleReact(idea.id, r.type) }}>
                      {r.type} {r.count}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--color-neutral-500)', borderTop: '1px solid var(--color-neutral-100)', paddingTop: '0.5rem' }}>
                  <span>{idea.author} - {new Date(idea.createdAt).toLocaleDateString('fr-FR')}</span>
                  {idea.status === 'Acceptée' && (
                    <button className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={(e) => { e.stopPropagation(); handleTransform(idea) }}>
                      <CheckCircle2 size={14} style={{ marginRight: '0.25rem' }} /> Transformer en projet
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showForm && <IdeaForm onClose={() => setShowForm(false)} onCreate={handleCreate} />}
      {selected && <IdeaDetail idea={selected} onClose={() => setSelected(null)} onVote={handleVote} onComment={handleComment} onSupport={handleSupport} onReact={handleReact} onTransform={handleTransform} />}
    </div>
  )
}

function IdeaForm({ onClose, onCreate }: { onClose: () => void; onCreate: (data: { title: string; description: string; objective: string; category: string; location: string; benefits: string; estimatedBudget: number | null; author: string; priority: Priority }) => void }) {
  const [form, setForm] = useState({ title: '', description: '', objective: '', category: 'Infrastructure', location: '', benefits: '', estimatedBudget: '', author: '', priority: 'Moyenne' as Priority })
  return (
    <Modal title="Proposer une idée" onClose={onClose} maxWidth="650px">
      <form onSubmit={(e) => { e.preventDefault(); onCreate({ ...form, estimatedBudget: form.estimatedBudget ? Number(form.estimatedBudget) : null }) }}>
        <div className="form-group"><label className="form-label">Titre *</label><input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
        <div className="form-group"><label className="form-label">Description *</label><textarea className="form-textarea" style={{ minHeight: '80px' }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
        <div className="form-group"><label className="form-label">Objectif *</label><input className="form-input" value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} required /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Catégorie *</label>
            <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {['Infrastructure', 'Éducation', 'Social', 'Agriculture', 'Technologie', 'Environnement', 'Événementiel', 'Finance'].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Priorité *</label>
            <select className="form-select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group"><label className="form-label">Localisation *</label><input className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></div>
        <div className="form-group"><label className="form-label">Bénéfices attendus *</label><textarea className="form-textarea" style={{ minHeight: '60px' }} value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} required /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Budget estimatif (FCFA)</label><input type="number" className="form-input" value={form.estimatedBudget} onChange={(e) => setForm({ ...form, estimatedBudget: e.target.value })} placeholder="Optionnel" /></div>
          <div className="form-group"><label className="form-label">Auteur *</label><input className="form-input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required /></div>
        </div>
        <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button><button type="submit" className="btn btn-primary">Publier l'idée</button></div>
      </form>
    </Modal>
  )
}

function IdeaDetail({ idea, onClose, onVote, onComment, onSupport, onReact, onTransform }: {
  idea: Idea
  onClose: () => void
  onVote: (id: string, choice: VoteChoice) => void
  onComment: (id: string, text: string, author: string) => void
  onSupport: (id: string) => void
  onReact: (id: string, type: string) => void
  onTransform: (idea: Idea) => void
}) {
  const [commentText, setCommentText] = useState('')
  const [commentAuthor, setCommentAuthor] = useState('')
  const totalVotes = idea.votes.favorable + idea.votes.unfavorable + idea.votes.abstention
  const approvalPct = totalVotes > 0 ? (idea.votes.favorable / totalVotes) * 100 : 0

  return (
    <Modal title={idea.title} onClose={onClose} maxWidth="700px">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <IdeaStatusBadge status={idea.status} />
        <PriorityBadge priority={idea.priority} />
        <span className="sol-badge" style={{ background: 'var(--color-neutral-100)', color: 'var(--color-neutral-700)' }}>{idea.category}</span>
      </div>

      <p style={{ fontSize: '0.9rem', color: 'var(--color-neutral-700)', lineHeight: 1.6, marginBottom: '0.75rem' }}>{idea.description}</p>

      <div className="sol-info-row"><span className="sol-info-label">Objectif</span><span className="sol-info-value">{idea.objective}</span></div>
      <div className="sol-info-row"><span className="sol-info-label">Bénéfices</span><span className="sol-info-value">{idea.benefits}</span></div>
      <div className="sol-info-row"><span className="sol-info-label">Localisation</span><span className="sol-info-value">{idea.location}</span></div>
      {idea.estimatedBudget && <div className="sol-info-row"><span className="sol-info-label">Budget estimatif</span><span className="sol-info-value" style={{ fontWeight: 700 }}>{formatMoney(idea.estimatedBudget)}</span></div>}
      <div className="sol-info-row"><span className="sol-info-label">Auteur</span><span className="sol-info-value">{idea.author}</span></div>
      <div className="sol-info-row"><span className="sol-info-label">Date</span><span className="sol-info-value">{new Date(idea.createdAt).toLocaleDateString('fr-FR')}</span></div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '1.5rem', padding: '0.75rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)', marginTop: '0.75rem', marginBottom: '1rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}><Eye size={16} style={{ color: 'var(--color-neutral-400)' }} /> {idea.views} vues</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}><Users size={16} style={{ color: 'var(--color-neutral-400)' }} /> {idea.supports} soutiens</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}><MessageSquare size={16} style={{ color: 'var(--color-neutral-400)' }} /> {idea.comments.length} commentaires</span>
      </div>

      {/* Reactions */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Réactions</div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {idea.reactions.map((r) => (
            <span key={r.type} className="prj-reaction" onClick={() => onReact(idea.id, r.type)}>{r.type} {r.count}</span>
          ))}
          <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }} onClick={() => onSupport(idea.id)}><Users size={14} style={{ marginRight: '0.25rem' }} /> Soutenir</button>
        </div>
      </div>

      {/* Vote */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Vote ({totalVotes} votes - {approvalPct.toFixed(0)}% d'approbation)</div>
        {totalVotes > 0 && (
          <div className="prj-vote-bar" style={{ marginBottom: '0.5rem' }}>
            <div className="prj-vote-segment" style={{ width: `${(idea.votes.favorable / totalVotes) * 100}%`, background: VOTE_COLORS['Favorable'] }}>{idea.votes.favorable > 0 ? idea.votes.favorable : ''}</div>
            <div className="prj-vote-segment" style={{ width: `${(idea.votes.unfavorable / totalVotes) * 100}%`, background: VOTE_COLORS['Défavorable'] }}>{idea.votes.unfavorable > 0 ? idea.votes.unfavorable : ''}</div>
            <div className="prj-vote-segment" style={{ width: `${(idea.votes.abstention / totalVotes) * 100}%`, background: VOTE_COLORS['Abstention'] }}>{idea.votes.abstention > 0 ? idea.votes.abstention : ''}</div>
          </div>
        )}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" style={{ fontSize: '0.8rem', borderColor: VOTE_COLORS['Favorable'], color: VOTE_COLORS['Favorable'] }} onClick={() => onVote(idea.id, 'Favorable')}><ThumbsUp size={14} style={{ marginRight: '0.25rem' }} /> Favorable ({idea.votes.favorable})</button>
          <button className="btn btn-secondary" style={{ fontSize: '0.8rem', borderColor: VOTE_COLORS['Défavorable'], color: VOTE_COLORS['Défavorable'] }} onClick={() => onVote(idea.id, 'Défavorable')}><ThumbsDown size={14} style={{ marginRight: '0.25rem' }} /> Défavorable ({idea.votes.unfavorable})</button>
          <button className="btn btn-secondary" style={{ fontSize: '0.8rem', borderColor: VOTE_COLORS['Abstention'], color: VOTE_COLORS['Abstention'] }} onClick={() => onVote(idea.id, 'Abstention')}><Minus size={14} style={{ marginRight: '0.25rem' }} /> Abstention ({idea.votes.abstention})</button>
        </div>
      </div>

      {/* Transform button */}
      {idea.status === 'Acceptée' && (
        <div style={{ marginBottom: '1rem' }}>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => onTransform(idea)}>
            <CheckCircle2 size={18} style={{ marginRight: '0.25rem' }} /> Transformer en projet
          </button>
        </div>
      )}

      {/* Documents */}
      {idea.documents.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Pièces jointes</div>
          {idea.documents.map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
              <Paperclip size={16} style={{ color: 'var(--color-neutral-400)' }} /> {d}
            </div>
          ))}
        </div>
      )}

      {/* Comments */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Commentaires ({idea.comments.length})</div>
        {idea.comments.map((c) => (
          <div key={c.id} style={{ padding: '0.75rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.author}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-neutral-400)' }}>{new Date(c.date).toLocaleDateString('fr-FR')}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-neutral-700)' }}>{c.text}</p>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <input className="form-input" style={{ width: '140px' }} placeholder="Votre nom" value={commentAuthor} onChange={(e) => setCommentAuthor(e.target.value)} />
          <input className="form-input" style={{ flex: 1 }} placeholder="Ajouter un commentaire…" value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && commentText && commentAuthor) { onComment(idea.id, commentText, commentAuthor); setCommentText(''); setCommentAuthor('') } }} />
          <button className="btn btn-primary" onClick={() => { if (commentText && commentAuthor) { onComment(idea.id, commentText, commentAuthor); setCommentText(''); setCommentAuthor('') } }}>Envoyer</button>
        </div>
      </div>

      {/* History timeline */}
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Historique</div>
        <div className="sol-timeline">
          {idea.history.map((h) => (
            <div key={h.id} className="sol-timeline-item">
              <div className="sol-timeline-dot" />
              <div className="sol-timeline-date">{new Date(h.date).toLocaleDateString('fr-FR')}</div>
              <div className="sol-timeline-desc">{h.event} <span style={{ color: 'var(--color-neutral-400)' }}>- {h.actor}</span></div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

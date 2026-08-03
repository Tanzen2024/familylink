import { useState } from 'react'
import { Plus, Briefcase, ThumbsUp, UserPlus, MapPin, Search } from 'lucide-react'
import { mockJobOffers } from '../mockData'
import { useToast } from '../ToastContext'
import { Modal, Avatar, EmptyState } from '../ui'
import type { JobOffer } from '../types'

export default function Emploi() {
  const { notify } = useToast()
  const [offers, setOffers] = useState<JobOffer[]>(mockJobOffers)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')

  const filtered = offers.filter((o) => {
    if (search && !o.title.toLowerCase().includes(search.toLowerCase()) && !o.company.toLowerCase().includes(search.toLowerCase())) return false
    if (filter && o.type !== filter) return false
    return true
  })

  const handleRecommend = (id: string) => {
    setOffers((prev) => prev.map((o) => o.id === id ? { ...o, recommendations: o.recommendations + 1 } : o))
    notify('success', 'Recommandation ajoutée', 'Vous avez recommandé cette annonce.')
  }

  const handleContact = (id: string) => {
    setOffers((prev) => prev.map((o) => o.id === id ? { ...o, contacts: o.contacts + 1 } : o))
    notify('success', 'Mise en relation', 'Le contact a été établi.')
  }

  const handleCreate = (data: { type: JobOffer['type']; title: string; company: string; location: string; postedBy: string }) => {
    const newOffer: JobOffer = { ...data, id: `j${Date.now()}`, date: new Date().toISOString().slice(0, 10), recommendations: 0, contacts: 0 }
    setOffers((prev) => [newOffer, ...prev])
    setShowForm(false)
    notify('success', 'Annonce publiée', `${data.type === 'Recherche' ? 'Recherche d\'emploi' : 'Offre d\'emploi'} publiée.`)
  }

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Emploi</h1>
          <p>Recherchez ou publiez des opportunités professionnelles</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} style={{ marginRight: '0.25rem' }} /> Publier une annonce
        </button>
      </div>

      <div className="sol-filters">
        <div className="sol-search">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-400)' }} />
            <input className="form-input" style={{ paddingLeft: '2.25rem' }} placeholder="Rechercher un poste ou une entreprise…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Toutes les annonces</option>
          <option value="Recherche">Recherche d'emploi</option>
          <option value="Recrutement">Recrutement</option>
        </select>
      </div>

      {filtered.length === 0 ? <EmptyState message="Aucune annonce ne correspond à votre recherche." /> : (
        <div className="sol-chart" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="sol-table">
            <thead>
              <tr><th>Type</th><th>Titre</th><th>Entreprise</th><th>Lieu</th><th>Publié par</th><th>Date</th><th>Recommandations</th><th>Contacts</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td>
                    <span className="sol-badge" style={{ background: o.type === 'Recrutement' ? '#d1fae5' : '#dbeafe', color: o.type === 'Recrutement' ? '#065f46' : '#1e40af' }}>
                      {o.type === 'Recrutement' ? 'Je recrute' : 'Je recherche'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{o.title}</td>
                  <td>{o.company}</td>
                  <td>{o.location}</td>
                  <td>{o.postedBy}</td>
                  <td>{new Date(o.date).toLocaleDateString('fr-FR')}</td>
                  <td>{o.recommendations}</td>
                  <td>{o.contacts}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => handleRecommend(o.id)} title="Recommander"><ThumbsUp size={14} /></button>
                      <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => handleContact(o.id)} title="Mettre en relation"><UserPlus size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && <JobForm onClose={() => setShowForm(false)} onCreate={handleCreate} />}
    </div>
  )
}

function JobForm({ onClose, onCreate }: { onClose: () => void; onCreate: (data: { type: JobOffer['type']; title: string; company: string; location: string; postedBy: string }) => void }) {
  const [form, setForm] = useState({ type: 'Recherche' as JobOffer['type'], title: '', company: '', location: '', postedBy: '' })
  return (
    <Modal title="Publier une annonce" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onCreate(form) }}>
        <div className="form-group"><label className="form-label">Type *</label>
          <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as JobOffer['type'] })}>
            <option value="Recherche">Je recherche un emploi</option><option value="Recrutement">Je recrute</option>
          </select>
        </div>
        <div className="form-group"><label className="form-label">Titre du poste *</label><input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
        <div className="form-group"><label className="form-label">Entreprise</label><input className="form-input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="N/A si recherche d'emploi" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Lieu *</label><input className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></div>
          <div className="form-group"><label className="form-label">Publié par *</label><input className="form-input" value={form.postedBy} onChange={(e) => setForm({ ...form, postedBy: e.target.value })} required /></div>
        </div>
        <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button><button type="submit" className="btn btn-primary">Publier</button></div>
      </form>
    </Modal>
  )
}

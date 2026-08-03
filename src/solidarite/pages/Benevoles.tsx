import { useState } from 'react'
import { Plus, MapPin, Phone, CheckCircle2, XCircle, Filter } from 'lucide-react'
import { mockVolunteers } from '../mockData'
import { useToast } from '../ToastContext'
import { Modal, Avatar, EmptyState } from '../ui'
import type { Volunteer } from '../types'

const DOMAINS = ['Santé', 'Juridique', 'Éducation', 'Emploi', 'Logement', 'Transport', 'Administration', 'Psychologie', 'Événementiel']

export default function Benevoles() {
  const { notify } = useToast()
  const [volunteers, setVolunteers] = useState<Volunteer[]>(mockVolunteers)
  const [showForm, setShowForm] = useState(false)
  const [filterDomain, setFilterDomain] = useState('')

  const filtered = filterDomain ? volunteers.filter((v) => v.domains.includes(filterDomain)) : volunteers

  const handleCreate = (data: { name: string; domains: string[]; city: string; phone: string }) => {
    const newVol: Volunteer = { ...data, id: `v${Date.now()}`, available: true }
    setVolunteers((prev) => [newVol, ...prev])
    setShowForm(false)
    notify('success', 'Bénévole ajouté', `${data.name} est maintenant disponible comme bénévole.`)
  }

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Bénévoles</h1>
          <p>Membres prêts à aider dans leur domaine de compétence</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} style={{ marginRight: '0.25rem' }} /> Devenir bénévole
        </button>
      </div>

      <div className="sol-filters">
        <select className="form-select" value={filterDomain} onChange={(e) => setFilterDomain(e.target.value)}>
          <option value="">Tous les domaines</option>
          {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? <EmptyState message="Aucun bénévole dans ce domaine." /> : (
        <div className="grid-3">
          {filtered.map((v) => (
            <div key={v.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Avatar name={v.name} size="lg" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{v.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}><MapPin size={12} /> {v.city}</div>
                </div>
                {v.available ? (
                  <span className="sol-badge" style={{ background: '#d1fae5', color: '#065f46' }}><CheckCircle2 size={12} /> Dispo</span>
                ) : (
                  <span className="sol-badge" style={{ background: '#fee2e2', color: '#991b1b' }}><XCircle size={12} /> Occupé</span>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.75rem' }}>
                {v.domains.map((d) => (
                  <span key={d} className="sol-badge" style={{ background: 'var(--color-neutral-100)', color: 'var(--color-neutral-700)' }}>{d}</span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-neutral-500)' }}>
                <Phone size={14} /> {v.phone}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <VolunteerForm onClose={() => setShowForm(false)} onCreate={handleCreate} />}
    </div>
  )
}

function VolunteerForm({ onClose, onCreate }: { onClose: () => void; onCreate: (data: { name: string; domains: string[]; city: string; phone: string }) => void }) {
  const [form, setForm] = useState({ name: '', city: '', phone: '' })
  const [domains, setDomains] = useState<string[]>([])

  const toggleDomain = (d: string) => setDomains((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d])

  return (
    <Modal title="Devenir bénévole" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onCreate({ ...form, domains }) }}>
        <div className="form-group"><label className="form-label">Nom *</label><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Ville *</label><input className="form-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required /></div>
          <div className="form-group"><label className="form-label">Téléphone *</label><input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
        </div>
        <div className="form-group"><label className="form-label">Domaines d'expertise *</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {DOMAINS.map((d) => (
              <div key={d} onClick={() => toggleDomain(d)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.625rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${domains.includes(d) ? 'var(--color-primary-500)' : 'var(--color-neutral-300)'}`, background: domains.includes(d) ? 'var(--color-primary-50)' : 'white', fontSize: '0.8rem' }}>
                <div className={`sol-check ${domains.includes(d) ? 'checked' : ''}`} style={{ width: 16, height: 16 }} />
                {d}
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button><button type="submit" className="btn btn-primary">S'inscrire</button></div>
      </form>
    </Modal>
  )
}

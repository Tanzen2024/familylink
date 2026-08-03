import { useState } from 'react'
import { Plus, FileText, MapPin, UserCheck, Globe } from 'lucide-react'
import { mockAdminAssists, mockVolunteers } from '../mockData'
import { useToast } from '../ToastContext'
import { Modal, StatusBadge, Avatar, EmptyState } from '../ui'
import type { AdminAssistance } from '../types'

const NEEDS = [
  'Logement', 'Arrivée dans une nouvelle ville', 'Arrivée au Canada', 'Arrivée en France',
  'Inscription universitaire', 'Formalités administratives', 'Recherche d\'école',
]

export default function Administratif() {
  const { notify } = useToast()
  const [assists, setAssists] = useState<AdminAssistance[]>(mockAdminAssists)
  const [showForm, setShowForm] = useState(false)

  const handleMatch = (assistId: string, volunteerName: string) => {
    setAssists((prev) => prev.map((a) => a.id === assistId ? { ...a, status: 'En cours' } : a))
    notify('success', 'Mise en relation', `${volunteerName} accompagne cette demande.`)
  }

  const handleCreate = (data: { requester: string; need: string; city: string; country: string }) => {
    const newAssist: AdminAssistance = { ...data, id: `aa${Date.now()}`, date: new Date().toISOString().slice(0, 10), status: 'Nouvelle' }
    setAssists((prev) => [newAssist, ...prev])
    setShowForm(false)
    notify('success', 'Demande créée', `Demande d'assistance administrative pour ${data.requester}.`)
  }

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Assistance administrative</h1>
          <p>Logement, arrivée à l'étranger, inscriptions et formalités</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} style={{ marginRight: '0.25rem' }} /> Nouvelle demande
        </button>
      </div>

      {assists.length === 0 ? <EmptyState message="Aucune demande d'assistance administrative." /> : (
        <div className="grid-2">
          {assists.map((a) => {
            const localVolunteers = mockVolunteers.filter((v) => v.city === a.city && v.available)
            return (
              <div key={a.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{a.requester}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>{a.need}</div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--color-neutral-500)', marginBottom: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {a.city}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Globe size={14} /> {a.country}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-400)', marginBottom: '0.5rem' }}>Demande du {new Date(a.date).toLocaleDateString('fr-FR')}</div>

                {localVolunteers.length > 0 ? (
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem' }}>Membres vivant à {a.city} :</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {localVolunteers.map((v) => (
                        <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)' }}>
                          <Avatar name={v.name} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{v.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)' }}>{v.domains.join(', ')}</div>
                          </div>
                          <button className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => handleMatch(a.id, v.name)}>Contacter</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-neutral-400)', fontStyle: 'italic' }}>Aucun membre disponible à {a.city} pour le moment.</div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showForm && <AdminForm onClose={() => setShowForm(false)} onCreate={handleCreate} />}
    </div>
  )
}

function AdminForm({ onClose, onCreate }: { onClose: () => void; onCreate: (data: { requester: string; need: string; city: string; country: string }) => void }) {
  const [form, setForm] = useState({ requester: '', need: NEEDS[0], city: '', country: '' })
  return (
    <Modal title="Demande d'assistance administrative" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onCreate(form) }}>
        <div className="form-group"><label className="form-label">Demandeur *</label><input className="form-input" value={form.requester} onChange={(e) => setForm({ ...form, requester: e.target.value })} required /></div>
        <div className="form-group"><label className="form-label">Besoin *</label>
          <select className="form-select" value={form.need} onChange={(e) => setForm({ ...form, need: e.target.value })}>
            {NEEDS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Ville *</label><input className="form-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required /></div>
          <div className="form-group"><label className="form-label">Pays *</label><input className="form-input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required /></div>
        </div>
        <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button><button type="submit" className="btn btn-primary">Créer</button></div>
      </form>
    </Modal>
  )
}

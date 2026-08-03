import { useState } from 'react'
import { Plus, Scale, Phone, MapPin, UserCheck } from 'lucide-react'
import { mockLegalCases, mockLegalPros } from '../mockData'
import { useToast } from '../ToastContext'
import { Modal, StatusBadge, Avatar, EmptyState } from '../ui'
import type { LegalCase } from '../types'

export default function Juridique() {
  const { notify } = useToast()
  const [cases, setCases] = useState<LegalCase[]>(mockLegalCases)
  const [pros] = useState(mockLegalPros)
  const [showForm, setShowForm] = useState(false)

  const handleMatch = (caseId: string, proName: string) => {
    setCases((prev) => prev.map((c) => c.id === caseId ? { ...c, matchedWith: proName, status: 'En cours' } : c))
    notify('success', 'Mise en relation', `${proName} a été assigné à cette demande.`)
  }

  const handleCreate = (data: { requester: string; need: LegalCase['need']; domain: string }) => {
    const newCase: LegalCase = { ...data, id: `lc${Date.now()}`, date: new Date().toISOString().slice(0, 10), status: 'Nouvelle', matchedWith: null }
    setCases((prev) => [newCase, ...prev])
    setShowForm(false)
    notify('success', 'Demande créée', `Demande d'assistance juridique pour ${data.requester}.`)
  }

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Assistance juridique</h1>
          <p>Avocats, juristes et notaires de la communauté</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} style={{ marginRight: '0.25rem' }} /> Nouvelle demande
        </button>
      </div>

      {/* Professionals */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Professionnels disponibles</h3>
        <div className="grid-3">
          {pros.map((p) => (
            <div key={p.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Avatar name={p.name} size="lg" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{p.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>{p.role}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-neutral-600)', marginBottom: '0.5rem' }}>{p.specialty}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-neutral-500)', marginBottom: '0.25rem' }}><MapPin size={14} /> {p.city}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-neutral-500)' }}><Phone size={14} /> {p.phone}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cases */}
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Demandes en cours</h3>
      {cases.length === 0 ? <EmptyState message="Aucune demande juridique." /> : (
        <div className="grid-2">
          {cases.map((c) => {
            const matchingPros = pros.filter((p) => p.role === c.need)
            return (
              <div key={c.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: '#fef3c7', color: '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Scale size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{c.requester}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>{c.need} - {c.domain}</div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)', marginBottom: '0.75rem' }}>Demande du {new Date(c.date).toLocaleDateString('fr-FR')}</div>

                {c.matchedWith ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: '#d1fae5', borderRadius: 'var(--radius-sm)' }}>
                    <UserCheck size={16} style={{ color: '#065f46' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#065f46' }}>Mise en relation: {c.matchedWith}</span>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem' }}>Professionnels correspondants:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {matchingPros.map((p) => (
                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)' }}>
                          <Avatar name={p.name} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{p.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)' }}>{p.specialty}</div>
                          </div>
                          <button className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => handleMatch(c.id, p.name)}>Mettre en relation</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showForm && <LegalForm onClose={() => setShowForm(false)} onCreate={handleCreate} />}
    </div>
  )
}

function LegalForm({ onClose, onCreate }: { onClose: () => void; onCreate: (data: { requester: string; need: LegalCase['need']; domain: string }) => void }) {
  const [form, setForm] = useState({ requester: '', need: 'Avocat' as LegalCase['need'], domain: '' })
  return (
    <Modal title="Demande d'assistance juridique" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onCreate(form) }}>
        <div className="form-group"><label className="form-label">Demandeur *</label><input className="form-input" value={form.requester} onChange={(e) => setForm({ ...form, requester: e.target.value })} required /></div>
        <div className="form-group"><label className="form-label">Besoin *</label>
          <select className="form-select" value={form.need} onChange={(e) => setForm({ ...form, need: e.target.value as LegalCase['need'] })}>
            <option value="Avocat">Avocat</option><option value="Juriste">Juriste</option><option value="Notaire">Notaire</option>
          </select>
        </div>
        <div className="form-group"><label className="form-label">Domaine *</label><input className="form-input" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="Ex: Droit foncier, succession…" required /></div>
        <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button><button type="submit" className="btn btn-primary">Créer</button></div>
      </form>
    </Modal>
  )
}

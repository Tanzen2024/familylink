import { useState } from 'react'
import { Plus, Activity, Users, History } from 'lucide-react'
import { mockIllnesses } from '../mockData'
import { useToast } from '../ToastContext'
import { Modal, Avatar, StatusBadge, EmptyState } from '../ui'
import type { IllnessRecord } from '../types'

export default function Maladies() {
  const { notify } = useToast()
  const [illnesses, setIllnesses] = useState<IllnessRecord[]>(mockIllnesses)
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<IllnessRecord | null>(null)

  const handleToggle = (id: string, supportType: string) => {
    setIllnesses((prev) => prev.map((ill) => {
      if (ill.id !== id) return ill
      return {
        ...ill,
        supports: ill.supports.map((s) => s.type === supportType ? { ...s, enabled: !s.enabled } : s),
      }
    }))
    notify('success', 'Soutien mis à jour', `Le type de soutien a été modifié.`)
  }

  const handleCreate = (data: { patientName: string; supports: { type: string; label: string; enabled: boolean }[] }) => {
    const newIllness: IllnessRecord = {
      ...data, id: `i${Date.now()}`, requestDate: new Date().toISOString().slice(0, 10),
      status: 'Nouvelle', mobilized: [], history: [{ date: new Date().toISOString().slice(0, 10), event: 'Demande créée' }],
    }
    setIllnesses((prev) => [newIllness, ...prev])
    setShowForm(false)
    notify('success', 'Demande créée', `Demande de soutien maladie pour ${data.patientName}.`)
  }

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Maladies</h1>
          <p>Soutien aux membres malades et leurs familles</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} style={{ marginRight: '0.25rem' }} /> Nouvelle demande
        </button>
      </div>

      {illnesses.length === 0 ? (
        <EmptyState message="Aucune demande de soutien maladie." />
      ) : (
        <div className="grid-2">
          {illnesses.map((ill) => (
            <div key={ill.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(ill)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: '#fee2e2', color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{ill.patientName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>Demande du {new Date(ill.requestDate).toLocaleDateString('fr-FR')}</div>
                </div>
                <div style={{ marginLeft: 'auto' }}><StatusBadge status={ill.status} /></div>
              </div>

              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Soutiens demandés</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                {ill.supports.map((s) => (
                  <div key={s.type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className={`sol-check ${s.enabled ? 'checked' : ''}`} />
                    <span style={{ fontSize: '0.85rem', color: s.enabled ? 'var(--color-neutral-800)' : 'var(--color-neutral-400)' }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {ill.mobilized.length > 0 && (
                <div style={{ borderTop: '1px solid var(--color-neutral-100)', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <Users size={14} /> Personnes mobilisées ({ill.mobilized.length})
                  </div>
                  {ill.mobilized.map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <Avatar name={m.name} />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{m.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)' }}>{m.role} - {new Date(m.date).toLocaleDateString('fr-FR')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && <IllnessForm onClose={() => setShowForm(false)} onCreate={handleCreate} />}
      {selected && <IllnessDetail illness={selected} onClose={() => setSelected(null)} onToggle={handleToggle} />}
    </div>
  )
}

function IllnessForm({ onClose, onCreate }: { onClose: () => void; onCreate: (data: { patientName: string; supports: { type: string; label: string; enabled: boolean }[] }) => void }) {
  const [name, setName] = useState('')
  const [supports, setSupports] = useState([
    { type: 'financial', label: 'Soutien financier', enabled: false },
    { type: 'visits', label: 'Visites', enabled: false },
    { type: 'blood', label: 'Dons de sang', enabled: false },
    { type: 'accompaniment', label: 'Accompagnement', enabled: false },
    { type: 'psychological', label: 'Aide psychologique', enabled: false },
  ])

  const toggle = (type: string) => setSupports((prev) => prev.map((s) => s.type === type ? { ...s, enabled: !s.enabled } : s))

  return (
    <Modal title="Demande de soutien maladie" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onCreate({ patientName: name, supports }) }}>
        <div className="form-group">
          <label className="form-label">Nom du patient *</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Types de soutien souhaités</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {supports.map((s) => (
              <div key={s.type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => toggle(s.type)}>
                <div className={`sol-check ${s.enabled ? 'checked' : ''}`} />
                <span style={{ fontSize: '0.875rem' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn btn-primary">Créer</button>
        </div>
      </form>
    </Modal>
  )
}

function IllnessDetail({ illness, onClose, onToggle }: { illness: IllnessRecord; onClose: () => void; onToggle: (id: string, type: string) => void }) {
  return (
    <Modal title={illness.patientName} onClose={onClose} maxWidth="600px">
      <div className="sol-info-row"><span className="sol-info-label">Statut</span><StatusBadge status={illness.status} /></div>
      <div className="sol-info-row"><span className="sol-info-label">Date demande</span><span className="sol-info-value">{new Date(illness.requestDate).toLocaleDateString('fr-FR')}</span></div>

      <div style={{ marginTop: '1rem', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Soutiens</div>
      {illness.supports.map((s) => (
        <div key={s.type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }} onClick={() => onToggle(illness.id, s.type)}>
          <div className={`sol-check ${s.enabled ? 'checked' : ''}`} />
          <span style={{ fontSize: '0.875rem' }}>{s.label}</span>
        </div>
      ))}

      {illness.mobilized.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Personnes mobilisées</div>
          {illness.mobilized.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Avatar name={m.name} />
              <div><span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{m.name}</span> <span style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>- {m.role}</span></div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '1rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><History size={14} /> Historique</div>
        <div className="sol-timeline">
          {illness.history.map((h, i) => (
            <div key={i} className="sol-timeline-item">
              <div className="sol-timeline-dot" />
              <div className="sol-timeline-date">{new Date(h.date).toLocaleDateString('fr-FR')}</div>
              <div className="sol-timeline-desc">{h.event}</div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

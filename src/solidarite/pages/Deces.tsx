import { useState } from 'react'
import { Plus, Bell, PiggyBank, Share2, Heart, Clock, MapPin, FileText, DollarSign } from 'lucide-react'
import { mockDeaths } from '../mockData'
import { useToast } from '../ToastContext'
import { Modal, Avatar, formatMoney, ProgressBar, EmptyState } from '../ui'
import type { DeathRecord } from '../types'

export default function Deces() {
  const { notify } = useToast()
  const [deaths, setDeaths] = useState<DeathRecord[]>(mockDeaths)
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<DeathRecord | null>(null)

  const handleNotify = (d: DeathRecord) => {
    notify('info', 'Membres informés', `Notification envoyée à tous les membres concernant ${d.deceasedName}.`)
  }

  const handleCreateCollection = (d: DeathRecord) => {
    notify('success', 'Collecte créée', `Une collecte a été automatiquement créée pour ${d.deceasedName}.`)
  }

  const handlePublish = (d: DeathRecord) => {
    notify('success', 'Programme publié', `Le programme des obsèques de ${d.deceasedName} a été publié.`)
  }

  const handleCreate = (data: Omit<DeathRecord, 'id' | 'condolences' | 'financialAid' | 'notified' | 'photoUrl' | 'documents' | 'program'>) => {
    const newDeath: DeathRecord = {
      ...data, id: `d${Date.now()}`, photoUrl: null, documents: [],
      program: [], condolences: [], financialAid: [], notified: false,
    }
    setDeaths((prev) => [newDeath, ...prev])
    setShowForm(false)
    notify('success', 'Décès enregistré', `Le décès de ${data.deceasedName} a été enregistré.`)
  }

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Décès</h1>
          <p>Déclarez et suivez les décès dans la communauté</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} style={{ marginRight: '0.25rem' }} /> Déclarer un décès
        </button>
      </div>

      {deaths.length === 0 ? (
        <EmptyState message="Aucun décès enregistré." />
      ) : (
        <div className="grid-2">
          {deaths.map((d) => {
            const totalAid = d.financialAid.reduce((s, a) => s + a.amount, 0)
            return (
              <div key={d.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(d)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <Avatar name={d.deceasedName} size="lg" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{d.deceasedName}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-neutral-500)' }}>{d.relation}</div>
                  </div>
                </div>
                <div className="sol-info-row"><span className="sol-info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> Date</span><span className="sol-info-value">{new Date(d.date).toLocaleDateString('fr-FR')}</span></div>
                <div className="sol-info-row"><span className="sol-info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> Lieu</span><span className="sol-info-value">{d.location}</span></div>

                {d.program.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Programme des obsèques</div>
                    <div className="sol-timeline">
                      {d.program.map((p, i) => (
                        <div key={i} className="sol-timeline-item">
                          <div className="sol-timeline-dot" />
                          <div className="sol-timeline-date">{p.time}</div>
                          <div className="sol-timeline-title">{p.label}</div>
                          <div className="sol-timeline-desc">{p.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {d.financialAid.length > 0 && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Aides financières</span>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary-600)' }}>{formatMoney(totalAid)}</span>
                    </div>
                    <ProgressBar value={totalAid} max={500000} />
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)', marginTop: '0.25rem' }}>{d.financialAid.length} contributeur(s)</div>
                  </div>
                )}

                {d.condolences?.length > 0 && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem' }}>Condoléances ({d.condolences.length})</div>
                    {d.condolences.slice(0, 2).map((c, i) => (
                      <div key={i} style={{ fontSize: '0.8rem', color: 'var(--color-neutral-600)', marginBottom: '0.25rem', fontStyle: 'italic' }}>
                        "{c.message}" - {c.author}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                  <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }} onClick={() => handleNotify(d)}><Bell size={14} style={{ marginRight: '0.25rem' }} /> Informer</button>
                  <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }} onClick={() => handleCreateCollection(d)}><PiggyBank size={14} style={{ marginRight: '0.25rem' }} /> Collecte</button>
                  <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }} onClick={() => handlePublish(d)}><Share2 size={14} style={{ marginRight: '0.25rem' }} /> Publier</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showForm && <DeathForm onClose={() => setShowForm(false)} onCreate={handleCreate} />}
      {selected && <DeathDetail death={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function DeathForm({ onClose, onCreate }: { onClose: () => void; onCreate: (data: Omit<DeathRecord, 'id' | 'condolences' | 'financialAid' | 'notified' | 'photoUrl' | 'documents' | 'program'>) => void }) {
  const [form, setForm] = useState({ deceasedName: '', relation: '', date: '', location: '' })
  return (
    <Modal title="Déclarer un décès" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onCreate(form) }}>
        <div className="form-group">
          <label className="form-label">Nom du défunt *</label>
          <input className="form-input" value={form.deceasedName} onChange={(e) => setForm({ ...form, deceasedName: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="form-label">Lien avec le membre *</label>
          <input className="form-input" value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Date du décès *</label>
            <input type="date" className="form-input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Lieu *</label>
            <input className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn btn-primary">Enregistrer</button>
        </div>
      </form>
    </Modal>
  )
}

function DeathDetail({ death, onClose }: { death: DeathRecord; onClose: () => void }) {
  const totalAid = death.financialAid.reduce((s, a) => s + a.amount, 0)
  return (
    <Modal title={death.deceasedName} onClose={onClose} maxWidth="650px">
      <div className="sol-info-row"><span className="sol-info-label">Lien</span><span className="sol-info-value">{death.relation}</span></div>
      <div className="sol-info-row"><span className="sol-info-label">Date</span><span className="sol-info-value">{new Date(death.date).toLocaleDateString('fr-FR')}</span></div>
      <div className="sol-info-row"><span className="sol-info-label">Lieu</span><span className="sol-info-value">{death.location}</span></div>

      {death.program.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Programme des obsèques</div>
          <div className="sol-timeline">
            {death.program.map((p, i) => (
              <div key={i} className="sol-timeline-item">
                <div className="sol-timeline-dot" />
                <div className="sol-timeline-date">{p.time}</div>
                <div className="sol-timeline-title">{p.label}</div>
                <div className="sol-timeline-desc">{p.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {death.financialAid.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Aides financières - {formatMoney(totalAid)}</div>
          {death.financialAid.map((a, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem' }}>{a.contributor}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{formatMoney(a.amount)}</span>
            </div>
          ))}
        </div>
      )}

      {death.condolences.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Condoléances</div>
          {death.condolences.map((c, i) => (
            <div key={i} style={{ padding: '0.75rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.author}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-neutral-400)' }}>{new Date(c.date).toLocaleDateString('fr-FR')}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-neutral-700)', fontStyle: 'italic' }}>{c.message}</p>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}

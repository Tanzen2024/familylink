import { useState } from 'react'
import { Plus, Share2, Users, DollarSign, ThumbsUp, Camera } from 'lucide-react'
import { mockMarriages } from '../mockData'
import { useToast } from '../ToastContext'
import { Modal, Avatar, formatMoney, ProgressBar, EmptyState } from '../ui'
import type { MarriageRecord } from '../types'

export default function Mariages() {
  const { notify } = useToast()
  const [marriages, setMarriages] = useState<MarriageRecord[]>(mockMarriages)
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<MarriageRecord | null>(null)

  const handlePublish = (m: MarriageRecord) => {
    notify('success', 'Événement publié', `Le mariage de ${m.spouse1} et ${m.spouse2} a été publié à la communauté.`)
  }

  const handleVote = (m: MarriageRecord) => {
    if (m.aidVoted) { notify('info', 'Aide déjà votée', `Une aide de ${formatMoney(m.aidAmount)} a déjà été votée.`); return }
    setMarriages((prev) => prev.map((x) => x.id === m.id ? { ...x, aidVoted: true, aidAmount: 100000 } : x))
    notify('success', 'Aide votée', `Une aide de 100 000 FCFA a été votée pour ce mariage.`)
  }

  const handleCreate = (data: { spouse1: string; spouse2: string; date: string; location: string }) => {
    const newM: MarriageRecord = {
      ...data, id: `m${Date.now()}`, published: false, delegation: [], contributions: [],
      aidVoted: false, aidAmount: 0, photos: [],
    }
    setMarriages((prev) => [newM, ...prev])
    setShowForm(false)
    notify('success', 'Mariage enregistré', `Le mariage de ${data.spouse1} et ${data.spouse2} a été enregistré.`)
  }

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Mariages</h1>
          <p>Déclarez et organisez les mariages de la communauté</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} style={{ marginRight: '0.25rem' }} /> Déclarer un mariage
        </button>
      </div>

      {marriages.length === 0 ? (
        <EmptyState message="Aucun mariage enregistré." />
      ) : (
        <div className="grid-2">
          {marriages.map((m) => {
            const totalContrib = m.contributions.reduce((s, c) => s + c.amount, 0)
            return (
              <div key={m.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(m)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: '#fce7f3', color: '#9d174d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{m.spouse1} & {m.spouse2}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>{new Date(m.date).toLocaleDateString('fr-FR')} - {m.location}</div>
                  </div>
                  {m.published && <span className="sol-badge" style={{ background: '#d1fae5', color: '#065f46' }}>Publié</span>}
                </div>

                {m.delegation.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={14} /> Délégation</div>
                    {m.delegation.map((d, i) => (
                      <div key={i} style={{ fontSize: '0.85rem', color: 'var(--color-neutral-600)', marginBottom: '0.125rem' }}>• {d}</div>
                    ))}
                  </div>
                )}

                <div style={{ padding: '0.75rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Contributions</span>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary-600)' }}>{formatMoney(totalContrib)}</span>
                  </div>
                  <ProgressBar value={totalContrib} max={200000} color="#ec4899" />
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)', marginTop: '0.25rem' }}>{m.contributions.length} contributeur(s)</div>
                </div>

                {m.aidVoted && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: '#d1fae5', borderRadius: 'var(--radius-sm)' }}>
                    <ThumbsUp size={16} style={{ color: '#065f46' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#065f46' }}>Aide votée: {formatMoney(m.aidAmount)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }} onClick={(e) => e.stopPropagation()}>
                  <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }} onClick={() => handlePublish(m)}><Share2 size={14} style={{ marginRight: '0.25rem' }} /> Publier</button>
                  <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }} onClick={() => handleVote(m)}><DollarSign size={14} style={{ marginRight: '0.25rem' }} /> Voter aide</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showForm && <MarriageForm onClose={() => setShowForm(false)} onCreate={handleCreate} />}
      {selected && <MarriageDetail marriage={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function MarriageForm({ onClose, onCreate }: { onClose: () => void; onCreate: (data: { spouse1: string; spouse2: string; date: string; location: string }) => void }) {
  const [form, setForm] = useState({ spouse1: '', spouse2: '', date: '', location: '' })
  return (
    <Modal title="Déclarer un mariage" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onCreate(form) }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Conjoint 1 *</label><input className="form-input" value={form.spouse1} onChange={(e) => setForm({ ...form, spouse1: e.target.value })} required /></div>
          <div className="form-group"><label className="form-label">Conjoint 2 *</label><input className="form-input" value={form.spouse2} onChange={(e) => setForm({ ...form, spouse2: e.target.value })} required /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Date *</label><input type="date" className="form-input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
          <div className="form-group"><label className="form-label">Lieu *</label><input className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn btn-primary">Enregistrer</button>
        </div>
      </form>
    </Modal>
  )
}

function MarriageDetail({ marriage, onClose }: { marriage: MarriageRecord; onClose: () => void }) {
  const totalContrib = marriage.contributions.reduce((s, c) => s + c.amount, 0)
  return (
    <Modal title={`${marriage.spouse1} & ${marriage.spouse2}`} onClose={onClose} maxWidth="600px">
      <div className="sol-info-row"><span className="sol-info-label">Date</span><span className="sol-info-value">{new Date(marriage.date).toLocaleDateString('fr-FR')}</span></div>
      <div className="sol-info-row"><span className="sol-info-label">Lieu</span><span className="sol-info-value">{marriage.location}</span></div>
      <div className="sol-info-row"><span className="sol-info-label">Publié</span><span className="sol-info-value">{marriage.published ? 'Oui' : 'Non'}</span></div>

      {marriage.delegation.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Délégation</div>
          {marriage.delegation.map((d, i) => <div key={i} style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>• {d}</div>)}
        </div>
      )}

      <div style={{ marginTop: '1rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Contributions - {formatMoney(totalContrib)}</div>
        {marriage.contributions.map((c, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem' }}>{c.member}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{formatMoney(c.amount)}</span>
          </div>
        ))}
      </div>

      {marriage.aidVoted && (
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: '#d1fae5', borderRadius: 'var(--radius-sm)' }}>
          <ThumbsUp size={18} style={{ color: '#065f46' }} />
          <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#065f46' }}>Aide votée: {formatMoney(marriage.aidAmount)}</span>
        </div>
      )}
    </Modal>
  )
}

import { useState } from 'react'
import { Plus, PiggyBank, Users, Lock, Unlock } from 'lucide-react'
import { mockFinCollections } from '../mockData'
import { useToast } from '../toast'
import { Modal, ProgressBar, formatCurrencyFCFA, EmptyState } from '../ui'
import type { FinanceCollection } from '../types'

export default function Collectes() {
  const { notify } = useToast()
  const [collections, setCollections] = useState<FinanceCollection[]>(mockFinCollections)
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<FinanceCollection | null>(null)

  const handleClose = (id: string) => {
    setCollections((prev) => prev.map((c) => c.id === id ? { ...c, closed: true } : c))
    notify('success', 'Collecte clôturée', 'La collecte a été clôturée avec succès.')
  }

  const handleCreate = (data: { name: string; objective: string; targetAmount: number; endDate: string; manager: string; description: string }) => {
    const newColl: FinanceCollection = {
      ...data, id: `fc${Date.now()}`, collectedAmount: 0, startDate: new Date().toISOString().slice(0, 10),
      contributors: [], closed: false,
    }
    setCollections((prev) => [newColl, ...prev])
    setShowForm(false)
    notify('success', 'Collecte créée', `La collecte "${data.name}" a été créée.`)
  }

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Collectes</h1>
          <p>Gérez les collectes de fonds</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} style={{ marginRight: '0.25rem' }} /> Créer une collecte
        </button>
      </div>

      {collections.length === 0 ? <EmptyState message="Aucune collecte en cours." /> : (
        <div className="grid-2">
          {collections.map((c) => {
            const pct = c.targetAmount > 0 ? Math.min(100, (c.collectedAmount / c.targetAmount) * 100) : 0
            return (
              <div key={c.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(c)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: '#fef3c7', color: '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PiggyBank size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{c.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>{c.objective}</div>
                  </div>
                  {c.closed ? (
                    <span className="sol-badge" style={{ background: '#f3f4f6', color: '#374151' }}><Lock size={12} /> Clôturée</span>
                  ) : (
                    <span className="sol-badge" style={{ background: '#d1fae5', color: '#065f46' }}><Unlock size={12} /> Active</span>
                  )}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-neutral-600)', marginBottom: '0.75rem', lineHeight: 1.5 }}>{c.description}</p>
                <div style={{ marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary-600)' }}>{formatCurrencyFCFA(c.collectedAmount)}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-neutral-500)' }}>/ {formatCurrencyFCFA(c.targetAmount)}</span>
                  </div>
                  <ProgressBar value={c.collectedAmount} max={c.targetAmount} color={pct >= 100 ? '#16a34a' : undefined} />
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)', marginTop: '0.25rem' }}>{pct.toFixed(0)}% - Resp: {c.manager}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-neutral-500)', marginTop: '0.5rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={14} /> {c.contributors.length} contributeur(s)</span>
                  <span>Échéance: {new Date(c.endDate).toLocaleDateString('fr-FR')}</span>
                </div>
                {!c.closed && c.collectedAmount >= c.targetAmount && (
                  <button className="btn btn-secondary" style={{ width: '100%', marginTop: '0.75rem', fontSize: '0.8rem' }} onClick={(e) => { e.stopPropagation(); handleClose(c.id) }}>Clôturer la collecte</button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showForm && <CollectionForm onClose={() => setShowForm(false)} onCreate={handleCreate} />}
      {selected && <CollectionDetail collection={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function CollectionForm({ onClose, onCreate }: { onClose: () => void; onCreate: (data: { name: string; objective: string; targetAmount: number; endDate: string; manager: string; description: string }) => void }) {
  const [form, setForm] = useState({ name: '', objective: '', targetAmount: 0, endDate: '', manager: '', description: '' })
  return (
    <Modal title="Créer une collecte" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onCreate({ ...form, targetAmount: Number(form.targetAmount) }) }}>
        <div className="form-group"><label className="form-label">Nom *</label><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
        <div className="form-group"><label className="form-label">Objectif *</label><input className="form-input" value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} required /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Montant cible (FCFA) *</label><input type="number" className="form-input" value={form.targetAmount || ''} onChange={(e) => setForm({ ...form, targetAmount: Number(e.target.value) })} required min="1" /></div>
          <div className="form-group"><label className="form-label">Date de fin *</label><input type="date" className="form-input" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required /></div>
        </div>
        <div className="form-group"><label className="form-label">Responsable *</label><input className="form-input" value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} required /></div>
        <div className="form-group"><label className="form-label">Description *</label><textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
        <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button><button type="submit" className="btn btn-primary">Créer</button></div>
      </form>
    </Modal>
  )
}

function CollectionDetail({ collection, onClose }: { collection: FinanceCollection; onClose: () => void }) {
  const pct = collection.targetAmount > 0 ? Math.min(100, (collection.collectedAmount / collection.targetAmount) * 100) : 0
  return (
    <Modal title={collection.name} onClose={onClose} maxWidth="600px">
      <p style={{ fontSize: '0.9rem', color: 'var(--color-neutral-700)', marginBottom: '1rem', lineHeight: 1.5 }}>{collection.description}</p>
      <div className="sol-info-row"><span className="sol-info-label">Objectif</span><span className="sol-info-value">{collection.objective}</span></div>
      <div className="sol-info-row"><span className="sol-info-label">Responsable</span><span className="sol-info-value">{collection.manager}</span></div>
      <div className="sol-info-row"><span className="sol-info-label">Période</span><span className="sol-info-value">{new Date(collection.startDate).toLocaleDateString('fr-FR')} - {new Date(collection.endDate).toLocaleDateString('fr-FR')}</span></div>
      <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <span style={{ fontWeight: 700, color: 'var(--color-primary-600)' }}>{formatCurrencyFCFA(collection.collectedAmount)}</span>
          <span style={{ color: 'var(--color-neutral-500)' }}>/ {formatCurrencyFCFA(collection.targetAmount)}</span>
        </div>
        <ProgressBar value={collection.collectedAmount} max={collection.targetAmount} color={pct >= 100 ? '#16a34a' : undefined} />
        <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)', marginTop: '0.25rem' }}>{pct.toFixed(0)}% de l'objectif</div>
      </div>
      {collection.contributors.length > 0 && (
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Contributeurs ({collection.contributors.length})</div>
          {collection.contributors.map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem' }}>{c.name}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{formatCurrencyFCFA(c.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}

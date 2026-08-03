import { useState } from 'react'
import { Plus, PiggyBank, Users, Calendar } from 'lucide-react'
import { mockCollections } from '../mockData'
import { useToast } from '../ToastContext'
import { Modal, ProgressBar, formatMoney, CategoryBadge, EmptyState } from '../ui'
import type { Collection } from '../types'

export default function Collectes() {
  const { notify } = useToast()
  const [collections, setCollections] = useState<Collection[]>(mockCollections)
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<Collection | null>(null)

  const handleContribute = (id: string, name: string, amount: number) => {
    setCollections((prev) => prev.map((c) => c.id === id ? {
      ...c, collectedAmount: c.collectedAmount + amount,
      contributors: [...c.contributors, { name, amount, date: new Date().toISOString().slice(0, 10) }],
    } : c))
    notify('success', 'Contribution enregistrée', `${formatMoney(amount)} de ${name} pour cette collecte.`)
  }

  const handleCreate = (data: { title: string; description: string; targetAmount: number; deadline: string; category: Collection['category'] }) => {
    const newColl: Collection = { ...data, id: `c${Date.now()}`, collectedAmount: 0, contributors: [] }
    setCollections((prev) => [newColl, ...prev])
    setShowForm(false)
    notify('success', 'Collecte créée', `La collecte "${data.title}" a été créée.`)
  }

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Collectes</h1>
          <p>Soutenez les collectes en cours de la communauté</p>
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
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{c.title}</div>
                    <CategoryBadge category={c.category} />
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-neutral-600)', marginBottom: '0.75rem', lineHeight: 1.5 }}>{c.description}</p>

                <div style={{ marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary-600)' }}>{formatMoney(c.collectedAmount)}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-neutral-500)' }}>/ {formatMoney(c.targetAmount)}</span>
                  </div>
                  <ProgressBar value={c.collectedAmount} max={c.targetAmount} color={pct >= 100 ? '#16a34a' : undefined} />
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)', marginTop: '0.25rem' }}>{pct.toFixed(0)}% de l'objectif</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-neutral-500)', marginTop: '0.5rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={14} /> {c.contributors.length} contributeur(s)</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> Échéance: {new Date(c.deadline).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showForm && <CollectionForm onClose={() => setShowForm(false)} onCreate={handleCreate} />}
      {selected && <CollectionDetail collection={selected} onClose={() => setSelected(null)} onContribute={handleContribute} />}
    </div>
  )
}

function CollectionForm({ onClose, onCreate }: { onClose: () => void; onCreate: (data: { title: string; description: string; targetAmount: number; deadline: string; category: Collection['category'] }) => void }) {
  const [form, setForm] = useState({ title: '', description: '', targetAmount: 0, deadline: '', category: 'Autre' as Collection['category'] })
  return (
    <Modal title="Créer une collecte" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onCreate({ ...form, targetAmount: Number(form.targetAmount) }) }}>
        <div className="form-group"><label className="form-label">Titre *</label><input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
        <div className="form-group"><label className="form-label">Description *</label><textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Objectif (FCFA) *</label><input type="number" className="form-input" value={form.targetAmount || ''} onChange={(e) => setForm({ ...form, targetAmount: Number(e.target.value) })} required min="1" /></div>
          <div className="form-group"><label className="form-label">Échéance *</label><input type="date" className="form-input" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required /></div>
        </div>
        <div className="form-group"><label className="form-label">Catégorie *</label>
          <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Collection['category'] })}>
            {['Décès', 'Maladie', 'Mariage', 'Études', 'Emploi', 'Juridique', 'Administratif', 'Autre'].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button><button type="submit" className="btn btn-primary">Créer</button></div>
      </form>
    </Modal>
  )
}

function CollectionDetail({ collection, onClose, onContribute }: { collection: Collection; onClose: () => void; onContribute: (id: string, name: string, amount: number) => void }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState(0)
  const pct = collection.targetAmount > 0 ? Math.min(100, (collection.collectedAmount / collection.targetAmount) * 100) : 0

  return (
    <Modal title={collection.title} onClose={onClose} maxWidth="600px">
      <p style={{ fontSize: '0.9rem', color: 'var(--color-neutral-700)', marginBottom: '1rem', lineHeight: 1.5 }}>{collection.description}</p>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <span style={{ fontWeight: 700, color: 'var(--color-primary-600)' }}>{formatMoney(collection.collectedAmount)}</span>
          <span style={{ color: 'var(--color-neutral-500)' }}>/ {formatMoney(collection.targetAmount)}</span>
        </div>
        <ProgressBar value={collection.collectedAmount} max={collection.targetAmount} color={pct >= 100 ? '#16a34a' : undefined} />
        <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)', marginTop: '0.25rem' }}>{pct.toFixed(0)}% - Échéance: {new Date(collection.deadline).toLocaleDateString('fr-FR')}</div>
      </div>

      {/* Contribute form */}
      <div style={{ padding: '0.75rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Contribuer</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input className="form-input" style={{ flex: '1', minWidth: '120px' }} placeholder="Votre nom" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="number" className="form-input" style={{ width: '120px' }} placeholder="Montant FCFA" value={amount || ''} onChange={(e) => setAmount(Number(e.target.value))} />
          <button className="btn btn-primary" onClick={() => { if (name && amount > 0) { onContribute(collection.id, name, amount); setName(''); setAmount(0) } }}>Donner</button>
        </div>
      </div>

      {/* Contributors */}
      {collection.contributors.length > 0 && (
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Contributeurs ({collection.contributors.length})</div>
          {collection.contributors.map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem' }}>{c.name}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{formatMoney(c.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}

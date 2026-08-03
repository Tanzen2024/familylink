import { useState } from 'react'
import { Plus, Tags, Trash2, FolderKanban } from 'lucide-react'
import { mockCategories, mockProjects } from '../mockData'
import { useToast } from '../toast'
import { Modal, EmptyState } from '../ui'
import type { ProjectCategory } from '../types'

export default function Categories() {
  const { notify } = useToast()
  const [categories, setCategories] = useState<ProjectCategory[]>(mockCategories)
  const [showForm, setShowForm] = useState(false)

  const handleCreate = (data: { name: string; color: string; description: string }) => {
    const newCat: ProjectCategory = { ...data, id: `cat${Date.now()}`, projectCount: 0 }
    setCategories((prev) => [...prev, newCat])
    setShowForm(false)
    notify('success', 'Catégorie créée', `La catégorie "${data.name}" a été ajoutée.`)
  }

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    notify('info', 'Catégorie supprimée', 'La catégorie a été supprimée.')
  }

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Catégories</h1>
          <p>Organisez vos projets par catégorie</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} style={{ marginRight: '0.25rem' }} /> Nouvelle catégorie
        </button>
      </div>

      {categories.length === 0 ? <EmptyState message="Aucune catégorie définie." /> : (
        <div className="grid-3">
          {categories.map((cat) => (
            <div key={cat.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: cat.color, opacity: 0.15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Tags size={22} style={{ color: cat.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{cat.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>{cat.projectCount} projet(s)</div>
                </div>
                <button onClick={() => handleDelete(cat.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-neutral-400)' }}><Trash2 size={16} /></button>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-neutral-600)', lineHeight: 1.5 }}>{cat.description}</p>
              {cat.projectCount > 0 && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <FolderKanban size={14} />
                  {mockProjects.filter((p) => p.category === cat.name).map((p) => p.title).join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && <CategoryForm onClose={() => setShowForm(false)} onCreate={handleCreate} />}
    </div>
  )
}

function CategoryForm({ onClose, onCreate }: { onClose: () => void; onCreate: (data: { name: string; color: string; description: string }) => void }) {
  const [form, setForm] = useState({ name: '', color: '#3b82f6', description: '' })
  return (
    <Modal title="Nouvelle catégorie" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onCreate(form) }}>
        <div className="form-group"><label className="form-label">Nom *</label><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
        <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" style={{ minHeight: '60px' }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="form-group"><label className="form-label">Couleur</label><input type="color" className="form-input" style={{ height: '40px', padding: '4px' }} value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></div>
        <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button><button type="submit" className="btn btn-primary">Créer</button></div>
      </form>
    </Modal>
  )
}

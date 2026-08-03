import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { GalleryItem } from '../lib/types'

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<GalleryItem | null>(null)

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
      setItems(data ?? [])
      setLoading(false)
    })()
  }, [])

  if (loading) return <div className="loading-state">Chargement…</div>

  return (
    <div className="container">
      <h1 className="page-title">Galerie</h1>
      <p className="page-subtitle">Les moments forts de l'association en images</p>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>Aucune photo dans la galerie pour le moment.</p>
        </div>
      ) : (
        <div className="grid-3">
          {items.map((item) => (
            <div key={item.id} className="card member-card" onClick={() => setSelected(item)}>
              <img src={item.photo_url} alt={item.title} className="member-card-photo" />
              <div className="member-card-body">
                <div className="member-card-name">{item.title}</div>
                {item.category && (
                  <div className="member-card-info">{item.category}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selected.title}</h3>
              <button className="modal-close" onClick={() => setSelected(null)}>&times;</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <img
                src={selected.photo_url}
                alt={selected.title}
                style={{ width: '100%', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}
              />
              {selected.description && (
                <p style={{ color: 'var(--color-neutral-700)', lineHeight: 1.6 }}>{selected.description}</p>
              )}
              {selected.category && (
                <div style={{ marginTop: '0.75rem' }}>
                  <span className="badge badge-green">{selected.category}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

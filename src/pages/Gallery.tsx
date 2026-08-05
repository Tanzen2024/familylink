import { useEffect, useState } from 'react'
import { Images, X } from 'lucide-react'
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
    <div className="container gallery-page">
      <h1 className="page-title">Galerie</h1>
      <p className="page-subtitle">Les moments forts de l'association en images</p>

      {items.length === 0 ? (
        <div className="empty-state">
          <Images size={28} strokeWidth={1.5} />
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
                  <span className="badge badge-green gallery-card-category">{item.category}</span>
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
              <button className="modal-close" onClick={() => setSelected(null)} aria-label="Fermer">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <img src={selected.photo_url} alt={selected.title} className="gallery-lightbox-image" />
              {selected.description && (
                <p className="gallery-lightbox-description">{selected.description}</p>
              )}
              {selected.category && (
                <div className="gallery-lightbox-category">
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

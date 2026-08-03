import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { NewsItem } from '../lib/types'

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<NewsItem | null>(null)

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('news').select('*').order('published_at', { ascending: false })
      setNews(data ?? [])
      setLoading(false)
    })()
  }, [])

  if (loading) return <div className="loading-state">Chargement…</div>

  if (selected) {
    return (
      <div className="container">
        <button className="back-link" onClick={() => setSelected(null)}>← Retour aux actualités</button>
        <article className="news-detail">
          {selected.photo_url && <img src={selected.photo_url} alt={selected.title} className="news-detail-photo" />}
          <h1>{selected.title}</h1>
          <div className="news-meta">
            Publié le {new Date(selected.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          {selected.video_url && (
            <div className="video-wrapper" style={{ marginBottom: '2rem' }}>
              <video controls className="video-player" src={selected.video_url} />
            </div>
          )}
          <div className="news-content">{selected.content}</div>
        </article>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="page-title">Actualités</h1>
      <p className="page-subtitle">Les dernières annonces de l'association</p>

      {news.length === 0 ? (
        <div className="empty-state">
          <p>Aucune actualité pour le moment.</p>
        </div>
      ) : (
        <div className="grid-2">
          {news.map((n) => (
            <div key={n.id} className="card news-card" style={{ cursor: 'pointer' }} onClick={() => setSelected(n)}>
              {n.photo_url && <img src={n.photo_url} alt={n.title} className="news-card-photo" />}
              <div className="news-card-body">
                <div className="news-date">
                  {new Date(n.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div className="news-card-title">{n.title}</div>
                <p className="news-card-excerpt">{n.content.slice(0, 150)}…</p>
                {n.video_url && (
                  <span className="badge badge-green" style={{ marginTop: '0.5rem' }}>🎬 Vidéo</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

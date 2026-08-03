import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { EventItem } from '../lib/types'

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false })
      setEvents(data ?? [])
      setLoading(false)
    })()
  }, [])

  if (loading) return <div className="loading-state">Chargement…</div>

  return (
    <div className="container">
      <h1 className="page-title">Événements</h1>
      <p className="page-subtitle">Les activités et rassemblements de l'association</p>

      {events.length === 0 ? (
        <div className="empty-state">
          <p>Aucun événement programmé pour le moment.</p>
        </div>
      ) : (
        <div className="grid-2">
          {events.map((e) => (
            <div key={e.id} className="card event-card">
              {e.photo_url && <img src={e.photo_url} alt={e.title} className="event-card-photo" />}
              <div className="event-card-body">
                <div className="event-date">
                  {e.event_date
                    ? new Date(e.event_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                    : 'Date à définir'}
                </div>
                <div className="event-card-title">{e.title}</div>
                {e.description && <p className="news-card-excerpt">{e.description}</p>}
                {e.location && <div className="event-location">📍 {e.location}</div>}
                {e.video_url && (
                  <div className="video-wrapper" style={{ marginTop: '1rem' }}>
                    <video controls className="video-player" src={e.video_url} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

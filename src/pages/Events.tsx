import { useEffect, useState } from 'react'
import { CalendarDays, MapPin, CalendarX, Video, Play } from 'lucide-react'
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
    <div className="container events-page">
      <h1 className="page-title">Événements</h1>
      <p className="page-subtitle">Les activités et rassemblements de l'association</p>

      {events.length === 0 ? (
        <div className="empty-state">
          <CalendarX size={28} strokeWidth={1.5} />
          <p>Aucun événement programmé pour le moment.</p>
        </div>
      ) : (
        <div className="grid-2">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  )
}

function EventCard({ event: e }: { event: EventItem }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="card event-card">
      {e.photo_url ? (
        <img src={e.photo_url} alt={e.title} className="event-card-photo" />
      ) : e.video_url && !playing ? (
        <button
          type="button"
          className="video-cover video-cover-button"
          onClick={() => setPlaying(true)}
          aria-label={`Voir la vidéo de l'événement "${e.title}"`}
        >
          {e.video_thumbnail_url ? (
            <img src={e.video_thumbnail_url} alt={`Aperçu vidéo de ${e.title}`} className="video-cover-img" />
          ) : (
            <div className="video-cover-fallback">
              <Video size={26} strokeWidth={1.5} />
              <span>Aperçu vidéo</span>
            </div>
          )}
          <span className="video-cover-play" aria-hidden="true">
            <Play size={20} fill="white" />
          </span>
        </button>
      ) : null}
      <div className="event-card-body">
        <div className="event-date">
          <CalendarDays size={13} />
          {e.event_date
            ? new Date(e.event_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
            : 'Date à définir'}
        </div>
        <div className="event-card-title">{e.title}</div>
        {e.description && <p className="news-card-excerpt">{e.description}</p>}
        {e.location && (
          <div className="event-location">
            <MapPin size={13} />
            {e.location}
          </div>
        )}
        {e.video_url && (e.photo_url || playing) && (
          <div className="video-wrapper" style={{ marginTop: '1rem' }}>
            <video controls autoPlay={playing} className="video-player" src={e.video_url} />
          </div>
        )}
      </div>
    </div>
  )
}

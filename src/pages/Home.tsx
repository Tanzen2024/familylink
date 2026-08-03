import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Member, EventItem, NewsItem } from '../lib/types'

export default function Home() {
  const [memberCount, setMemberCount] = useState(0)
  const [recentMembers, setRecentMembers] = useState<Member[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([])
  const [latestNews, setLatestNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const [{ count }, { data: members }, { data: events }, { data: news }] = await Promise.all([
        supabase.from('members').select('*', { count: 'exact', head: true }),
        supabase.from('members').select('*').order('created_at', { ascending: false }).limit(4),
        supabase.from('events').select('*').order('event_date', { ascending: true }).limit(3),
        supabase.from('news').select('*').order('published_at', { ascending: false }).limit(3),
      ])

      setMemberCount(count ?? 0)
      setRecentMembers(members ?? [])
      setUpcomingEvents(events ?? [])
      setLatestNews(news ?? [])
      setLoading(false)
    })()
  }, [])

  if (loading) return <div className="loading-state">Chargement…</div>

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-content">
          <h1>MENTHONG ASSOCIATION GROUP</h1>
          <p>
            Projet de Création de l'Association des Petits-Fils Menthong —
            Un appel à l'unité, à la mémoire et à l'avenir.
          </p>
          <Link to="/membres" className="btn">Voir les membres</Link>
        </div>
      </section>

      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        <div className="stat-card">
          <div className="stat-value">{memberCount}</div>
          <div className="stat-label">Membres inscrits</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{upcomingEvents.length}</div>
          <div className="stat-label">Événements à venir</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{latestNews.length}</div>
          <div className="stat-label">Actualités récentes</div>
        </div>
      </div>

      <section className="manifesto">
        <h2 className="manifesto-title">Projet de Création de l'Association des Petits-Fils Menthong</h2>
        <p className="manifesto-subtitle">Un appel à l'unité, à la mémoire et à l'avenir</p>

        <div className="manifesto-section">
          <h3>1. Une réalité qui nous interpelle</h3>
          <p>
            Nous sommes une grande famille Menthong : riche, nombreuse, talentueuse… mais éparpillée.
            Nous nous croisons rarement, souvent lors d'événements douloureux, et nos enfants se connaissent à peine.
            Pourtant, nos parents ont su préserver l'esprit de rassemblement.
            À nous maintenant de raviver cette flamme.
          </p>
        </div>

        <div className="manifesto-section">
          <h3>2. La naissance d'une initiative attendue</h3>
          <p>
            Une sœur a exprimé ce que beaucoup ressentaient : le besoin de nous reconnecter.
            De là est née l'idée du forum « Les Petits-Fils Menthong », notre premier espace commun.
            Chacun est invité à transmettre les noms et contacts des cousins prêts à rejoindre l'aventure.
          </p>
        </div>

        <div className="manifesto-section">
          <h3>3. Un noyau moteur pour structurer l'élan</h3>
          <p>Une petite cellule de réflexion sera constituée pour :</p>
          <ul>
            <li>organiser les premières idées,</li>
            <li>préparer la rencontre virtuelle,</li>
            <li>donner une direction claire à nos actions.</li>
          </ul>
          <p>Ce n'est pas un organe de pouvoir, mais un groupe d'impulsion.</p>
        </div>

        <div className="manifesto-section">
          <h3>4. Un espace d'échanges et de projets</h3>
          <p>
            Le forum sera un lieu vivant où chacun pourra proposer, commenter, construire.
            Projets sociaux, solidarité, histoire familiale, entraide…
            Tout pourra y trouver sa place, dans le respect et la bienveillance.
          </p>
        </div>

        <div className="manifesto-section">
          <h3>5. Le rôle précieux de nos parents</h3>
          <p>
            Ils seront nos conseillers, nos repères, les gardiens de notre mémoire.
            Leur sagesse et leurs bénédictions seront essentielles pour bâtir quelque chose de durable.
          </p>
        </div>

        <div className="manifesto-section">
          <h3>6. Pourquoi cette association ?</h3>
          <p>
            Parce que nous refusons d'être une famille qui ne se retrouve que dans la douleur.
            Parce que nous avons des talents à unir, une histoire à honorer, un avenir à construire.
            Parce que nous avons la responsabilité de transformer notre héritage en force collective.
          </p>
        </div>

        <div className="manifesto-conclusion">
          <h3>Conclusion : Le moment d'agir est venu</h3>
          <p>
            Le temps des constats est terminé.
            Nous avons l'opportunité de nous rassembler, de nous connaître, de bâtir ensemble.
          </p>
        </div>
      </section>

      {recentMembers.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <div className="section-header">
            <h2>Nouveaux membres</h2>
            <Link to="/membres" className="back-link">Voir tout →</Link>
          </div>
          <div className="grid-4">
            {recentMembers.map((m) => (
              <Link key={m.id} to={`/membres/${m.id}`} className="card member-card">
                {m.photo_url ? (
                  <img src={m.photo_url} alt={`${m.first_name} ${m.last_name}`} className="member-card-photo" />
                ) : (
                  <div className="member-card-placeholder">{m.first_name[0]}{m.last_name[0]}</div>
                )}
                <div className="member-card-body">
                  <div className="member-card-name">{m.first_name} {m.last_name}</div>
                  <div className="member-card-info">{m.profession || 'Membre du village'}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {upcomingEvents.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <div className="section-header">
            <h2>Événements</h2>
            <Link to="/evenements" className="back-link">Voir tout →</Link>
          </div>
          <div className="grid-3">
            {upcomingEvents.map((e) => (
              <div key={e.id} className="card event-card">
                {e.photo_url && <img src={e.photo_url} alt={e.title} className="event-card-photo" />}
                <div className="event-card-body">
                  <div className="event-date">
                    {e.event_date ? new Date(e.event_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date à définir'}
                  </div>
                  <div className="event-card-title">{e.title}</div>
                  {e.description && <p className="news-card-excerpt">{e.description.slice(0, 100)}…</p>}
                  {e.location && <div className="event-location">📍 {e.location}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {latestNews.length > 0 && (
        <section>
          <div className="section-header">
            <h2>Actualités</h2>
            <Link to="/actualites" className="back-link">Voir tout →</Link>
          </div>
          <div className="grid-3">
            {latestNews.map((n) => (
              <div key={n.id} className="card news-card">
                {n.photo_url && <img src={n.photo_url} alt={n.title} className="news-card-photo" />}
                <div className="news-card-body">
                  <div className="news-date">
                    {new Date(n.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="news-card-title">{n.title}</div>
                  <p className="news-card-excerpt">{n.content.slice(0, 120)}…</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {memberCount === 0 && upcomingEvents.length === 0 && latestNews.length === 0 && (
        <div className="empty-state">
          <p>Aucun contenu pour le moment. Connectez-vous en tant qu'administrateur pour ajouter des membres et du contenu.</p>
        </div>
      )}
    </div>
  )
}

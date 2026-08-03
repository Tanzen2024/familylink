import { useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { Member, Family, EventItem, NewsItem, GalleryItem } from '../lib/types'
import PhotoUpload from '../components/PhotoUpload'

type Tab = 'members' | 'families' | 'events' | 'news' | 'gallery'

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('members')
  const [members, setMembers] = useState<Member[]>([])
  const [families, setFamilies] = useState<Family[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])

  useEffect(() => {
    (async () => {
      const [{ data: m }, { data: f }, { data: e }, { data: n }, { data: g }] = await Promise.all([
        supabase.from('members').select('*, family:families!members_family_id_fkey(*)').order('last_name'),
        supabase.from('families').select('*').order('name'),
        supabase.from('events').select('*').order('event_date', { ascending: false }),
        supabase.from('news').select('*').order('published_at', { ascending: false }),
        supabase.from('gallery').select('*').order('created_at', { ascending: false }),
      ])
      setMembers(m ?? [])
      setFamilies(f ?? [])
      setEvents(e ?? [])
      setNews(n ?? [])
      setGallery(g ?? [])
    })()
  }, [])

  const refreshMembers = async () => {
    const { data } = await supabase.from('members').select('*, family:families!members_family_id_fkey(*)').order('last_name')
    setMembers(data ?? [])
  }
  const refreshFamilies = async () => {
    const { data } = await supabase.from('families').select('*').order('name')
    setFamilies(data ?? [])
  }
  const refreshEvents = async () => {
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false })
    setEvents(data ?? [])
  }
  const refreshNews = async () => {
    const { data } = await supabase.from('news').select('*').order('published_at', { ascending: false })
    setNews(data ?? [])
  }
  const refreshGallery = async () => {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
    setGallery(data ?? [])
  }

  return (
    <div className="container">
      <h1 className="page-title">Tableau de bord</h1>
      <p className="page-subtitle">Gérez les membres, familles, événements et actualités</p>

      <div className="auth-tabs" style={{ marginBottom: '1.5rem' }}>
        {(['members', 'families', 'events', 'news', 'gallery'] as Tab[]).map((t) => (
          <button key={t} className={`auth-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'members' ? 'Membres' : t === 'families' ? 'Familles' : t === 'events' ? 'Événements' : t === 'news' ? 'Actualités' : 'Galerie'}
          </button>
        ))}
      </div>

      {tab === 'members' && <MembersTab members={members} families={families} onRefresh={refreshMembers} />}
      {tab === 'families' && <FamiliesTab families={families} onRefresh={refreshFamilies} />}
      {tab === 'events' && <EventsTab events={events} onRefresh={refreshEvents} />}
      {tab === 'news' && <NewsTab news={news} onRefresh={refreshNews} />}
      {tab === 'gallery' && <GalleryTab items={gallery} onRefresh={refreshGallery} />}
    </div>
  )
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

// ============================================================
// Members Tab
// ============================================================
function MembersTab({ members, families, onRefresh }: { members: Member[]; families: Family[]; onRefresh: () => Promise<void> }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce membre ?')) return
    await supabase.from('members').delete().eq('id', id)
    await onRefresh()
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h3>Membres ({members.length})</h3>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true) }}>+ Ajouter</button>
      </div>

      {members.length === 0 ? (
        <div className="empty-state"><p>Aucun membre. Cliquez sur « Ajouter » pour en créer un.</p></div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>Nom</th><th>Profession</th><th>Famille</th><th>Statut</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.first_name} {m.last_name}</td>
                <td>{m.profession || '—'}</td>
                <td>{m.family?.name || '—'}</td>
                <td>{m.is_active ? <span className="badge badge-green">Actif</span> : <span className="badge badge-orange">Inactif</span>}</td>
                <td>
                  <button className="btn btn-secondary" style={{ marginRight: '0.5rem' }} onClick={() => { setEditing(m); setShowForm(true) }}>Modifier</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(m.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <MemberForm
          member={editing}
          families={families}
          onClose={() => setShowForm(false)}
          onSaved={async () => { setShowForm(false); await onRefresh() }}
        />
      )}
    </div>
  )
}

function MemberForm({ member, families, onClose, onSaved }: {
  member: Member | null
  families: Family[]
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState({
    first_name: member?.first_name ?? '',
    last_name: member?.last_name ?? '',
    photo_url: member?.photo_url ?? '',
    gender: member?.gender ?? '',
    birth_date: member?.birth_date ?? '',
    phone: member?.phone ?? '',
    email: member?.email ?? '',
    address: member?.address ?? '',
    profession: member?.profession ?? '',
    bio: member?.bio ?? '',
    family_id: member?.family_id ?? '',
    is_active: member?.is_active ?? true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      photo_url: form.photo_url || null,
      gender: form.gender || null,
      birth_date: form.birth_date || null,
      phone: form.phone || null,
      email: form.email || null,
      address: form.address || null,
      profession: form.profession || null,
      bio: form.bio || null,
      family_id: form.family_id || null,
      is_active: form.is_active,
    }

    const { error } = member
      ? await supabase.from('members').update(payload).eq('id', member.id)
      : await supabase.from('members').insert(payload)

    if (error) {
      setError(error.message)
      setSaving(false)
    } else {
      onSaved()
    }
  }

  return (
    <Modal title={member ? 'Modifier le membre' : 'Nouveau membre'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Prénom *</label>
            <input className="form-input" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Nom *</label>
            <input className="form-input" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
          </div>
        </div>
        <PhotoUpload value={form.photo_url} onChange={(url) => setForm({ ...form, photo_url: url ?? '' })} label="Photo du membre" folder="members" />
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Sexe</label>
            <select className="form-select" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="">—</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date de naissance</label>
            <input type="date" className="form-input" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} />
          </div>
        </div>
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Téléphone</label>
            <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Adresse</label>
          <input className="form-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Profession</label>
            <input className="form-input" value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Famille</label>
            <select className="form-select" value={form.family_id} onChange={(e) => setForm({ ...form, family_id: e.target.value })}>
              <option value="">—</option>
              {families.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Biographie</label>
          <textarea className="form-textarea" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} style={{ marginRight: '0.5rem' }} />
            Membre actif
          </label>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
        </div>
      </form>
    </Modal>
  )
}

// ============================================================
// Families Tab
// ============================================================
function FamiliesTab({ families, onRefresh }: { families: Family[]; onRefresh: () => Promise<void> }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Family | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette famille ?')) return
    await supabase.from('families').delete().eq('id', id)
    await onRefresh()
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h3>Familles ({families.length})</h3>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true) }}>+ Ajouter</button>
      </div>

      {families.length === 0 ? (
        <div className="empty-state"><p>Aucune famille enregistrée.</p></div>
      ) : (
        <table className="admin-table">
          <thead><tr><th>Nom</th><th>Description</th><th>Actions</th></tr></thead>
          <tbody>
            {families.map((f) => (
              <tr key={f.id}>
                <td>{f.name}</td>
                <td>{f.description || '—'}</td>
                <td>
                  <button className="btn btn-secondary" style={{ marginRight: '0.5rem' }} onClick={() => { setEditing(f); setShowForm(true) }}>Modifier</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(f.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <FamilyForm family={editing} onClose={() => setShowForm(false)} onSaved={async () => { setShowForm(false); await onRefresh() }} />
      )}
    </div>
  )
}

function FamilyForm({ family, onClose, onSaved }: { family: Family | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(family?.name ?? '')
  const [description, setDescription] = useState(family?.description ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload = { name, description: description || null }
    const { error } = family
      ? await supabase.from('families').update(payload).eq('id', family.id)
      : await supabase.from('families').insert(payload)
    if (error) { setError(error.message); setSaving(false) }
    else onSaved()
  }

  return (
    <Modal title={family ? 'Modifier la famille' : 'Nouvelle famille'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nom *</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        {error && <div className="form-error">{error}</div>}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
        </div>
      </form>
    </Modal>
  )
}

// ============================================================
// Events Tab
// ============================================================
function EventsTab({ events, onRefresh }: { events: EventItem[]; onRefresh: () => Promise<void> }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<EventItem | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet événement ?')) return
    await supabase.from('events').delete().eq('id', id)
    await onRefresh()
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h3>Événements ({events.length})</h3>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true) }}>+ Ajouter</button>
      </div>

      {events.length === 0 ? (
        <div className="empty-state"><p>Aucun événement enregistré.</p></div>
      ) : (
        <table className="admin-table">
          <thead><tr><th>Titre</th><th>Date</th><th>Lieu</th><th>Actions</th></tr></thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td>{e.title}</td>
                <td>{e.event_date ? new Date(e.event_date).toLocaleDateString('fr-FR') : '—'}</td>
                <td>{e.location || '—'}</td>
                <td>
                  <button className="btn btn-secondary" style={{ marginRight: '0.5rem' }} onClick={() => { setEditing(e); setShowForm(true) }}>Modifier</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(e.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <EventForm event={editing} onClose={() => setShowForm(false)} onSaved={async () => { setShowForm(false); await onRefresh() }} />
      )}
    </div>
  )
}

function EventForm({ event, onClose, onSaved }: { event: EventItem | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    title: event?.title ?? '',
    description: event?.description ?? '',
    event_date: event?.event_date ? event.event_date.slice(0, 16) : '',
    photo_url: event?.photo_url ?? '',
    video_url: event?.video_url ?? '',
    location: event?.location ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload = {
      title: form.title,
      description: form.description || null,
      event_date: form.event_date ? new Date(form.event_date).toISOString() : null,
      photo_url: form.photo_url || null,
      video_url: form.video_url || null,
      location: form.location || null,
    }
    const { error } = event
      ? await supabase.from('events').update(payload).eq('id', event.id)
      : await supabase.from('events').insert(payload)
    if (error) { setError(error.message); setSaving(false) }
    else onSaved()
  }

  return (
    <Modal title={event ? "Modifier l'événement" : 'Nouvel événement'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Titre *</label>
          <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="datetime-local" className="form-input" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Lieu</label>
            <input className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
        </div>
        <PhotoUpload value={form.photo_url} onChange={(url) => setForm({ ...form, photo_url: url ?? '' })} label="Photo de l'événement" folder="events" />
        <div className="form-group">
          <label className="form-label">URL de la vidéo</label>
          <input className="form-input" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://…" />
        </div>
        {error && <div className="form-error">{error}</div>}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
        </div>
      </form>
    </Modal>
  )
}

// ============================================================
// News Tab
// ============================================================
function NewsTab({ news, onRefresh }: { news: NewsItem[]; onRefresh: () => Promise<void> }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<NewsItem | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette actualité ?')) return
    await supabase.from('news').delete().eq('id', id)
    await onRefresh()
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h3>Actualités ({news.length})</h3>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true) }}>+ Ajouter</button>
      </div>

      {news.length === 0 ? (
        <div className="empty-state"><p>Aucune actualité enregistrée.</p></div>
      ) : (
        <table className="admin-table">
          <thead><tr><th>Titre</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {news.map((n) => (
              <tr key={n.id}>
                <td>{n.title}</td>
                <td>{new Date(n.published_at).toLocaleDateString('fr-FR')}</td>
                <td>
                  <button className="btn btn-secondary" style={{ marginRight: '0.5rem' }} onClick={() => { setEditing(n); setShowForm(true) }}>Modifier</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(n.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <NewsForm item={editing} onClose={() => setShowForm(false)} onSaved={async () => { setShowForm(false); await onRefresh() }} />
      )}
    </div>
  )
}

function NewsForm({ item, onClose, onSaved }: { item: NewsItem | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    title: item?.title ?? '',
    content: item?.content ?? '',
    photo_url: item?.photo_url ?? '',
    video_url: item?.video_url ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload = { title: form.title, content: form.content, photo_url: form.photo_url || null, video_url: form.video_url || null }
    const { error } = item
      ? await supabase.from('news').update(payload).eq('id', item.id)
      : await supabase.from('news').insert(payload)
    if (error) { setError(error.message); setSaving(false) }
    else onSaved()
  }

  return (
    <Modal title={item ? "Modifier l'actualité" : 'Nouvelle actualité'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Titre *</label>
          <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="form-label">Contenu *</label>
          <textarea className="form-textarea" style={{ minHeight: '150px' }} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
        </div>
        <PhotoUpload value={form.photo_url} onChange={(url) => setForm({ ...form, photo_url: url ?? '' })} label="Photo de l'actualité" folder="news" />
        <div className="form-group">
          <label className="form-label">URL de la vidéo</label>
          <input className="form-input" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://…" />
        </div>
        {error && <div className="form-error">{error}</div>}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
        </div>
      </form>
    </Modal>
  )
}

// ============================================================
// Gallery Tab
// ============================================================
function GalleryTab({ items, onRefresh }: { items: GalleryItem[]; onRefresh: () => Promise<void> }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<GalleryItem | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette photo ?')) return
    await supabase.from('gallery').delete().eq('id', id)
    await onRefresh()
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h3>Galerie ({items.length})</h3>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true) }}>+ Ajouter</button>
      </div>

      {items.length === 0 ? (
        <div className="empty-state"><p>Aucune photo. Cliquez sur « Ajouter » pour en mettre une en ligne.</p></div>
      ) : (
        <div className="grid-3">
          {items.map((item) => (
            <div key={item.id} className="card">
              <img src={item.photo_url} alt={item.title} className="member-card-photo" />
              <div className="member-card-body">
                <div className="member-card-name">{item.title}</div>
                {item.category && <div className="member-card-info">{item.category}</div>}
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary" onClick={() => { setEditing(item); setShowForm(true) }}>Modifier</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <GalleryForm
          item={editing}
          onClose={() => setShowForm(false)}
          onSaved={async () => { setShowForm(false); await onRefresh() }}
        />
      )}
    </div>
  )
}

function GalleryForm({ item, onClose, onSaved }: {
  item: GalleryItem | null
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState({
    title: item?.title ?? '',
    description: item?.description ?? '',
    photo_url: item?.photo_url ?? '',
    category: item?.category ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      title: form.title,
      description: form.description || null,
      photo_url: form.photo_url,
      category: form.category || null,
    }

    const { error } = item
      ? await supabase.from('gallery').update(payload).eq('id', item.id)
      : await supabase.from('gallery').insert(payload)

    if (error) { setError(error.message); setSaving(false) }
    else onSaved()
  }

  return (
    <Modal title={item ? 'Modifier la photo' : 'Nouvelle photo'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Titre *</label>
          <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <PhotoUpload value={form.photo_url} onChange={(url) => setForm({ ...form, photo_url: url ?? '' })} label="Photo" folder="gallery" />
        <div className="form-group">
          <label className="form-label">Catégorie</label>
          <input className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Ex : Événements, Réunions…" />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        {error && <div className="form-error">{error}</div>}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
        </div>
      </form>
    </Modal>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Member, Family } from '../lib/types'

export default function Members() {
  const [members, setMembers] = useState<Member[]>([])
  const [families, setFamilies] = useState<Family[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [familyFilter, setFamilyFilter] = useState('')

  useEffect(() => {
    (async () => {
      const [{ data: memberData }, { data: familyData }] = await Promise.all([
        supabase.from('members').select('*, family:families!members_family_id_fkey(*)').order('last_name'),
        supabase.from('families').select('*').order('name'),
      ])
      setMembers(memberData ?? [])
      setFamilies(familyData ?? [])
      setLoading(false)
    })()
  }, [])

  const filtered = members.filter((m) => {
    const fullName = `${m.first_name} ${m.last_name}`.toLowerCase()
    const matchesSearch = !search || fullName.includes(search.toLowerCase()) || (m.profession?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchesGender = !genderFilter || m.gender === genderFilter
    const matchesFamily = !familyFilter || m.family_id === familyFilter
    return matchesSearch && matchesGender && matchesFamily
  })

  if (loading) return <div className="loading-state">Chargement…</div>

  return (
    <div className="container members-page">
      <h1 className="page-title">Annuaire des membres</h1>
      <p className="page-subtitle">{filtered.length} membre{filtered.length !== 1 ? 's' : ''} du village</p>

      <div className="search-bar">
        <div className="search-bar-field">
          <Search size={16} />
          <input
            type="text"
            className="form-input"
            placeholder="Rechercher par nom ou profession…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="form-select" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
          <option value="">Tous les sexes</option>
          <option value="male">Hommes</option>
          <option value="female">Femmes</option>
        </select>
        <select className="form-select" value={familyFilter} onChange={(e) => setFamilyFilter(e.target.value)}>
          <option value="">Toutes les familles</option>
          {families.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Users size={28} strokeWidth={1.5} />
          <p>Aucun membre trouvé. {members.length === 0 && 'Aucun membre enregistré pour le moment.'}</p>
        </div>
      ) : (
        <div className="grid-4">
          {filtered.map((m) => (
            <Link key={m.id} to={`/membres/${m.id}`} className="card member-card">
              {m.photo_url ? (
                <img src={m.photo_url} alt={`${m.first_name} ${m.last_name}`} className="member-card-photo" />
              ) : (
                <div className="member-card-placeholder">{m.first_name[0]}{m.last_name[0]}</div>
              )}
              <div className="member-card-body">
                <div className="member-card-name">{m.first_name} {m.last_name}</div>
                <div className="member-card-info">
                  {m.profession || 'Membre du village'}
                </div>
                {m.family && (
                  <div className="member-card-info member-card-family">
                    Famille {m.family.name}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

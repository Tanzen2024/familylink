import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Briefcase, Cake, User, Phone, Mail, MapPin, Users, NotebookText, UserX } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Member } from '../lib/types'

export default function MemberDetail() {
  const { id } = useParams()
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('members')
        .select('*, family:families!members_family_id_fkey(*), association_roles(*)')
        .eq('id', id!)
        .maybeSingle()
      setMember(data)
      setLoading(false)
    })()
  }, [id])

  if (loading) return <div className="loading-state">Chargement…</div>
  if (!member) return (
    <div className="container member-detail-page">
      <div className="empty-state member-notfound">
        <UserX size={28} strokeWidth={1.5} />
        <p>Membre introuvable.</p>
        <Link to="/membres" className="btn btn-primary" style={{ marginTop: '1rem' }}>Retour à l'annuaire</Link>
      </div>
    </div>
  )

  const age = member.birth_date
    ? Math.floor((Date.now() - new Date(member.birth_date).getTime()) / (365.25 * 24 * 3600 * 1000))
    : null

  return (
    <div className="container member-detail-page">
      <Link to="/membres" className="back-link">← Retour à l'annuaire</Link>

      <div className="member-detail-card">
        <div className="member-detail">
          <div className="member-detail-photo-wrap">
            {member.photo_url ? (
              <img src={member.photo_url} alt={`${member.first_name} ${member.last_name}`} className="member-detail-photo" />
            ) : (
              <div className="member-detail-placeholder">{member.first_name[0]}{member.last_name[0]}</div>
            )}
          </div>

          <div className="member-detail-info">
            <h1>{member.first_name} {member.last_name}</h1>

            {member.association_roles && member.association_roles.length > 0 && (
              <div className="member-detail-roles">
                {member.association_roles.map((r) => (
                  <span key={r.id} className="badge badge-green">{r.role}</span>
                ))}
              </div>
            )}

            {member.profession && (
              <div className="info-row">
                <span className="info-label"><Briefcase size={15} /> Profession</span>
                <span className="info-value">{member.profession}</span>
              </div>
            )}

            {age !== null && (
              <div className="info-row">
                <span className="info-label"><Cake size={15} /> Âge</span>
                <span className="info-value">{age} ans</span>
              </div>
            )}

            {member.gender && (
              <div className="info-row">
                <span className="info-label"><User size={15} /> Sexe</span>
                <span className="info-value">{member.gender === 'male' ? 'Homme' : 'Femme'}</span>
              </div>
            )}

            {member.phone && (
              <div className="info-row">
                <span className="info-label"><Phone size={15} /> Téléphone</span>
                <span className="info-value">{member.phone}</span>
              </div>
            )}

            {member.email && (
              <div className="info-row">
                <span className="info-label"><Mail size={15} /> Email</span>
                <span className="info-value">{member.email}</span>
              </div>
            )}

            {member.address && (
              <div className="info-row">
                <span className="info-label"><MapPin size={15} /> Adresse</span>
                <span className="info-value">{member.address}</span>
              </div>
            )}

            {member.family && (
              <div className="info-row">
                <span className="info-label"><Users size={15} /> Famille</span>
                <span className="info-value">{member.family.name}</span>
              </div>
            )}

            {member.bio && (
              <div className="member-detail-bio">
                <h3 className="member-detail-bio-title"><NotebookText size={16} /> À propos</h3>
                <p>{member.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

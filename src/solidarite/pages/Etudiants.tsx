import { useState } from 'react'
import { Plus, GraduationCap, Star, MapPin, CheckCircle2, XCircle } from 'lucide-react'
import { mockStudentRequests, mockMentors } from '../mockData'
import { useToast } from '../ToastContext'
import { Modal, StatusBadge, Avatar, EmptyState } from '../ui'
import type { StudentRequest } from '../types'

export default function Etudiants() {
  const { notify } = useToast()
  const [requests, setRequests] = useState<StudentRequest[]>(mockStudentRequests)
  const [mentors] = useState(mockMentors)
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState<'requests' | 'mentors'>('requests')

  const handleCreate = (data: { studentName: string; requestType: StudentRequest['requestType']; field: string }) => {
    const newReq: StudentRequest = {
      ...data, id: `s${Date.now()}`, date: new Date().toISOString().slice(0, 10), status: 'Nouvelle',
    }
    setRequests((prev) => [newReq, ...prev])
    setShowForm(false)
    notify('success', 'Demande créée', `${data.requestType} demandée par ${data.studentName}.`)
  }

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Étudiants</h1>
          <p>Bourses, mentors, stages et accompagnement</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} style={{ marginRight: '0.25rem' }} /> Nouvelle demande
        </button>
      </div>

      <div className="sol-tabs">
        <div className={`sol-tab ${tab === 'requests' ? 'active' : ''}`} onClick={() => setTab('requests')}>Demandes ({requests.length})</div>
        <div className={`sol-tab ${tab === 'mentors' ? 'active' : ''}`} onClick={() => setTab('mentors')}>Mentors disponibles ({mentors.filter((m) => m.available).length})</div>
      </div>

      {tab === 'requests' ? (
        requests.length === 0 ? <EmptyState message="Aucune demande étudiante." /> : (
          <div className="sol-chart" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="sol-table">
              <thead>
                <tr><th>Étudiant</th><th>Type</th><th>Domaine</th><th>Date</th><th>Statut</th></tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>{r.studentName}</td>
                    <td>{r.requestType}</td>
                    <td>{r.field}</td>
                    <td>{new Date(r.date).toLocaleDateString('fr-FR')}</td>
                    <td><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="grid-3">
          {mentors.map((m) => (
            <div key={m.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Avatar name={m.name} size="lg" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{m.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>{m.expertise}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-neutral-500)', marginBottom: '0.75rem' }}>
                <MapPin size={14} /> {m.city}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                {m.available ? (
                  <><CheckCircle2 size={16} style={{ color: '#065f46' }} /> <span style={{ color: '#065f46', fontWeight: 500 }}>Disponible</span></>
                ) : (
                  <><XCircle size={16} style={{ color: '#991b1b' }} /> <span style={{ color: '#991b1b', fontWeight: 500 }}>Indisponible</span></>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <StudentForm onClose={() => setShowForm(false)} onCreate={handleCreate} />}
    </div>
  )
}

function StudentForm({ onClose, onCreate }: { onClose: () => void; onCreate: (data: { studentName: string; requestType: StudentRequest['requestType']; field: string }) => void }) {
  const [form, setForm] = useState({ studentName: '', requestType: 'Bourse' as StudentRequest['requestType'], field: '' })
  return (
    <Modal title="Nouvelle demande étudiante" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onCreate(form) }}>
        <div className="form-group"><label className="form-label">Nom de l'étudiant *</label><input className="form-input" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} required /></div>
        <div className="form-group"><label className="form-label">Type de demande *</label>
          <select className="form-select" value={form.requestType} onChange={(e) => setForm({ ...form, requestType: e.target.value as StudentRequest['requestType'] })}>
            <option value="Bourse">Bourse</option><option value="Mentor">Mentor</option><option value="Stage">Stage</option><option value="Accompagnement">Accompagnement</option>
          </select>
        </div>
        <div className="form-group"><label className="form-label">Domaine *</label><input className="form-input" value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} required /></div>
        <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button><button type="submit" className="btn btn-primary">Créer</button></div>
      </form>
    </Modal>
  )
}

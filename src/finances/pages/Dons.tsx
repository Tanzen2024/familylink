import { useState } from 'react'
import { Plus, Gift, TrendingUp, FileText } from 'lucide-react'
import { mockDonations } from '../mockData'
import { useToast } from '../toast'
import { Modal, formatMoney, EmptyState } from '../ui'
import type { Donation } from '../types'

export default function Dons() {
  const { notify } = useToast()
  const [donations, setDonations] = useState<Donation[]>(mockDonations)
  const [showForm, setShowForm] = useState(false)

  const totalAmount = donations.reduce((s, d) => s + d.amount, 0)
  const uniqueDonors = new Set(donations.map((d) => d.donor)).size
  const projects = new Set(donations.map((d) => d.project)).size

  const handleCreate = (data: { donor: string; amount: number; project: string; allocation: string }) => {
    const num = `REC-2025-${String(donations.length + 1).padStart(3, '0')}`
    const newDon: Donation = { ...data, id: `d${Date.now()}`, date: new Date().toISOString().slice(0, 10), receiptNumber: num }
    setDonations((prev) => [newDon, ...prev])
    setShowForm(false)
    notify('success', 'Don enregistré', `${formatMoney(data.amount)} de ${data.donor}. Reçu ${num}.`)
  }

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Dons</h1>
          <p>Enregistrez et suivez les dons reçus</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} style={{ marginRight: '0.25rem' }} /> Enregistrer un don
        </button>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="sol-kpi">
          <div className="sol-kpi-icon" style={{ background: '#fce7f3', color: '#9d174d' }}><Gift size={24} /></div>
          <div><div className="sol-kpi-value">{formatMoney(totalAmount)}</div><div className="sol-kpi-label">Total des dons</div></div>
        </div>
        <div className="sol-kpi">
          <div className="sol-kpi-icon" style={{ background: '#dbeafe', color: '#1e40af' }}><TrendingUp size={24} /></div>
          <div><div className="sol-kpi-value">{uniqueDonors}</div><div className="sol-kpi-label">Donateurs</div></div>
        </div>
        <div className="sol-kpi">
          <div className="sol-kpi-icon" style={{ background: '#d1fae5', color: '#065f46' }}><FileText size={24} /></div>
          <div><div className="sol-kpi-value">{projects}</div><div className="sol-kpi-label">Projets soutenus</div></div>
        </div>
      </div>

      {donations.length === 0 ? <EmptyState message="Aucun don enregistré." /> : (
        <div className="sol-chart" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="sol-table">
            <thead><tr><th>Reçu</th><th>Donateur</th><th>Montant</th><th>Date</th><th>Projet</th><th>Affectation</th></tr></thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600, fontSize: '0.8rem' }}>{d.receiptNumber}</td>
                  <td style={{ fontWeight: 500 }}>{d.donor}</td>
                  <td style={{ fontWeight: 700, color: '#9d174d' }}>{formatMoney(d.amount)}</td>
                  <td>{new Date(d.date).toLocaleDateString('fr-FR')}</td>
                  <td>{d.project}</td>
                  <td>{d.allocation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && <DonationForm onClose={() => setShowForm(false)} onCreate={handleCreate} />}
    </div>
  )
}

function DonationForm({ onClose, onCreate }: { onClose: () => void; onCreate: (data: { donor: string; amount: number; project: string; allocation: string }) => void }) {
  const [form, setForm] = useState({ donor: '', amount: 0, project: '', allocation: '' })
  return (
    <Modal title="Enregistrer un don" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onCreate({ ...form, amount: Number(form.amount) }) }}>
        <div className="form-group"><label className="form-label">Donateur *</label><input className="form-input" value={form.donor} onChange={(e) => setForm({ ...form, donor: e.target.value })} required /></div>
        <div className="form-group"><label className="form-label">Montant (FCFA) *</label><input type="number" className="form-input" value={form.amount || ''} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} required min="1" /></div>
        <div className="form-group"><label className="form-label">Projet concerné *</label><input className="form-input" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} required /></div>
        <div className="form-group"><label className="form-label">Affectation *</label><input className="form-input" value={form.allocation} onChange={(e) => setForm({ ...form, allocation: e.target.value })} required /></div>
        <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button><button type="submit" className="btn btn-primary">Enregistrer</button></div>
      </form>
    </Modal>
  )
}

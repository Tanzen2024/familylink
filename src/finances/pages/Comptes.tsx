import { useState } from 'react'
import { Landmark, ArrowDownCircle, ArrowUpCircle, Plus, Phone } from 'lucide-react'
import { mockAccounts } from '../mockData'
import { useToast } from '../toast'
import { Modal, formatMoney, EmptyState, KpiCard } from '../ui'
import type { BankAccount, AccountType } from '../types'

export default function Comptes() {
  const { notify } = useToast()
  const [accounts, setAccounts] = useState<BankAccount[]>(mockAccounts)
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<BankAccount | null>(null)

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0)

  const handleCreate = (data: { name: string; type: AccountType; balance: number; iban: string; phone: string }) => {
    const newAcc: BankAccount = {
      ...data, id: `a${Date.now()}`,
      iban: data.iban || null, phone: data.phone || null,
      operations: [],
    }
    setAccounts((prev) => [...prev, newAcc])
    setShowForm(false)
    notify('success', 'Compte créé', `Le compte "${data.name}" a été ajouté.`)
  }

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Comptes</h1>
          <p>Gérez vos comptes bancaires et mobile money</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} style={{ marginRight: '0.25rem' }} /> Ajouter un compte
        </button>
      </div>

      <KpiCard
        icon={Landmark}
        label="Solde total"
        value={formatMoney(totalBalance)}
        bg="#dbeafe"
        color="#1e40af"
        style={{ marginBottom: '1.5rem', maxWidth: '300px' }}
      />

      {accounts.length === 0 ? <EmptyState message="Aucun compte enregistré." /> : (
        <div className="grid-2">
          {accounts.map((a) => (
            <div key={a.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(a)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Landmark size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{a.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>{a.type}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary-600)' }}>{formatMoney(a.balance)}</div>
                </div>
              </div>
              {a.iban && <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)', marginBottom: '0.25rem' }}>IBAN: {a.iban}</div>}
              {a.phone && <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Phone size={12} /> {a.phone}</div>}

              {a.operations.length > 0 && (
                <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--color-neutral-100)', paddingTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-neutral-500)', marginBottom: '0.5rem' }}>Dernières opérations</div>
                  {a.operations.slice(0, 3).map((op, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      {op.type === 'credit' ? <ArrowDownCircle size={16} style={{ color: '#065f46' }} /> : <ArrowUpCircle size={16} style={{ color: '#991b1b' }} />}
                      <span style={{ flex: 1, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{op.label}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: op.type === 'credit' ? '#065f46' : '#991b1b' }}>{op.type === 'credit' ? '+' : '-'}{formatMoney(op.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && <AccountForm onClose={() => setShowForm(false)} onCreate={handleCreate} />}
      {selected && <AccountDetail account={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function AccountForm({ onClose, onCreate }: { onClose: () => void; onCreate: (data: { name: string; type: AccountType; balance: number; iban: string; phone: string }) => void }) {
  const [form, setForm] = useState({ name: '', type: 'Banque' as AccountType, balance: 0, iban: '', phone: '' })
  return (
    <Modal title="Ajouter un compte" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onCreate({ ...form, balance: Number(form.balance) }) }}>
        <div className="form-group"><label className="form-label">Nom du compte *</label><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
        <div className="form-group"><label className="form-label">Type *</label>
          <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AccountType })}>
            <option value="Banque">Banque</option><option value="Orange Money">Orange Money</option><option value="MTN MoMo">MTN MoMo</option><option value="Caisse">Caisse</option>
          </select>
        </div>
        <div className="form-group"><label className="form-label">Solde initial (FCFA)</label><input type="number" className="form-input" value={form.balance || ''} onChange={(e) => setForm({ ...form, balance: Number(e.target.value) })} /></div>
        {form.type === 'Banque' && <div className="form-group"><label className="form-label">IBAN</label><input className="form-input" value={form.iban} onChange={(e) => setForm({ ...form, iban: e.target.value })} /></div>}
        {(form.type === 'Orange Money' || form.type === 'MTN MoMo') && <div className="form-group"><label className="form-label">Téléphone</label><input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>}
        <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button><button type="submit" className="btn btn-primary">Ajouter</button></div>
      </form>
    </Modal>
  )
}

function AccountDetail({ account, onClose }: { account: BankAccount; onClose: () => void }) {
  return (
    <Modal title={account.name} onClose={onClose} maxWidth="600px">
      <div className="sol-info-row"><span className="sol-info-label">Type</span><span className="sol-info-value">{account.type}</span></div>
      <div className="sol-info-row"><span className="sol-info-label">Solde</span><span className="sol-info-value" style={{ fontWeight: 700, color: 'var(--color-primary-600)' }}>{formatMoney(account.balance)}</span></div>
      {account.iban && <div className="sol-info-row"><span className="sol-info-label">IBAN</span><span className="sol-info-value" style={{ fontSize: '0.8rem' }}>{account.iban}</span></div>}
      {account.phone && <div className="sol-info-row"><span className="sol-info-label">Téléphone</span><span className="sol-info-value">{account.phone}</span></div>}
      {account.operations.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Opérations</div>
          {account.operations.map((op, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)', marginBottom: '0.25rem' }}>
              {op.type === 'credit' ? <ArrowDownCircle size={16} style={{ color: '#065f46' }} /> : <ArrowUpCircle size={16} style={{ color: '#991b1b' }} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem' }}>{op.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)' }}>{new Date(op.date).toLocaleDateString('fr-FR')}</div>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: op.type === 'credit' ? '#065f46' : '#991b1b' }}>{op.type === 'credit' ? '+' : '-'}{formatMoney(op.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}

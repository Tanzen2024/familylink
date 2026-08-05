import { useState } from 'react'
import { Save, Plus, Trash2, Banknote, Tag, Percent } from 'lucide-react'
import { useToast } from '../toast'
import { formatCurrencyFCFA } from '../ui'
import { mockSettings } from '../mockData'
import type { FinanceSettings } from '../types'

export default function Parametres() {
  const { notify } = useToast()
  const [settings, setSettings] = useState<FinanceSettings>(mockSettings)
  const [newCategory, setNewCategory] = useState('')
  const [newAccount, setNewAccount] = useState('')

  const handleSave = () => {
    notify('success', 'Paramètres enregistrés', 'Les paramètres financiers ont été mis à jour.')
  }

  const addCategory = () => {
    if (newCategory && !settings.categories.includes(newCategory)) {
      setSettings({ ...settings, categories: [...settings.categories, newCategory] })
      setNewCategory('')
    }
  }

  const removeCategory = (cat: string) => {
    setSettings({ ...settings, categories: settings.categories.filter((c) => c !== cat) })
  }

  const addAccount = () => {
    if (newAccount && !settings.accounts.includes(newAccount)) {
      setSettings({ ...settings, accounts: [...settings.accounts, newAccount] })
      setNewAccount('')
    }
  }

  const removeAccount = (acc: string) => {
    setSettings({ ...settings, accounts: settings.accounts.filter((a) => a !== acc) })
  }

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Paramètres financiers</h1>
          <p>Configuration de la gestion financière</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={18} style={{ marginRight: '0.25rem' }} /> Enregistrer
        </button>
      </div>

      <div className="grid-2">
        {/* Cotisation settings */}
        <div className="sol-chart">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Banknote size={18} style={{ color: 'var(--color-primary-600)' }} /> Cotisations
          </h3>
          <div className="form-group">
            <label className="form-label">Montant de la cotisation (FCFA)</label>
            <input type="number" className="form-input" value={settings.contributionAmount} onChange={(e) => setSettings({ ...settings, contributionAmount: Number(e.target.value) })} />
          </div>
          <div className="form-group">
            <label className="form-label">Période</label>
            <select className="form-select" value={settings.contributionPeriod} onChange={(e) => setSettings({ ...settings, contributionPeriod: e.target.value })}>
              <option value="Mensuelle">Mensuelle</option>
              <option value="Trimestrielle">Trimestrielle</option>
              <option value="Annuelle">Annuelle</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Percent size={14} /> Taux de pénalité (%)</label>
            <input type="number" className="form-input" value={settings.penaltyRate} onChange={(e) => setSettings({ ...settings, penaltyRate: Number(e.target.value) })} />
          </div>
          <div style={{ padding: '0.75rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--color-neutral-600)' }}>
            Cotisation actuelle: <strong>{formatCurrencyFCFA(settings.contributionAmount)}</strong> / an
            {settings.penaltyRate > 0 && <span> avec {settings.penaltyRate}% de pénalité en cas de retard</span>}
          </div>
        </div>

        {/* Currency */}
        <div className="sol-chart">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Banknote size={18} style={{ color: 'var(--color-primary-600)' }} /> Devise
          </h3>
          <div className="form-group">
            <label className="form-label">Devise principale</label>
            <select className="form-select" value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })}>
              <option value="FCFA">FCFA (Franc CFA)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="USD">USD (Dollar US)</option>
              <option value="CAD">CAD (Dollar Canadien)</option>
            </select>
          </div>
          <div style={{ padding: '0.75rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--color-neutral-600)' }}>
            Toutes les sommes affichées dans l'application utiliseront cette devise.
          </div>
        </div>

        {/* Categories */}
        <div className="sol-chart">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Tag size={18} style={{ color: 'var(--color-primary-600)' }} /> Catégories de dépenses
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input className="form-input" style={{ flex: 1 }} placeholder="Nouvelle catégorie…" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCategory() } }} />
            <button className="btn btn-primary" onClick={addCategory}><Plus size={18} /></button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {settings.categories.map((cat) => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.625rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', border: '1px solid var(--color-neutral-200)' }}>
                {cat}
                <button onClick={() => removeCategory(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-neutral-400)', display: 'flex' }}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Accounts */}
        <div className="sol-chart">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Banknote size={18} style={{ color: 'var(--color-primary-600)' }} /> Comptes configurés
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input className="form-input" style={{ flex: 1 }} placeholder="Nouveau compte…" value={newAccount} onChange={(e) => setNewAccount(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAccount() } }} />
            <button className="btn btn-primary" onClick={addAccount}><Plus size={18} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {settings.accounts.map((acc) => (
              <div key={acc} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-neutral-200)' }}>
                <span style={{ fontSize: '0.85rem' }}>{acc}</span>
                <button onClick={() => removeAccount(acc)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-neutral-400)', display: 'flex' }}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Landmark } from 'lucide-react'
import { FIN_SUB_PAGES } from './types'
import { ToastProvider } from './toast'
import Dashboard from './pages/Dashboard'
import Cotisations from './pages/Cotisations'
import Dons from './pages/Dons'
import Collectes from './pages/Collectes'
import Budgets from './pages/Budgets'
import Comptes from './pages/Comptes'
import Recettes from './pages/Recettes'
import Depenses from './pages/Depenses'
import Paiements from './pages/Paiements'
import Rapports from './pages/Rapports'
import Audit from './pages/Audit'
import Parametres from './pages/Parametres'

export default function Finances() {
  const [activePage, setActivePage] = useState('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard onNavigate={setActivePage} />
      case 'cotisations': return <Cotisations />
      case 'dons': return <Dons />
      case 'collectes': return <Collectes />
      case 'budgets': return <Budgets />
      case 'comptes': return <Comptes />
      case 'recettes': return <Recettes />
      case 'depenses': return <Depenses />
      case 'paiements': return <Paiements />
      case 'rapports': return <Rapports />
      case 'audit': return <Audit />
      case 'parametres': return <Parametres />
      default: return <Dashboard onNavigate={setActivePage} />
    }
  }

  return (
    <ToastProvider>
      <div className="sol-layout">
      <aside className="sol-sidebar">
        <div className="sol-sidebar-title">
          <Landmark size={22} />
          <span>Finances</span>
        </div>
        {FIN_SUB_PAGES.map((page) => {
          const Icon = page.icon
          return (
            <div
              key={page.id}
              className={`sol-nav-item ${activePage === page.id ? 'active' : ''}`}
              onClick={() => setActivePage(page.id)}
            >
              <Icon size={18} />
              <span>{page.label}</span>
            </div>
          )
        })}
      </aside>
      <div className="sol-content">
        {renderPage()}
      </div>
      </div>
    </ToastProvider>
  )
}

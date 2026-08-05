import { useState } from 'react'
import { HeartHandshake } from 'lucide-react'
import { SUB_PAGES } from './types'
import { ToastProvider } from './ToastContext'
import Dashboard from './pages/Dashboard'
import Demandes from './pages/Demandes'
import Deces from './pages/Deces'
import Maladies from './pages/Maladies'
import Mariages from './pages/Mariages'
import Etudiants from './pages/Etudiants'
import Emploi from './pages/Emploi'
import Juridique from './pages/Juridique'
import Administratif from './pages/Administratif'
import Collectes from './pages/Collectes'
import Benevoles from './pages/Benevoles'
import Historique from './pages/Historique'

export default function Solidarite() {
  const [activePage, setActivePage] = useState('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard onNavigate={setActivePage} />
      case 'demandes': return <Demandes />
      case 'deces': return <Deces />
      case 'maladies': return <Maladies />
      case 'mariages': return <Mariages />
      case 'etudiants': return <Etudiants />
      case 'emploi': return <Emploi />
      case 'juridique': return <Juridique />
      case 'administratif': return <Administratif />
      case 'collectes': return <Collectes />
      case 'benevoles': return <Benevoles />
      case 'historique': return <Historique />
      default: return <Dashboard onNavigate={setActivePage} />
    }
  }

  return (
    <ToastProvider>
      <div className="container">
        <div className="sol-layout">
          <aside className="sol-sidebar">
            <div className="sol-sidebar-title">
              <HeartHandshake size={22} />
              <span>Solidarité</span>
            </div>
            {SUB_PAGES.map((page) => {
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
      </div>
    </ToastProvider>
  )
}

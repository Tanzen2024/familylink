import { useState } from 'react'
import { FolderKanban } from 'lucide-react'
import { PROJETS_SUB_PAGES } from './types'
import { ToastProvider } from './toast'
import Dashboard from './pages/Dashboard'
import AllProjects from './pages/AllProjects'
import Idees from './pages/Idees'
import Planifies from './pages/Planifies'
import EnCours from './pages/EnCours'
import Termines from './pages/Termines'
import Categories from './pages/Categories'
import Calendrier from './pages/Calendrier'
import Patrimoine from './pages/Patrimoine'
import Rapports from './pages/Rapports'

export default function Projets() {
  const [activePage, setActivePage] = useState('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard onNavigate={setActivePage} />
      case 'all': return <AllProjects />
      case 'idees': return <Idees />
      case 'planifies': return <Planifies />
      case 'encours': return <EnCours />
      case 'termines': return <Termines />
      case 'categories': return <Categories />
      case 'calendrier': return <Calendrier />
      case 'patrimoine': return <Patrimoine />
      case 'rapports': return <Rapports />
      default: return <Dashboard onNavigate={setActivePage} />
    }
  }

  return (
    <ToastProvider>
      <div className="sol-layout">
        <aside className="sol-sidebar">
          <div className="sol-sidebar-title">
            <FolderKanban size={22} />
            <span>Projets</span>
          </div>
          {PROJETS_SUB_PAGES.map((page) => {
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

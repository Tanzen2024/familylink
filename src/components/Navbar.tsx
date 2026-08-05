import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.jpeg'

export default function Navbar() {
  const { session, isAdmin, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link ${isActive ? 'nav-link-active' : ''}`

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setMobileOpen(false)
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setMobileOpen(false)}>
          <img src={logo} alt="Logo Menthong Association Group" className="navbar-logo" />
          <span>MENTHONG ASSOCIATION GROUP</span>
        </Link>

        <button className="navbar-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" aria-expanded={mobileOpen}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`navbar-menu ${mobileOpen ? 'open' : ''}`}>
          <NavLink to="/" className={navLinkClass} end onClick={() => setMobileOpen(false)}>Accueil</NavLink>
          <NavLink to="/membres" className={navLinkClass} onClick={() => setMobileOpen(false)}>Membres</NavLink>
          <NavLink to="/evenements" className={navLinkClass} onClick={() => setMobileOpen(false)}>Événements</NavLink>
          <NavLink to="/actualites" className={navLinkClass} onClick={() => setMobileOpen(false)}>Actualités</NavLink>
          <NavLink to="/galerie" className={navLinkClass} onClick={() => setMobileOpen(false)}>Galerie</NavLink>
          <NavLink to="/solidarite" className={navLinkClass} onClick={() => setMobileOpen(false)}>Solidarité</NavLink>
          <NavLink to="/finances" className={navLinkClass} onClick={() => setMobileOpen(false)}>Finances</NavLink>
          <NavLink to="/projets" className={navLinkClass} onClick={() => setMobileOpen(false)}>Projets</NavLink>

          {session && isAdmin ? (
            <>
              <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                <LayoutDashboard size={15} />
                Tableau de bord
              </NavLink>
              <button className="btn btn-secondary navbar-btn" onClick={handleSignOut}>
                <LogOut size={15} />
                Déconnexion
              </button>
            </>
          ) : session ? (
            <button className="btn btn-secondary navbar-btn" onClick={handleSignOut}>
              <LogOut size={15} />
              Déconnexion
            </button>
          ) : (
            <Link to="/connexion" className="btn btn-primary navbar-btn" onClick={() => setMobileOpen(false)}>
              <ShieldCheck size={15} />
              Espace Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

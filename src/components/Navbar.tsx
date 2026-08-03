import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
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

        <button className="navbar-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
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
              <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileOpen(false)}>Tableau de bord</NavLink>
              <button className="btn btn-secondary navbar-btn" onClick={handleSignOut}>Déconnexion</button>
            </>
          ) : session ? (
            <button className="btn btn-secondary navbar-btn" onClick={handleSignOut}>Déconnexion</button>
          ) : (
            <Link to="/connexion" className="btn btn-primary navbar-btn" onClick={() => setMobileOpen(false)}>Espace Admin</Link>
          )}
        </nav>
      </div>
    </header>
  )
}

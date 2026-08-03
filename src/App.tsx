import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Members from './pages/Members'
import MemberDetail from './pages/MemberDetail'
import Events from './pages/Events'
import News from './pages/News'
import Gallery from './pages/Gallery'
import Solidarite from './solidarite/Solidarite'
import Finances from './finances/Finances'
import Projets from './projets/Projets'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/membres" element={<Members />} />
          <Route path="/membres/:id" element={<MemberDetail />} />
          <Route path="/evenements" element={<Events />} />
          <Route path="/actualites" element={<News />} />
          <Route path="/galerie" element={<Gallery />} />
          <Route path="/solidarite" element={<Solidarite />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/projets" element={<Projets />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container">
          <p>MENTHONG ASSOCIATION GROUP &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </>
  )
}

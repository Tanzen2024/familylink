import { CalendarClock } from 'lucide-react'
import ProjectStatusPage from './ProjectStatusPage'

export default function Planifies() {
  return <ProjectStatusPage status="Planifié" title="Projets planifiés" description="Projets validés en attente de démarrage" icon={CalendarClock} />
}

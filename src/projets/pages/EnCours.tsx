import { Hammer } from 'lucide-react'
import ProjectStatusPage from './ProjectStatusPage'

export default function EnCours() {
  return <ProjectStatusPage status="En cours" title="Projets en cours" description="Projets actuellement en phase de réalisation" icon={Hammer} />
}

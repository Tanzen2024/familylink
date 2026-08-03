import { CheckCircle2 } from 'lucide-react'
import ProjectStatusPage from './ProjectStatusPage'

export default function Termines() {
  return <ProjectStatusPage status="Terminé" title="Projets terminés" description="Projets achevés avec succès" icon={CheckCircle2} />
}

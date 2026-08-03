import {
  LayoutDashboard, FolderKanban, Lightbulb, CalendarClock, Hammer,
  CheckCircle2, Tags, Calendar, Building2, FileBarChart,
} from 'lucide-react'

export type IdeaStatus =
  | 'Nouvelle' | 'En discussion' | "À l'étude" | 'Soumise au vote'
  | 'Acceptée' | 'Refusée' | 'Transformée en projet'

export type VoteChoice = 'Favorable' | 'Défavorable' | 'Abstention'

export type ProjectStatus = 'Planifié' | 'En cours' | 'Terminé'

export type Priority = 'Faible' | 'Moyenne' | 'Élevée' | 'Critique'

export interface IdeaComment {
  id: string
  author: string
  date: string
  text: string
}

export interface IdeaHistory {
  id: string
  date: string
  event: string
  actor: string
}

export interface Idea {
  id: string
  title: string
  description: string
  objective: string
  category: string
  location: string
  benefits: string
  estimatedBudget: number | null
  photos: string[]
  documents: string[]
  author: string
  createdAt: string
  status: IdeaStatus
  comments: IdeaComment[]
  reactions: { type: string; count: number }[]
  supports: number
  views: number
  votes: { favorable: number; unfavorable: number; abstention: number }
  history: IdeaHistory[]
  priority: Priority
  transformedProjectId: string | null
}

export interface ProjectTask {
  id: string
  label: string
  done: boolean
}

export interface Project {
  id: string
  number: string
  title: string
  description: string
  category: string
  location: string
  budget: number
  spent: number
  startDate: string
  endDate: string
  status: ProjectStatus
  manager: string
  team: string[]
  progress: number
  tasks: ProjectTask[]
  photos: string[]
  documents: string[]
  sourceIdeaId: string | null
  heritage: boolean
}

export interface ProjectCategory {
  id: string
  name: string
  color: string
  description: string
  projectCount: number
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'milestone' | 'deadline' | 'meeting'
  projectId: string
  projectName: string
}

export interface HeritageItem {
  id: string
  name: string
  category: string
  location: string
  value: number
  completedDate: string
  photoUrl: string | null
  projectId: string
}

export interface ProjetsSubPage {
  id: string
  label: string
  icon: typeof LayoutDashboard
}

export const PROJETS_SUB_PAGES: ProjetsSubPage[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'all', label: 'Tous les projets', icon: FolderKanban },
  { id: 'idees', label: 'Idées de projets', icon: Lightbulb },
  { id: 'planifies', label: 'Projets planifiés', icon: CalendarClock },
  { id: 'encours', label: 'Projets en cours', icon: Hammer },
  { id: 'termines', label: 'Projets terminés', icon: CheckCircle2 },
  { id: 'categories', label: 'Catégories', icon: Tags },
  { id: 'calendrier', label: 'Calendrier', icon: Calendar },
  { id: 'patrimoine', label: 'Patrimoine créé', icon: Building2 },
  { id: 'rapports', label: 'Rapports', icon: FileBarChart },
]

export const IDEA_STATUS_BADGES: Record<IdeaStatus, { bg: string; color: string }> = {
  'Nouvelle': { bg: '#dbeafe', color: '#1e40af' },
  'En discussion': { bg: '#fef3c7', color: '#92400e' },
  "À l'étude": { bg: '#e0e7ff', color: '#3730a3' },
  'Soumise au vote': { bg: '#fce7f3', color: '#9d174d' },
  'Acceptée': { bg: '#d1fae5', color: '#065f46' },
  'Refusée': { bg: '#fee2e2', color: '#991b1b' },
  'Transformée en projet': { bg: '#f0fdf4', color: '#15803d' },
}

export const PROJECT_STATUS_BADGES: Record<ProjectStatus, { bg: string; color: string }> = {
  'Planifié': { bg: '#dbeafe', color: '#1e40af' },
  'En cours': { bg: '#fef3c7', color: '#92400e' },
  'Terminé': { bg: '#d1fae5', color: '#065f46' },
}

export const PRIORITY_BADGES: Record<Priority, { bg: string; color: string }> = {
  'Faible': { bg: '#f3f4f6', color: '#374151' },
  'Moyenne': { bg: '#fef3c7', color: '#92400e' },
  'Élevée': { bg: '#fed7aa', color: '#9a3412' },
  'Critique': { bg: '#fee2e2', color: '#991b1b' },
}

export const VOTE_COLORS: Record<VoteChoice, string> = {
  'Favorable': '#10b981',
  'Défavorable': '#ef4444',
  'Abstention': '#6b7280',
}

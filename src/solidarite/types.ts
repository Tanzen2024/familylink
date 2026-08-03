import {
  HeartHandshake, LayoutDashboard, HelpCircle, Heart, Cake, GraduationCap,
  Briefcase, Scale, FileText, PiggyBank, Users, History,
} from 'lucide-react'

export type RequestCategory =
  | 'Décès' | 'Maladie' | 'Mariage' | 'Études' | 'Emploi' | 'Juridique' | 'Administratif' | 'Autre'

export type RequestStatus = 'Nouvelle' | 'En cours' | 'Validée' | 'Refusée' | 'Terminée'

export type UrgencyLevel = 'Faible' | 'Moyenne' | 'Élevée' | 'Critique'

export interface HelpRequest {
  id: string
  number: string
  title: string
  description: string
  category: RequestCategory
  urgency: UrgencyLevel
  date: string
  author: string
  assignee: string | null
  status: RequestStatus
  attachments: string[]
  comments: { author: string; date: string; text: string }[]
  city?: string
  country?: string
}

export interface DeathRecord {
  id: string
  deceasedName: string
  relation: string
  date: string
  location: string
  program: { time: string; label: string; description: string }[]
  photoUrl: string | null
  documents: string[]
  condolences: { author: string; date: string; message: string }[]
  financialAid: { contributor: string; amount: number; date: string }[]
  notified: boolean
}

export interface IllnessRecord {
  id: string
  patientName: string
  requestDate: string
  supports: { type: string; label: string; enabled: boolean }[]
  status: RequestStatus
  mobilized: { name: string; role: string; date: string }[]
  history: { date: string; event: string }[]
}

export interface MarriageRecord {
  id: string
  spouse1: string
  spouse2: string
  date: string
  location: string
  published: boolean
  delegation: string[]
  contributions: { member: string; amount: number; date: string }[]
  aidVoted: boolean
  aidAmount: number
  photos: string[]
}

export interface StudentRequest {
  id: string
  studentName: string
  requestType: 'Bourse' | 'Mentor' | 'Stage' | 'Accompagnement'
  field: string
  date: string
  status: RequestStatus
}

export interface Mentor {
  id: string
  name: string
  expertise: string
  city: string
  available: boolean
}

export interface JobOffer {
  id: string
  type: 'Recherche' | 'Recrutement'
  title: string
  company: string
  location: string
  postedBy: string
  date: string
  recommendations: number
  contacts: number
}

export interface LegalCase {
  id: string
  requester: string
  need: 'Avocat' | 'Juriste' | 'Notaire'
  domain: string
  date: string
  status: RequestStatus
  matchedWith: string | null
}

export interface LegalProfessional {
  id: string
  name: string
  role: 'Avocat' | 'Juriste' | 'Notaire'
  specialty: string
  city: string
  phone: string
}

export interface AdminAssistance {
  id: string
  requester: string
  need: string
  city: string
  country: string
  date: string
  status: RequestStatus
}

export interface Collection {
  id: string
  title: string
  description: string
  targetAmount: number
  collectedAmount: number
  deadline: string
  contributors: { name: string; amount: number; date: string }[]
  category: RequestCategory
}

export interface Volunteer {
  id: string
  name: string
  domains: string[]
  city: string
  phone: string
  available: boolean
}

export interface HistoryEntry {
  id: string
  date: string
  type: 'Aide' | 'Collecte' | 'Événement' | 'Accompagnement'
  title: string
  description: string
  actor: string
}

export interface SolidariteSubPage {
  id: string
  label: string
  icon: typeof LayoutDashboard
}

export const SUB_PAGES: SolidariteSubPage[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'demandes', label: "Demandes d'aide", icon: HelpCircle },
  { id: 'deces', label: 'Décès', icon: Heart },
  { id: 'maladies', label: 'Maladies', icon: HeartHandshake },
  { id: 'mariages', label: 'Mariages', icon: Cake },
  { id: 'etudiants', label: 'Étudiants', icon: GraduationCap },
  { id: 'emploi', label: 'Emploi', icon: Briefcase },
  { id: 'juridique', label: 'Assistance juridique', icon: Scale },
  { id: 'administratif', label: 'Assistance administrative', icon: FileText },
  { id: 'collectes', label: 'Collectes', icon: PiggyBank },
  { id: 'benevoles', label: 'Bénévoles', icon: Users },
  { id: 'historique', label: 'Historique', icon: History },
]

export const CATEGORY_BADGES: Record<RequestCategory, { bg: string; color: string }> = {
  'Décès': { bg: '#1f2937', color: '#f3f4f6' },
  'Maladie': { bg: '#fee2e2', color: '#991b1b' },
  'Mariage': { bg: '#fce7f3', color: '#9d174d' },
  'Études': { bg: '#dbeafe', color: '#1e40af' },
  'Emploi': { bg: '#d1fae5', color: '#065f46' },
  'Juridique': { bg: '#fef3c7', color: '#92400e' },
  'Administratif': { bg: '#e0e7ff', color: '#3730a3' },
  'Autre': { bg: '#f3f4f6', color: '#374151' },
}

export const STATUS_BADGES: Record<RequestStatus, { bg: string; color: string }> = {
  'Nouvelle': { bg: '#dbeafe', color: '#1e40af' },
  'En cours': { bg: '#fef3c7', color: '#92400e' },
  'Validée': { bg: '#d1fae5', color: '#065f46' },
  'Refusée': { bg: '#fee2e2', color: '#991b1b' },
  'Terminée': { bg: '#f3f4f6', color: '#374151' },
}

export const URGENCY_BADGES: Record<UrgencyLevel, { bg: string; color: string }> = {
  'Faible': { bg: '#f3f4f6', color: '#374151' },
  'Moyenne': { bg: '#fef3c7', color: '#92400e' },
  'Élevée': { bg: '#fed7aa', color: '#9a3412' },
  'Critique': { bg: '#fee2e2', color: '#991b1b' },
}

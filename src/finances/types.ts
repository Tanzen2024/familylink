import {
  LayoutDashboard, Users, Gift, PiggyBank, Wallet, Landmark,
  TrendingUp, TrendingDown, CreditCard, FileBarChart, ShieldCheck, Settings,
} from 'lucide-react'

export type ContributionStatus = 'En attente' | 'Partiellement payé' | 'Payé' | 'En retard'
export type PaymentMethod = 'Mobile Money' | 'Orange Money' | 'MTN MoMo' | 'Banque' | 'Espèces' | 'Chèque'
export type PaymentStatus = 'En attente' | 'Effectué' | 'Rejeté'
export type IncomeOrigin = 'Cotisations' | 'Dons' | 'Collectes' | 'Subventions' | 'Revenus des projets' | 'Autres recettes'
export type ExpenseCategory = 'Solidarité' | 'Projet' | 'Fonctionnement' | 'Communication' | 'Formation' | 'Événements' | 'Administration'
export type AccountType = 'Banque' | 'Orange Money' | 'MTN MoMo' | 'Caisse'

export interface Contribution {
  id: string
  number: string
  member: string
  fiscalYear: string
  type: string
  expectedAmount: number
  paidAmount: number
  dueDate: string
  paymentDate: string | null
  status: ContributionStatus
  paymentMethod: PaymentMethod | null
}

export interface Donation {
  id: string
  donor: string
  amount: number
  date: string
  project: string
  allocation: string
  receiptNumber: string
}

export interface FinanceCollection {
  id: string
  name: string
  objective: string
  targetAmount: number
  collectedAmount: number
  startDate: string
  endDate: string
  manager: string
  description: string
  contributors: { name: string; amount: number; date: string }[]
  closed: boolean
}

export interface Budget {
  id: string
  name: string
  fiscalYear: string
  planned: number
  spent: number
  color: string
}

export interface BankAccount {
  id: string
  name: string
  type: AccountType
  balance: number
  iban: string | null
  phone: string | null
  operations: { label: string; amount: number; date: string; type: 'credit' | 'debit' }[]
}

export interface Income {
  id: string
  reference: string
  origin: IncomeOrigin
  description: string
  amount: number
  date: string
  account: string
}

export interface Expense {
  id: string
  reference: string
  category: ExpenseCategory
  project: string | null
  beneficiary: string
  amount: number
  date: string
  receipt: string | null
  validated: boolean
}

export interface Payment {
  id: string
  reference: string
  label: string
  amount: number
  date: string
  method: PaymentMethod
  status: PaymentStatus
  recipient: string
}

export interface AuditEntry {
  id: string
  actor: string
  action: string
  entity: string
  date: string
  amount: number | null
  oldValue: string
  newValue: string
}

export interface FinanceSettings {
  contributionAmount: number
  contributionPeriod: string
  penaltyRate: number
  currency: string
  categories: string[]
  accounts: string[]
}

export interface FinanceSubPage {
  id: string
  label: string
  icon: typeof LayoutDashboard
}

export const FIN_SUB_PAGES: FinanceSubPage[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'cotisations', label: 'Cotisations', icon: Users },
  { id: 'dons', label: 'Dons', icon: Gift },
  { id: 'collectes', label: 'Collectes', icon: PiggyBank },
  { id: 'budgets', label: 'Budgets', icon: Wallet },
  { id: 'comptes', label: 'Comptes', icon: Landmark },
  { id: 'recettes', label: 'Recettes', icon: TrendingUp },
  { id: 'depenses', label: 'Dépenses', icon: TrendingDown },
  { id: 'paiements', label: 'Paiements', icon: CreditCard },
  { id: 'rapports', label: 'Rapports', icon: FileBarChart },
  { id: 'audit', label: 'Audit', icon: ShieldCheck },
  { id: 'parametres', label: 'Paramètres financiers', icon: Settings },
]

export const CONTRIBUTION_STATUS_BADGES: Record<ContributionStatus, { bg: string; color: string }> = {
  'En attente': { bg: '#dbeafe', color: '#1e40af' },
  'Partiellement payé': { bg: '#fef3c7', color: '#92400e' },
  'Payé': { bg: '#d1fae5', color: '#065f46' },
  'En retard': { bg: '#fee2e2', color: '#991b1b' },
}

export const PAYMENT_STATUS_BADGES: Record<PaymentStatus, { bg: string; color: string }> = {
  'En attente': { bg: '#fef3c7', color: '#92400e' },
  'Effectué': { bg: '#d1fae5', color: '#065f46' },
  'Rejeté': { bg: '#fee2e2', color: '#991b1b' },
}

export const INCOME_ORIGIN_BADGES: Record<IncomeOrigin, { bg: string; color: string }> = {
  'Cotisations': { bg: '#dbeafe', color: '#1e40af' },
  'Dons': { bg: '#fce7f3', color: '#9d174d' },
  'Collectes': { bg: '#fef3c7', color: '#92400e' },
  'Subventions': { bg: '#d1fae5', color: '#065f46' },
  'Revenus des projets': { bg: '#e0e7ff', color: '#3730a3' },
  'Autres recettes': { bg: '#f3f4f6', color: '#374151' },
}

export const EXPENSE_CATEGORY_BADGES: Record<ExpenseCategory, { bg: string; color: string }> = {
  'Solidarité': { bg: '#fee2e2', color: '#991b1b' },
  'Projet': { bg: '#dbeafe', color: '#1e40af' },
  'Fonctionnement': { bg: '#f3f4f6', color: '#374151' },
  'Communication': { bg: '#fce7f3', color: '#9d174d' },
  'Formation': { bg: '#d1fae5', color: '#065f46' },
  'Événements': { bg: '#fef3c7', color: '#92400e' },
  'Administration': { bg: '#e0e7ff', color: '#3730a3' },
}

import type {
  Contribution, Donation, FinanceCollection, Budget, BankAccount,
  Income, Expense, Payment, AuditEntry, FinanceSettings,
} from './types'

export const mockContributions: Contribution[] = [
  { id: 'c1', number: 'COT-2025-001', member: 'Jean Menthong', fiscalYear: '2025', type: 'Ordinaire', expectedAmount: 50000, paidAmount: 50000, dueDate: '2025-03-31', paymentDate: '2025-02-15', status: 'Payé', paymentMethod: 'Orange Money' },
  { id: 'c2', number: 'COT-2025-002', member: 'Marie Kamga', fiscalYear: '2025', type: 'Ordinaire', expectedAmount: 50000, paidAmount: 30000, dueDate: '2025-03-31', paymentDate: '2025-02-20', status: 'Partiellement payé', paymentMethod: 'MTN MoMo' },
  { id: 'c3', number: 'COT-2025-003', member: 'Paul Tchoumi', fiscalYear: '2025', type: 'Ordinaire', expectedAmount: 50000, paidAmount: 50000, dueDate: '2025-03-31', paymentDate: '2025-01-10', status: 'Payé', paymentMethod: 'Banque' },
  { id: 'c4', number: 'COT-2025-004', member: 'Robert Kana', fiscalYear: '2025', type: 'Ordinaire', expectedAmount: 50000, paidAmount: 0, dueDate: '2025-03-31', paymentDate: null, status: 'En retard', paymentMethod: null },
  { id: 'c5', number: 'COT-2025-005', member: 'Catherine Mbiya', fiscalYear: '2025', type: 'Ordinaire', expectedAmount: 50000, paidAmount: 50000, dueDate: '2025-03-31', paymentDate: '2025-03-01', status: 'Payé', paymentMethod: 'Mobile Money' },
  { id: 'c6', number: 'COT-2025-006', member: 'Daniel Tchatchou', fiscalYear: '2025', type: 'Ordinaire', expectedAmount: 50000, paidAmount: 20000, dueDate: '2025-03-31', paymentDate: '2025-03-15', status: 'Partiellement payé', paymentMethod: 'Espèces' },
  { id: 'c7', number: 'COT-2025-007', member: 'Sandra Ngono', fiscalYear: '2025', type: 'Ordinaire', expectedAmount: 50000, paidAmount: 0, dueDate: '2025-12-31', paymentDate: null, status: 'En attente', paymentMethod: null },
  { id: 'c8', number: 'COT-2025-008', member: 'Eric Fotso', fiscalYear: '2025', type: 'Ordinaire', expectedAmount: 50000, paidAmount: 50000, dueDate: '2025-03-31', paymentDate: '2025-02-28', status: 'Payé', paymentMethod: 'Orange Money' },
  { id: 'c9', number: 'COT-2025-009', member: 'Brigitte Ngo', fiscalYear: '2025', type: 'Ordinaire', expectedAmount: 50000, paidAmount: 25000, dueDate: '2025-03-31', paymentDate: '2025-03-10', status: 'Partiellement payé', paymentMethod: 'Banque' },
  { id: 'c10', number: 'COT-2025-010', member: 'Marc Fotso', fiscalYear: '2025', type: 'Ordinaire', expectedAmount: 50000, paidAmount: 50000, dueDate: '2025-03-31', paymentDate: '2025-01-05', status: 'Payé', paymentMethod: 'Chèque' },
  { id: 'c11', number: 'COT-2025-011', member: 'Christine Bélanger', fiscalYear: '2025', type: 'Ordinaire', expectedAmount: 50000, paidAmount: 50000, dueDate: '2025-03-31', paymentDate: '2025-02-01', status: 'Payé', paymentMethod: 'Banque' },
  { id: 'c12', number: 'COT-2025-012', member: 'Yvan Kamga', fiscalYear: '2025', type: 'Ordinaire', expectedAmount: 50000, paidAmount: 0, dueDate: '2025-03-31', paymentDate: null, status: 'En retard', paymentMethod: null },
]

export const mockDonations: Donation[] = [
  { id: 'd1', donor: 'Famille Tchoumi', amount: 100000, date: '2025-07-15', project: 'Construction siège', allocation: 'Fonds de construction', receiptNumber: 'REC-2025-001' },
  { id: 'd2', donor: 'Anonyme', amount: 50000, date: '2025-07-20', project: 'Bourse étudiante', allocation: 'Bourse Eric Fotso', receiptNumber: 'REC-2025-002' },
  { id: 'd3', donor: 'Marc Fotso', amount: 75000, date: '2025-06-10', project: 'Fonds de solidarité', allocation: 'Aide aux familles', receiptNumber: 'REC-2025-003' },
  { id: 'd4', donor: 'Diaspora Canada', amount: 200000, date: '2025-05-22', project: 'Fonds de solidarité', allocation: 'Collecte funérailles', receiptNumber: 'REC-2025-004' },
  { id: 'd5', donor: 'Christine Bélanger', amount: 30000, date: '2025-04-18', project: 'Formation', allocation: 'Atelier de formation', receiptNumber: 'REC-2025-005' },
  { id: 'd6', donor: 'Anonyme', amount: 25000, date: '2025-03-05', project: 'Fonctionnement', allocation: 'Frais généraux', receiptNumber: 'REC-2025-006' },
]

export const mockFinCollections: FinanceCollection[] = [
  {
    id: 'fc1', name: 'Collecte funérailles - Famille Menthong', objective: 'Soutien funéraire',
    targetAmount: 500000, collectedAmount: 305000, startDate: '2025-07-28', endDate: '2025-08-15',
    manager: 'Paul Tchoumi', description: 'Soutien financier pour les funérailles de Papa Samuel Menthong.',
    contributors: [
      { name: 'Paul Tchoumi', amount: 50000, date: '2025-07-28' },
      { name: 'Diaspora Canada', amount: 200000, date: '2025-07-29' },
      { name: 'Marie Kamga', amount: 30000, date: '2025-07-30' },
      { name: 'Robert Kana', amount: 25000, date: '2025-07-30' },
    ],
    closed: false,
  },
  {
    id: 'fc2', name: 'Bourse Eric Fotso', objective: 'Soutien étudiant',
    targetAmount: 300000, collectedAmount: 180000, startDate: '2025-07-18', endDate: '2025-09-01',
    manager: 'Prof. Samuel Njoya', description: 'Aide financière pour terminer le cycle de licence en informatique.',
    contributors: [
      { name: 'Prof. Samuel Njoya', amount: 100000, date: '2025-07-20' },
      { name: 'Anonyme', amount: 50000, date: '2025-07-22' },
      { name: 'Jean Menthong', amount: 30000, date: '2025-07-25' },
    ],
    closed: false,
  },
  {
    id: 'fc3', name: 'Mariage Suzanne & Marc', objective: 'Soutien mariage',
    targetAmount: 200000, collectedAmount: 100000, startDate: '2025-07-10', endDate: '2025-09-10',
    manager: 'Robert Kana', description: 'Contributions pour l\'organisation du mariage.',
    contributors: [
      { name: 'Jean Menthong', amount: 50000, date: '2025-07-20' },
      { name: 'Paul Tchoumi', amount: 30000, date: '2025-07-22' },
      { name: 'Catherine Mbiya', amount: 20000, date: '2025-07-25' },
    ],
    closed: false,
  },
  {
    id: 'fc4', name: 'Construction siège social', objective: 'Infrastructure',
    targetAmount: 2000000, collectedAmount: 850000, startDate: '2025-01-15', endDate: '2025-12-31',
    manager: 'Jean Menthong', description: 'Collecte pour la construction du siège de l\'association.',
    contributors: [
      { name: 'Famille Tchoumi', amount: 100000, date: '2025-01-20' },
      { name: 'Diaspora Canada', amount: 200000, date: '2025-02-01' },
      { name: 'Marc Fotso', amount: 75000, date: '2025-03-10' },
      { name: 'Christine Bélanger', amount: 30000, date: '2025-04-18' },
      { name: 'Anonyme', amount: 25000, date: '2025-05-01' },
    ],
    closed: false,
  },
  {
    id: 'fc5', name: 'Frais hospitalisation Catherine', objective: 'Santé',
    targetAmount: 400000, collectedAmount: 400000, startDate: '2025-07-12', endDate: '2025-08-15',
    manager: 'Dr. Alain Tagne', description: 'Couverture des frais d\'hospitalisation suite à un accident.',
    contributors: [
      { name: 'Dr. Alain Tagne', amount: 100000, date: '2025-07-14' },
      { name: 'Paul Tchoumi', amount: 80000, date: '2025-07-15' },
      { name: 'Marie Kamga', amount: 50000, date: '2025-07-16' },
      { name: 'Robert Kana', amount: 90000, date: '2025-07-18' },
    ],
    closed: true,
  },
]

export const mockBudgets: Budget[] = [
  { id: 'b1', name: 'Fonctionnement', fiscalYear: '2025', planned: 500000, spent: 320000, color: '#3b82f6' },
  { id: 'b2', name: 'Solidarité', fiscalYear: '2025', planned: 1500000, spent: 1050000, color: '#ef4444' },
  { id: 'b3', name: 'Projets', fiscalYear: '2025', planned: 2000000, spent: 850000, color: '#10b981' },
  { id: 'b4', name: 'Formation', fiscalYear: '2025', planned: 300000, spent: 180000, color: '#f59e0b' },
  { id: 'b5', name: 'Communication', fiscalYear: '2025', planned: 200000, spent: 75000, color: '#ec4899' },
  { id: 'b6', name: 'Administration', fiscalYear: '2025', planned: 400000, spent: 250000, color: '#6366f1' },
]

export const mockAccounts: BankAccount[] = [
  {
    id: 'a1', name: 'Compte bancaire principal', type: 'Banque', balance: 2450000, iban: 'CM21 10001 00001234567890 12', phone: null,
    operations: [
      { label: 'Virement cotisation Jean Menthong', amount: 50000, date: '2025-02-15', type: 'credit' },
      { label: 'Virement cotisation Paul Tchoumi', amount: 50000, date: '2025-01-10', type: 'credit' },
      { label: 'Paiement facture siège social', amount: 320000, date: '2025-07-20', type: 'debit' },
      { label: 'Don Diaspora Canada', amount: 200000, date: '2025-05-22', type: 'credit' },
    ],
  },
  {
    id: 'a2', name: 'Orange Money', type: 'Orange Money', balance: 485000, iban: null, phone: '+237 690-xxx-xxx',
    operations: [
      { label: 'Cotisation Catherine Mbiya', amount: 50000, date: '2025-03-01', type: 'credit' },
      { label: 'Cotisation Eric Fotso', amount: 50000, date: '2025-02-28', type: 'credit' },
      { label: 'Aide sociale - Famille Menthong', amount: 105000, date: '2025-07-29', type: 'debit' },
    ],
  },
  {
    id: 'a3', name: 'MTN MoMo', type: 'MTN MoMo', balance: 180000, iban: null, phone: '+237 675-xxx-xxx',
    operations: [
      { label: 'Cotisation partielle Marie Kamga', amount: 30000, date: '2025-02-20', type: 'credit' },
      { label: 'Cotisation partielle Daniel Tchatchou', amount: 20000, date: '2025-03-15', type: 'credit' },
    ],
  },
  {
    id: 'a4', name: 'Caisse', type: 'Caisse', balance: 95000, iban: null, phone: null,
    operations: [
      { label: 'Cotisation espèces Marc Fotso', amount: 50000, date: '2025-01-05', type: 'credit' },
      { label: 'Achat fournitures bureau', amount: 45000, date: '2025-06-10', type: 'debit' },
    ],
  },
]

export const mockIncomes: Income[] = [
  { id: 'i1', reference: 'REC-2025-001', origin: 'Cotisations', description: 'Cotisation Jean Menthong 2025', amount: 50000, date: '2025-02-15', account: 'Compte bancaire principal' },
  { id: 'i2', reference: 'REC-2025-002', origin: 'Cotisations', description: 'Cotisation Paul Tchoumi 2025', amount: 50000, date: '2025-01-10', account: 'Compte bancaire principal' },
  { id: 'i3', reference: 'REC-2025-003', origin: 'Dons', description: 'Don Famille Tchoumi - Construction siège', amount: 100000, date: '2025-07-15', account: 'Compte bancaire principal' },
  { id: 'i4', reference: 'REC-2025-004', origin: 'Dons', description: 'Don Diaspora Canada', amount: 200000, date: '2025-05-22', account: 'Compte bancaire principal' },
  { id: 'i5', reference: 'REC-2025-005', origin: 'Collectes', description: 'Collecte funérailles - Paul Tchoumi', amount: 50000, date: '2025-07-28', account: 'Orange Money' },
  { id: 'i6', reference: 'REC-2025-006', origin: 'Collectes', description: 'Collecte funérailles - Diaspora Canada', amount: 200000, date: '2025-07-29', account: 'Compte bancaire principal' },
  { id: 'i7', reference: 'REC-2025-007', origin: 'Cotisations', description: 'Cotisation Catherine Mbiya 2025', amount: 50000, date: '2025-03-01', account: 'Orange Money' },
  { id: 'i8', reference: 'REC-2025-008', origin: 'Subventions', description: 'Subvention mairie de Douala', amount: 300000, date: '2025-04-12', account: 'Compte bancaire principal' },
  { id: 'i9', reference: 'REC-2025-009', origin: 'Revenus des projets', description: 'Vente produits agricoles', amount: 120000, date: '2025-06-05', account: 'Orange Money' },
  { id: 'i10', reference: 'REC-2025-010', origin: 'Dons', description: 'Don Marc Fotso - Fonds de solidarité', amount: 75000, date: '2025-06-10', account: 'Compte bancaire principal' },
  { id: 'i11', reference: 'REC-2025-011', origin: 'Autres recettes', description: 'Intérêts bancaires', amount: 15000, date: '2025-07-01', account: 'Compte bancaire principal' },
  { id: 'i12', reference: 'REC-2025-012', origin: 'Cotisations', description: 'Cotisation Eric Fotso 2025', amount: 50000, date: '2025-02-28', account: 'Orange Money' },
]

export const mockExpenses: Expense[] = [
  { id: 'e1', reference: 'DEP-2025-001', category: 'Solidarité', project: 'Funérailles Menthong', beneficiary: 'Famille Menthong', amount: 105000, date: '2025-07-29', receipt: 'facture_funerailles.pdf', validated: true },
  { id: 'e2', reference: 'DEP-2025-002', category: 'Fonctionnement', project: null, beneficiary: 'SDE Cameroun', amount: 45000, date: '2025-07-15', receipt: 'facture_electricite.pdf', validated: true },
  { id: 'e3', reference: 'DEP-2025-003', category: 'Solidarité', project: 'Hospitalisation Catherine', beneficiary: 'Hôpital central Yaoundé', amount: 320000, date: '2025-07-20', receipt: 'facture_hopital.pdf', validated: true },
  { id: 'e4', reference: 'DEP-2025-004', category: 'Projet', project: 'Construction siège', beneficiary: 'Entreprise BTP Cameroon', amount: 850000, date: '2025-06-30', receipt: 'devis_construction.pdf', validated: true },
  { id: 'e5', reference: 'DEP-2025-005', category: 'Formation', project: null, beneficiary: 'Institut de formation', amount: 180000, date: '2025-06-10', receipt: 'facture_formation.pdf', validated: true },
  { id: 'e6', reference: 'DEP-2025-006', category: 'Communication', project: null, beneficiary: 'Imprimerie Express', amount: 75000, date: '2025-05-20', receipt: 'facture_impression.pdf', validated: true },
  { id: 'e7', reference: 'DEP-2025-007', category: 'Événements', project: 'Fête annuelle', beneficiary: 'Traiteur Le Palais', amount: 250000, date: '2025-07-25', receipt: 'facture_traiteur.pdf', validated: false },
  { id: 'e8', reference: 'DEP-2025-008', category: 'Administration', project: null, beneficiary: 'Cabinet comptable', amount: 120000, date: '2025-07-01', receipt: 'honoraires_comptable.pdf', validated: true },
  { id: 'e9', reference: 'DEP-2025-009', category: 'Solidarité', project: 'Bourse Eric Fotso', beneficiary: 'Eric Fotso', amount: 100000, date: '2025-07-18', receipt: null, validated: true },
  { id: 'e10', reference: 'DEP-2025-010', category: 'Fonctionnement', project: null, beneficiary: 'Fournitures de bureau', amount: 35000, date: '2025-06-15', receipt: 'ticket_achat.pdf', validated: false },
]

export const mockPayments: Payment[] = [
  { id: 'p1', reference: 'PAY-2025-001', label: 'Cotisation Jean Menthong', amount: 50000, date: '2025-02-15', method: 'Orange Money', status: 'Effectué', recipient: 'Jean Menthong' },
  { id: 'p2', reference: 'PAY-2025-002', label: 'Aide sociale Famille Menthong', amount: 105000, date: '2025-07-29', method: 'Orange Money', status: 'Effectué', recipient: 'Famille Menthong' },
  { id: 'p3', reference: 'PAY-2025-003', label: 'Facture hôpital Catherine', amount: 320000, date: '2025-07-20', method: 'Banque', status: 'Effectué', recipient: 'Hôpital central' },
  { id: 'p4', reference: 'PAY-2025-004', label: 'Facture traiteur fête annuelle', amount: 250000, date: '2025-07-25', method: 'Banque', status: 'En attente', recipient: 'Traiteur Le Palais' },
  { id: 'p5', reference: 'PAY-2025-005', label: 'Achat fournitures bureau', amount: 35000, date: '2025-06-15', method: 'Espèces', status: 'Rejeté', recipient: 'Fournitures de bureau' },
  { id: 'p6', reference: 'PAY-2025-006', label: 'Honoraires cabinet comptable', amount: 120000, date: '2025-07-01', method: 'Banque', status: 'Effectué', recipient: 'Cabinet comptable' },
  { id: 'p7', reference: 'PAY-2025-007', label: 'Facture impression', amount: 75000, date: '2025-05-20', method: 'Banque', status: 'Effectué', recipient: 'Imprimerie Express' },
  { id: 'p8', reference: 'PAY-2025-008', label: 'Devis construction siège', amount: 850000, date: '2025-06-30', method: 'Banque', status: 'Effectué', recipient: 'Entreprise BTP' },
  { id: 'p9', reference: 'PAY-2025-009', label: 'Bourse Eric Fotso', amount: 100000, date: '2025-07-18', method: 'Orange Money', status: 'Effectué', recipient: 'Eric Fotso' },
  { id: 'p10', reference: 'PAY-2025-010', label: 'Facture formation', amount: 180000, date: '2025-06-10', method: 'Banque', status: 'En attente', recipient: 'Institut de formation' },
]

export const mockAuditEntries: AuditEntry[] = [
  { id: 'au1', actor: 'Paul Tchoumi (Trésorier)', action: 'Création dépense', entity: 'DEP-2025-003', date: '2025-07-20T14:30:00', amount: 320000, oldValue: '—', newValue: '320 000 FCFA' },
  { id: 'au2', actor: 'Jean Menthong (Président)', action: 'Validation dépense', entity: 'DEP-2025-001', date: '2025-07-29T10:15:00', amount: 105000, oldValue: 'Non validée', newValue: 'Validée' },
  { id: 'au3', actor: 'Paul Tchoumi (Trésorier)', action: 'Enregistrement cotisation', entity: 'COT-2025-001', date: '2025-02-15T09:00:00', amount: 50000, oldValue: '—', newValue: '50 000 FCFA (Payé)' },
  { id: 'au4', actor: 'Système', action: 'Création automatique - Solidarité', entity: 'DEP-2025-009', date: '2025-07-18T16:45:00', amount: 100000, oldValue: '—', newValue: '100 000 FCFA (Solidarité)' },
  { id: 'au5', actor: 'Paul Tchoumi (Trésorier)', action: 'Clôture collecte', entity: 'fc5', date: '2025-08-15T17:00:00', amount: 400000, oldValue: 'En cours', newValue: 'Clôturée' },
  { id: 'au6', actor: 'Jean Menthong (Président)', action: 'Modification budget', entity: 'Budget Solidarité', date: '2025-06-01T11:20:00', amount: null, oldValue: '1 200 000 FCFA', newValue: '1 500 000 FCFA' },
  { id: 'au7', actor: 'Paul Tchoumi (Trésorier)', action: 'Enregistrement don', entity: 'REC-2025-004', date: '2025-05-22T13:30:00', amount: 200000, oldValue: '—', newValue: '200 000 FCFA' },
  { id: 'au8', actor: 'Système', action: 'Rejet de paiement', entity: 'PAY-2025-005', date: '2025-06-15T15:00:00', amount: 35000, oldValue: 'En attente', newValue: 'Rejeté' },
]

export const mockSettings: FinanceSettings = {
  contributionAmount: 50000,
  contributionPeriod: 'Annuelle',
  penaltyRate: 5,
  currency: 'FCFA',
  categories: ['Solidarité', 'Projet', 'Fonctionnement', 'Communication', 'Formation', 'Événements', 'Administration'],
  accounts: ['Compte bancaire principal', 'Orange Money', 'MTN MoMo', 'Caisse'],
}

export const monthlyIncomeData = [
  { month: 'Jan', cotisations: 100000, dons: 0, collectes: 0, subventions: 0, autres: 0 },
  { month: 'Fév', cotisations: 150000, dons: 0, collectes: 0, subventions: 0, autres: 0 },
  { month: 'Mar', cotisations: 100000, dons: 0, collectes: 0, subventions: 0, autres: 0 },
  { month: 'Avr', cotisations: 50000, dons: 0, collectes: 0, subventions: 300000, autres: 0 },
  { month: 'Mai', cotisations: 0, dons: 200000, collectes: 0, subventions: 0, autres: 0 },
  { month: 'Jun', cotisations: 0, dons: 75000, collectes: 0, subventions: 0, autres: 120000 },
  { month: 'Juil', cotisations: 0, dons: 100000, collectes: 255000, subventions: 0, autres: 15000 },
]

export const monthlyExpenseData = [
  { month: 'Jan', total: 50000 },
  { month: 'Fév', total: 80000 },
  { month: 'Mar', total: 45000 },
  { month: 'Avr', total: 120000 },
  { month: 'Mai', total: 75000 },
  { month: 'Jun', total: 215000 },
  { month: 'Juil', total: 780000 },
]

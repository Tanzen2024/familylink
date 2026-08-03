import type {
  HelpRequest, DeathRecord, IllnessRecord, MarriageRecord, StudentRequest,
  Mentor, JobOffer, LegalCase, LegalProfessional, AdminAssistance, Collection,
  Volunteer, HistoryEntry,
} from './types'

export const mockRequests: HelpRequest[] = [
  {
    id: 'r1', number: 'DEM-2025-001', title: 'Soutien financier pour funérailles',
    description: 'Famille en difficulté suite au décès du patriarche. Besoin de soutien pour les frais funéraires.',
    category: 'Décès', urgency: 'Critique', date: '2025-07-28', author: 'Jean Menthong',
    assignee: 'Paul Tchoumi', status: 'En cours', attachments: ['acte_deces.pdf'],
    comments: [{ author: 'Paul Tchoumi', date: '2025-07-29', text: 'Je prends en charge cette demande.' }],
    city: 'Douala', country: 'Cameroun',
  },
  {
    id: 'r2', number: 'DEM-2025-002', title: 'Recherche d\'avocat pour litige foncier',
    description: 'Besoin d\'un avocat spécialisé en droit foncier pour un litige concernant un terrain familial.',
    category: 'Juridique', urgency: 'Élevée', date: '2025-07-25', author: 'Marie Kamga',
    assignee: null, status: 'Nouvelle', attachments: [],
    comments: [], city: 'Yaoundé', country: 'Cameroun',
  },
  {
    id: 'r3', number: 'DEM-2025-003', title: 'Aide pour inscription universitaire au Canada',
    description: 'Étudiante cherchant de l\'aide pour ses démarches d\'inscription à l\'Université de Montréal.',
    category: 'Administratif', urgency: 'Moyenne', date: '2025-07-20', author: 'Sandra Ngono',
    assignee: 'Christine Bélanger', status: 'Validée', attachments: ['lettre_admission.pdf'],
    comments: [{ author: 'Christine Bélanger', date: '2025-07-22', text: 'Je peux l\'accompagner, je vis à Montréal.' }],
    city: 'Montréal', country: 'Canada',
  },
  {
    id: 'r4', number: 'DEM-2025-004', title: 'Demande de bourse pour études en informatique',
    description: 'Étudiant en 3e année de licence informatique cherche un soutien financier pour terminer son cycle.',
    category: 'Études', urgency: 'Moyenne', date: '2025-07-18', author: 'Eric Fotso',
    assignee: 'Prof. Samuel Njoya', status: 'En cours', attachments: ['releve_notes.pdf'],
    comments: [], city: 'Bafoussam', country: 'Cameroun',
  },
  {
    id: 'r5', number: 'DEM-2025-005', title: 'Recherche emploi en comptabilité',
    description: 'Jeune diplômé en comptabilité recherche un poste dans une structure à Douala ou Yaoundé.',
    category: 'Emploi', urgency: 'Faible', date: '2025-07-15', author: 'Daniel Tchatchou',
    assignee: null, status: 'Nouvelle', attachments: ['CV.pdf'],
    comments: [], city: 'Douala', country: 'Cameroun',
  },
  {
    id: 'r6', number: 'DEM-2025-006', title: 'Soutien maladie - hospitalisation',
    description: 'Membre hospitalisé suite à un accident. Besoin de soutien financier et de dons de sang.',
    category: 'Maladie', urgency: 'Élevée', date: '2025-07-12', author: 'Catherine Mbiya',
    assignee: 'Dr. Alain Tagne', status: 'En cours', attachments: ['ordonnance.pdf'],
    comments: [{ author: 'Dr. Alain Tagne', date: '2025-07-13', text: 'Le patient est stable. Besoin de 3 donneurs de sang.' }],
    city: 'Yaoundé', country: 'Cameroun',
  },
  {
    id: 'r7', number: 'DEM-2025-007', title: 'Mariage de la fille de notre membre',
    description: 'Famille organisant le mariage de leur fille. Recherche délégation et contributions.',
    category: 'Mariage', urgency: 'Faible', date: '2025-07-10', author: 'Robert Kana',
    assignee: 'Comité social', status: 'Validée', attachments: [],
    comments: [], city: 'Bafoussam', country: 'Cameroun',
  },
  {
    id: 'r8', number: 'DEM-2025-008', title: 'Aide logement à Paris',
    description: 'Membre arrivant à Paris en septembre cherche un logement temporaire le temps de se stabiliser.',
    category: 'Administratif', urgency: 'Moyenne', date: '2025-07-08', author: 'Brigitte Ngo',
    assignee: null, status: 'Nouvelle', attachments: [],
    comments: [], city: 'Paris', country: 'France',
  },
  {
    id: 'r9', number: 'DEM-2025-009', title: 'Accompagnement psychologique',
    description: 'Membre traversant une période difficile cherche un accompagnement psychologique.',
    category: 'Maladie', urgency: 'Moyenne', date: '2025-07-05', author: 'Anonymous',
    assignee: null, status: 'Terminée', attachments: [],
    comments: [{ author: 'Dr. Léa Mballa', date: '2025-07-06', text: 'Accompagnement terminé avec succès.' }],
    city: 'Douala', country: 'Cameroun',
  },
  {
    id: 'r10', number: 'DEM-2025-010', title: 'Stage en marketing digital',
    description: 'Étudiant en marketing cherche un stage de fin d\'études dans une agence digitale.',
    category: 'Études', urgency: 'Faible', date: '2025-07-01', author: 'Yvan Kamga',
    assignee: null, status: 'Refusée', attachments: [],
    comments: [{ author: 'Comité', date: '2025-07-03', text: 'Aucun stage disponible pour le moment.' }],
    city: 'Yaoundé', country: 'Cameroun',
  },
]

export const mockDeaths: DeathRecord[] = [
  {
    id: 'd1', deceasedName: 'Papa Samuel Menthong', relation: 'Père du membre Jean Menthong',
    date: '2025-07-26', location: 'Douala, Cameroun',
    program: [
      { time: 'Jeudi 31/07', label: 'Veillée', description: 'Veillée mortuaire à la résidence familiale à partir de 20h' },
      { time: 'Vendredi 01/08', label: 'Levée du corps', description: 'Levée du corps à 8h à la morgue de Douala' },
      { time: 'Vendredi 01/08', label: 'Messe d\'enterrement', description: 'Messe à 10h en la paroisse Saint Bernard' },
      { time: 'Vendredi 01/08', label: 'Inhumation', description: 'Inhumation au cimetière de Bonabéri à 13h' },
    ],
    photoUrl: null, documents: ['acte_deces.pdf', 'programme_obsèques.pdf'],
    condolences: [
      { author: 'Famille Tchoumi', date: '2025-07-27', message: 'Toutes nos condoléances à la famille. Que son âme repose en paix.' },
      { author: 'Marie Kamga', date: '2025-07-28', message: 'Nous sommes de tout cœur avec vous dans cette épreuve.' },
    ],
    financialAid: [
      { contributor: 'Paul Tchoumi', amount: 50000, date: '2025-07-28' },
      { contributor: 'Marie Kamga', amount: 30000, date: '2025-07-28' },
      { contributor: 'Robert Kana', amount: 25000, date: '2025-07-29' },
    ],
    notified: true,
  },
]

export const mockIllnesses: IllnessRecord[] = [
  {
    id: 'i1', patientName: 'Catherine Mbiya', requestDate: '2025-07-12',
    supports: [
      { type: 'financial', label: 'Soutien financier', enabled: true },
      { type: 'visits', label: 'Visites', enabled: true },
      { type: 'blood', label: 'Dons de sang', enabled: true },
      { type: 'accompaniment', label: 'Accompagnement', enabled: false },
      { type: 'psychological', label: 'Aide psychologique', enabled: false },
    ],
    status: 'En cours',
    mobilized: [
      { name: 'Dr. Alain Tagne', role: 'Suivi médical', date: '2025-07-13' },
      { name: 'Paul Tchoumi', role: 'Don de sang', date: '2025-07-14' },
      { name: 'Marie Kamga', role: 'Visite', date: '2025-07-15' },
    ],
    history: [
      { date: '2025-07-12', event: 'Demande créée' },
      { date: '2025-07-13', event: 'Dr. Tagne a pris en charge le suivi médical' },
      { date: '2025-07-14', event: 'Paul Tchoumi a fait un don de sang' },
      { date: '2025-07-15', event: 'Marie Kamga a rendu visite à la patiente' },
    ],
  },
  {
    id: 'i2', patientName: 'Anonymous', requestDate: '2025-07-05',
    supports: [
      { type: 'financial', label: 'Soutien financier', enabled: false },
      { type: 'visits', label: 'Visites', enabled: false },
      { type: 'blood', label: 'Dons de sang', enabled: false },
      { type: 'accompaniment', label: 'Accompagnement', enabled: false },
      { type: 'psychological', label: 'Aide psychologique', enabled: true },
    ],
    status: 'Terminée',
    mobilized: [
      { name: 'Dr. Léa Mballa', role: 'Aide psychologique', date: '2025-07-06' },
    ],
    history: [
      { date: '2025-07-05', event: 'Demande créée' },
      { date: '2025-07-06', event: 'Dr. Mballa a commencé l\'accompagnement' },
      { date: '2025-07-20', event: 'Accompagnement terminé' },
    ],
  },
]

export const mockMarriages: MarriageRecord[] = [
  {
    id: 'm1', spouse1: 'Suzanne Kana', spouse2: 'Marc Fotso',
    date: '2025-09-15', location: 'Bafoussam, Cameroun',
    published: true,
    delegation: ['Robert Kana (père)', 'Marie Kamga (témoin)', 'Paul Tchoumi (délégué)'],
    contributions: [
      { member: 'Jean Menthong', amount: 50000, date: '2025-07-20' },
      { member: 'Paul Tchoumi', amount: 30000, date: '2025-07-22' },
      { member: 'Catherine Mbiya', amount: 20000, date: '2025-07-25' },
    ],
    aidVoted: true, aidAmount: 100000,
    photos: [],
  },
]

export const mockStudentRequests: StudentRequest[] = [
  { id: 's1', studentName: 'Eric Fotso', requestType: 'Bourse', field: 'Informatique', date: '2025-07-18', status: 'En cours' },
  { id: 's2', studentName: 'Sandra Ngono', requestType: 'Accompagnement', field: 'Administration', date: '2025-07-20', status: 'Validée' },
  { id: 's3', studentName: 'Yvan Kamga', requestType: 'Stage', field: 'Marketing digital', date: '2025-07-01', status: 'Refusée' },
  { id: 's4', studentName: 'Nadine Tchoumi', requestType: 'Mentor', field: 'Droit', date: '2025-07-10', status: 'En cours' },
]

export const mockMentors: Mentor[] = [
  { id: 'me1', name: 'Prof. Samuel Njoya', expertise: 'Informatique / IA', city: 'Bafoussam', available: true },
  { id: 'me2', name: 'Me. Christine Bélanger', expertise: 'Droit international', city: 'Montréal', available: true },
  { id: 'me3', name: 'Dr. Alain Tagne', expertise: 'Médecine', city: 'Yaoundé', available: false },
  { id: 'me4', name: 'Marc Fotso', expertise: 'Marketing digital', city: 'Douala', available: true },
  { id: 'me5', name: 'Brigitte Ngo', expertise: 'Ressources humaines', city: 'Paris', available: true },
]

export const mockJobOffers: JobOffer[] = [
  { id: 'j1', type: 'Recrutement', title: 'Comptable senior', company: 'Cabinet Tchoumi & Associés', location: 'Douala', postedBy: 'Paul Tchoumi', date: '2025-07-22', recommendations: 3, contacts: 2 },
  { id: 'j2', type: 'Recherche', title: 'Développeur web junior', company: '—', location: 'Yaoundé', postedBy: 'Daniel Tchatchou', date: '2025-07-15', recommendations: 5, contacts: 1 },
  { id: 'j3', type: 'Recrutement', title: 'Assistant juridique', company: 'Étude Bélanger', location: 'Montréal', postedBy: 'Christine Bélanger', date: '2025-07-10', recommendations: 2, contacts: 0 },
  { id: 'j4', type: 'Recherche', title: 'Stage en ressources humaines', company: '—', location: 'Paris', postedBy: 'Brigitte Ngo', date: '2025-07-08', recommendations: 1, contacts: 3 },
]

export const mockLegalCases: LegalCase[] = [
  { id: 'lc1', requester: 'Marie Kamga', need: 'Avocat', domain: 'Droit foncier', date: '2025-07-25', status: 'Nouvelle', matchedWith: null },
  { id: 'lc2', requester: 'Robert Kana', need: 'Notaire', domain: 'Succession', date: '2025-07-18', status: 'En cours', matchedWith: 'Me. Christine Bélanger' },
  { id: 'lc3', requester: 'Jean Menthong', need: 'Juriste', domain: 'Droit du travail', date: '2025-07-10', status: 'Validée', matchedWith: 'Me. Christine Bélanger' },
]

export const mockLegalPros: LegalProfessional[] = [
  { id: 'lp1', name: 'Me. Christine Bélanger', role: 'Avocat', specialty: 'Droit foncier, droit du travail', city: 'Montréal', phone: '+1 514-xxx-xxxx' },
  { id: 'lp2', name: 'Me. Paul Tchoumi', role: 'Notaire', specialty: 'Succession, droit immobilier', city: 'Douala', phone: '+237 6xx-xxx-xxx' },
  { id: 'lp3', name: 'Me. Nadine Tchoumi', role: 'Juriste', specialty: 'Droit du travail', city: 'Yaoundé', phone: '+237 6xx-xxx-xxx' },
]

export const mockAdminAssists: AdminAssistance[] = [
  { id: 'aa1', requester: 'Sandra Ngono', need: 'Arrivée au Canada', city: 'Montréal', country: 'Canada', date: '2025-07-20', status: 'Validée' },
  { id: 'aa2', requester: 'Brigitte Ngo', need: 'Logement', city: 'Paris', country: 'France', date: '2025-07-08', status: 'Nouvelle' },
  { id: 'aa3', requester: 'Eric Fotso', need: 'Inscription universitaire', city: 'Bafoussam', country: 'Cameroun', date: '2025-07-15', status: 'En cours' },
  { id: 'aa4', requester: 'Daniel Tchatchou', need: 'Recherche d\'école', city: 'Douala', country: 'Cameroun', date: '2025-07-12', status: 'Terminée' },
]

export const mockCollections: Collection[] = [
  {
    id: 'c1', title: 'Collecte funérailles - Famille Menthong',
    description: 'Soutien financier pour les funérailles de Papa Samuel Menthong.',
    targetAmount: 500000, collectedAmount: 105000, deadline: '2025-08-05',
    contributors: [
      { name: 'Paul Tchoumi', amount: 50000, date: '2025-07-28' },
      { name: 'Marie Kamga', amount: 30000, date: '2025-07-28' },
      { name: 'Robert Kana', amount: 25000, date: '2025-07-29' },
    ],
    category: 'Décès',
  },
  {
    id: 'c2', title: 'Bourse Eric Fotso',
    description: 'Aide financière pour terminer le cycle de licence en informatique.',
    targetAmount: 300000, collectedAmount: 180000, deadline: '2025-09-01',
    contributors: [
      { name: 'Prof. Samuel Njoya', amount: 100000, date: '2025-07-20' },
      { name: 'Jean Menthong', amount: 50000, date: '2025-07-22' },
      { name: 'Paul Tchoumi', amount: 30000, date: '2025-07-25' },
    ],
    category: 'Études',
  },
  {
    id: 'c3', title: 'Mariage Suzanne & Marc',
    description: 'Contributions pour l\'organisation du mariage.',
    targetAmount: 200000, collectedAmount: 100000, deadline: '2025-09-10',
    contributors: [
      { name: 'Jean Menthong', amount: 50000, date: '2025-07-20' },
      { name: 'Paul Tchoumi', amount: 30000, date: '2025-07-22' },
      { name: 'Catherine Mbiya', amount: 20000, date: '2025-07-25' },
    ],
    category: 'Mariage',
  },
  {
    id: 'c4', title: 'Frais hospitalisation Catherine',
    description: 'Couverture des frais d\'hospitalisation suite à un accident.',
    targetAmount: 400000, collectedAmount: 320000, deadline: '2025-08-15',
    contributors: [
      { name: 'Dr. Alain Tagne', amount: 100000, date: '2025-07-14' },
      { name: 'Paul Tchoumi', amount: 80000, date: '2025-07-15' },
      { name: 'Marie Kamga', amount: 50000, date: '2025-07-16' },
      { name: 'Robert Kana', amount: 90000, date: '2025-07-18' },
    ],
    category: 'Maladie',
  },
]

export const mockVolunteers: Volunteer[] = [
  { id: 'v1', name: 'Dr. Alain Tagne', domains: ['Santé'], city: 'Yaoundé', phone: '+237 6xx-xxx-xxx', available: true },
  { id: 'v2', name: 'Me. Christine Bélanger', domains: ['Juridique', 'Administration'], city: 'Montréal', phone: '+1 514-xxx-xxxx', available: true },
  { id: 'v3', name: 'Prof. Samuel Njoya', domains: ['Éducation'], city: 'Bafoussam', phone: '+237 6xx-xxx-xxx', available: true },
  { id: 'v4', name: 'Marc Fotso', domains: ['Emploi', 'Événementiel'], city: 'Douala', phone: '+237 6xx-xxx-xxx', available: true },
  { id: 'v5', name: 'Brigitte Ngo', domains: ['Logement', 'Administration'], city: 'Paris', phone: '+33 6xx-xx-xx-xx', available: true },
  { id: 'v6', name: 'Paul Tchoumi', domains: ['Transport', 'Événementiel'], city: 'Douala', phone: '+237 6xx-xxx-xxx', available: false },
  { id: 'v7', name: 'Dr. Léa Mballa', domains: ['Psychologie'], city: 'Douala', phone: '+237 6xx-xxx-xxx', available: true },
  { id: 'v8', name: 'Robert Kana', domains: ['Événementiel', 'Transport'], city: 'Bafoussam', phone: '+237 6xx-xxx-xxx', available: true },
]

export const mockHistory: HistoryEntry[] = [
  { id: 'h1', date: '2025-07-29', type: 'Collecte', title: 'Collecte funérailles - 105 000 FCFA collectés', description: '3 contributeurs ont participé à la collecte pour les funérailles de Papa Samuel Menthong.', actor: 'Système' },
  { id: 'h2', date: '2025-07-28', type: 'Aide', title: 'Aide financière validée - Décès', description: 'Une aide de 105 000 FCFA a été validée pour la famille Menthong.', actor: 'Paul Tchoumi' },
  { id: 'h3', date: '2025-07-25', type: 'Accompagnement', title: 'Mise en relation juridique', description: 'Me. Christine Bélanger a été mise en relation avec M. Robert Kana pour une succession.', actor: 'Système' },
  { id: 'h4', date: '2025-07-22', type: 'Événement', title: 'Mariage publié', description: 'Le mariage de Suzanne Kana et Marc Fotso a été publié à la communauté.', actor: 'Robert Kana' },
  { id: 'h5', date: '2025-07-20', type: 'Aide', title: 'Demande d\'aide administrative validée', description: 'Christine Bélanger accompagne Sandra Ngono pour son arrivée au Canada.', actor: 'Christine Bélanger' },
  { id: 'h6', date: '2025-07-15', type: 'Collecte', title: 'Bourse Eric Fotso - 180 000 FCFA collectés', description: '3 contributeurs ont participé à la bourse pour Eric Fotso.', actor: 'Système' },
  { id: 'h7', date: '2025-07-14', type: 'Accompagnement', title: 'Don de sang', description: 'Paul Tchoumi a fait un don de sang pour Catherine Mbiya hospitalisée.', actor: 'Paul Tchoumi' },
  { id: 'h8', date: '2025-07-10', type: 'Aide', title: 'Accompagnement psychologique terminé', description: 'Dr. Léa Mballa a terminé l\'accompagnement psychologique d\'un membre.', actor: 'Dr. Léa Mballa' },
]

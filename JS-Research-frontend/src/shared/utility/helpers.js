export const baseURL = process.env.NEXT_PUBLIC_API_URL

export const getRoleName = {
  organizationAdmin: 'Admin',
  organizationEmployee: 'Employee',
  companyAdmin: 'Admin',
  companyEmployee: 'Employee'
}

export const userRole = {
  User: 'User',
  Admin: 'Admin',
  superAdmin: 'superAdmin',
  organizationAdmin: 'organizationAdmin',
  organizationEmployee: 'organizationEmployee',
  companyAdmin: 'companyAdmin',
  companyEmployee: 'companyEmployee'
}

export const categories = {
  'Jain history': ['Pre Mahavir', 'Post Mahavir'],
  Atmavad: ['Shakties', 'Gunsthan'],
  Karmavad: [
    'Types of karma',
    'Nokarma',
    'Pathways of karma',
    'Biochemical',
    'Bioelectrical',
    'Neurological',
    'Nine padarth'
  ],
  Kriyavad: ['Penances', 'Aparigrah', 'Meditation', 'Diet', 'Leshya', 'Avashyak', 'Ahinsa'],
  Lokavad: ['Cosmology', 'Shape of loka', 'Trasnadi', 'Aloka', 'Shat dravya', 'Geography'],
  Anekantavad: ['Syadvad', 'Nayavad', 'Spatabhangi'],
  'Jain mathematics': ['Laukik ganit', 'Alaukik ganit'],
  'Jain theory of knowledge': ['Mati', 'Shrut', 'Avadhi', 'Manhaprayay', 'Kevalgyan'],
  'Jain theory of matter': ['Parmanu', 'Vargana'],
  'Jain theory of jiva': ['Yoni', 'Gati', 'Badar', 'Sukshma', 'Nigod'],
  'Jain Yoga and Meditation' : [],
  'Scientific interpretation of Jain theories': [],
  'Jain theory of bodies': ['Aharak', 'Tejas', 'Karman', 'Audarik'],
  'Jain life style': ['Environment', 'Mahavrat', 'Anuvrat', 'Code of conduct'],
  'Jain laws': ['Coexistence', 'Entanglement', 'Causality', 'Conservation', 'Samvay'],
  'Jainism and modern physics': [],
  'Jainism and modern biology': ['Rebirth'],
  'Merits of Jainism': [],
  'comparison with other faiths': [],
  'Epistemology and Ontology': ['Logic'],
  'Society and culture':[],
  General: ['Music', 'Poem', 'paintings']
}

export const languages = [
  'English',
  'Hindi',
  'Gujarati',
  'Marathi',
  'Bengali',
  'Punjabi',
  'Odia',
  'Assamese',
  'Tamil',
  'Telugu',
  'Kannada'
]

export const itemType = ['Book', 'Research Paper', 'Thesis', 'Article']

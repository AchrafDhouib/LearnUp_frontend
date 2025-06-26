export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  duration: string;
  students: number;
  lessons: number;
  image: string;
  content?: string;
  price?: number;
  level?: 'Débutant' | 'Intermédiaire' | 'Avancé';
  quizId?: string;
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  questions: {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  issueDate: Date;
  instructor: string;
}

export const courseCategories = [
  {
    id: "cat1",
    name: "Développement Web",
    description: "Maîtrisez les technologies web modernes",
    icon: "Code",
  },
  {
    id: "cat2",
    name: "Intelligence Artificielle",
    description: "Explorez le monde de l'IA et du machine learning",
    icon: "Brain",
  },
  {
    id: "cat3",
    name: "Design & UX",
    description: "Créez des interfaces utilisateur exceptionnelles",
    icon: "Palette",
  },
  {
    id: "cat4",
    name: "Marketing Digital",
    description: "Développez votre présence en ligne",
    icon: "Target",
  },
  {
    id: "cat5",
    name: "Gestion de Projet",
    description: "Gérez efficacement vos projets",
    icon: "Trello",
  },
];

export const courses: Course[] = [
  // Développement Web
  {
    id: "1",
    title: "React.js - Maîtrisez le Framework",
    description: "Apprenez à créer des applications web modernes avec React.js, le framework JavaScript le plus populaire. Ce cours couvre les hooks, le state management, et les bonnes pratiques.",
    instructor: "Marie Dupont",
    category: "Développement Web",
    duration: "20 heures",
    students: 1249,
    lessons: 25,
    price: 49.99,
    level: "Intermédiaire",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    quizId: "quiz1",
  },
  {
    id: "2",
    title: "Node.js et Express - Backend Avancé",
    description: "Développez des API REST robustes avec Node.js et Express. Apprenez la gestion des bases de données, l'authentification, et le déploiement.",
    instructor: "Thomas Martin",
    category: "Développement Web",
    duration: "18 heures",
    students: 892,
    lessons: 22,
    price: 59.99,
    level: "Avancé",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
    quizId: "quiz2",
  },
  {
    id: "3",
    title: "Angular - Le Guide Complet",
    description: "Devenez un expert Angular en maîtrisant les composants, les services, les modules et le routing. Créez des applications web complexes et performantes.",
    instructor: "Caroline Lefevre",
    category: "Développement Web",
    duration: "22 heures",
    students: 765,
    lessons: 28,
    price: 69.99,
    level: "Avancé",
    image: "https://endpoint.educrak.com/uploads/cours/photos/e9d0f14250cf3957c206dd7a7f23d8f6.webp",
    quizId: "quiz3",
  },
  {
    id: "4",
    title: "Vue.js - Créez des Interfaces Dynamiques",
    description: "Apprenez à utiliser Vue.js pour créer des interfaces utilisateur dynamiques et réactives. Ce cours couvre les directives, les composants et Vuex.",
    instructor: "Antoine Rousseau",
    category: "Développement Web",
    duration: "15 heures",
    students: 632,
    lessons: 20,
    price: 39.99,
    level: "Intermédiaire",
    image: "https://www.okoone.com/wp-content/uploads/2024/05/vue-js-logo-e1716176638531.png",
    quizId: "quiz4",
  },
  {
    id: "5",
    title: "Développement Web avec Django",
    description: "Découvrez le framework Django pour le développement web en Python. Apprenez à créer des applications web complètes avec des modèles, des vues et des formulaires.",
    instructor: "Sophie Dubois",
    category: "Développement Web",
    duration: "20 heures",
    students: 501,
    lessons: 24,
    price: 54.99,
    level: "Intermédiaire",
    image: "https://devforma.com/wp-content/uploads/2024/02/DJANGO-1024x674.png",
    quizId: "quiz5",
  },

  // Intelligence Artificielle
  {
    id: "6",
    title: "Introduction au Machine Learning",
    description: "Découvrez les fondamentaux du machine learning avec Python et scikit-learn. Comprenez les algorithmes essentiels et leur application.",
    instructor: "Sophie Bernard",
    category: "Intelligence Artificielle",
    duration: "25 heures",
    students: 1567,
    lessons: 30,
    price: 79.99,
    level: "Débutant",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800",
    quizId: "quiz6",
  },
  {
    id: "7",
    title: "Deep Learning avec TensorFlow",
    description: "Apprenez à construire des réseaux de neurones profonds avec TensorFlow. Ce cours couvre les CNN, RNN et les autoencodeurs.",
    instructor: "Luc Moreau",
    category: "Intelligence Artificielle",
    duration: "30 heures",
    students: 1342,
    lessons: 35,
    price: 89.99,
    level: "Avancé",
    image: "https://www.actuia.com/wp-content/uploads/2018/04/TF_JS_lockup_400.png",
    quizId: "quiz7",
  },
  {
    id: "8",
    title: "Traitement du Langage Naturel (NLP)",
    description: "Explorez les techniques de traitement du langage naturel avec Python et NLTK. Apprenez à analyser et comprendre le texte.",
    instructor: "Isabelle Gerard",
    category: "Intelligence Artificielle",
    duration: "22 heures",
    students: 1123,
    lessons: 28,
    price: 69.99,
    level: "Intermédiaire",
    image: "https://ledigitalizeur.fr/wp-content/uploads/2023/08/NLP-2.png",
    quizId: "quiz8",
  },
  {
    id: "9",
    title: "Vision par Ordinateur avec OpenCV",
    description: "Découvrez les techniques de vision par ordinateur avec OpenCV. Apprenez à détecter les objets, à suivre les mouvements et à analyser les images.",
    instructor: "Philippe Leclerc",
    category: "Intelligence Artificielle",
    duration: "28 heures",
    students: 987,
    lessons: 32,
    price: 74.99,
    level: "Intermédiaire",
    image: "https://cdn.prod.website-files.com/6391b5b30283a58cafb3bb77/66939465b5c2aab3503bd1a5_open-cv-innovatiana-p-500.jpeg",
    quizId: "quiz9",
  },
  {
    id: "10",
    title: "Intelligence Artificielle Éthique",
    description: "Comprenez les enjeux éthiques de l'IA et apprenez à développer des systèmes d'IA responsables et transparents.",
    instructor: "Nathalie Clement",
    category: "Intelligence Artificielle",
    duration: "18 heures",
    students: 854,
    lessons: 22,
    price: 59.99,
    level: "Avancé",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLiFBfMvbrD88Q1AogXEKdjTi6h-mjiRA3Zw&s",
    quizId: "quiz10",
  },

  // Design & UX
  {
    id: "11",
    title: "Design d'Interface Utilisateur",
    description: "Maîtrisez les principes du design UI/UX et créez des interfaces intuitives et esthétiques. Apprenez à utiliser Figma et les outils modernes.",
    instructor: "Julie Leroux",
    category: "Design & UX",
    duration: "15 heures",
    students: 986,
    lessons: 18,
    price: 49.99,
    level: "Débutant",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    quizId: "quiz11",
  },
  {
    id: "12",
    title: "Expérience Utilisateur (UX)",
    description: "Apprenez à concevoir des expériences utilisateur optimales en comprenant les besoins et les comportements des utilisateurs.",
    instructor: "David Meunier",
    category: "Design & UX",
    duration: "20 heures",
    students: 875,
    lessons: 24,
    price: 54.99,
    level: "Intermédiaire",
    image: "https://atelierssud.ch/wp-content/uploads/2015/01/ux-experience-utilisateur-marketing-design.png",
    quizId: "quiz12",
  },
  {
    id: "13",
    title: "Design Thinking - Innover avec l'UX",
    description: "Découvrez la méthode du Design Thinking pour résoudre des problèmes complexes et créer des produits innovants centrés sur l'utilisateur.",
    instructor: "Manon Chevalier",
    category: "Design & UX",
    duration: "18 heures",
    students: 764,
    lessons: 22,
    price: 59.99,
    level: "Intermédiaire",
    image: "https://bemobee.com/wp-content/uploads/2019/11/1_Z7hXZx49ERo8TFg6mZXrNw-1.jpg",
    quizId: "quiz13",
  },
  {
    id: "14",
    title: "Prototypage Rapide avec Adobe XD",
    description: "Maîtrisez Adobe XD pour créer des prototypes interactifs et tester rapidement vos idées de design.",
    instructor: "Julien Garnier",
    category: "Design & UX",
    duration: "16 heures",
    students: 653,
    lessons: 20,
    price: 44.99,
    level: "Débutant",
    image: "https://images.tuto.net/blog/xd-600x305.webp",
    quizId: "quiz14",
  },
  {
    id: "15",
    title: "Accessibilité Web (WCAG)",
    description: "Apprenez à rendre vos sites web accessibles à tous en respectant les normes WCAG. Améliorez l'inclusion et l'expérience utilisateur.",
    instructor: "Elodie Vincent",
    category: "Design & UX",
    duration: "14 heures",
    students: 542,
    lessons: 16,
    price: 34.99,
    level: "Débutant",
    image: "https://agencesat.com/wp-content/uploads/2024/03/12-SPX-Blog-Post-090523.jpg",
    quizId: "quiz15",
  },

  // Marketing Digital
  {
    id: "16",
    title: "SEO et Référencement Naturel",
    description: "Optimisez votre visibilité en ligne grâce aux techniques de SEO modernes. Apprenez à analyser et améliorer votre référencement.",
    instructor: "Marc Dubois",
    category: "Marketing Digital",
    duration: "12 heures",
    students: 754,
    lessons: 15,
    price: 39.99,
    level: "Intermédiaire",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800",
    quizId: "quiz16",
  },
  {
    id: "17",
    title: "Publicité en Ligne avec Google Ads",
    description: "Maîtrisez Google Ads pour créer des campagnes publicitaires efficaces et atteindre votre public cible. Apprenez à gérer votre budget et à optimiser vos annonces.",
    instructor: "Sandrine Leclerc",
    category: "Marketing Digital",
    duration: "18 heures",
    students: 643,
    lessons: 22,
    price: 49.99,
    level: "Intermédiaire",
    image: "https://www.danstapub.com/wp-content/uploads/2023/07/google-ads.jpeg",
    quizId: "quiz17",
  },
  {
    id: "18",
    title: "Marketing des Médias Sociaux (Social Media)",
    description: "Développez votre présence sur les médias sociaux et apprenez à engager votre communauté. Créez des stratégies de contenu efficaces et mesurez votre impact.",
    instructor: "Olivier Bernard",
    category: "Marketing Digital",
    duration: "15 heures",
    students: 532,
    lessons: 18,
    price: 44.99,
    level: "Débutant",
    image: "https://www.formationfacile.com/wp-content/uploads/2021/11/marketing-des-medias-sociaux-01-6.png",
    quizId: "quiz18",
  },
  {
    id: "19",
    title: "Email Marketing - Campagnes Efficaces",
    description: "Apprenez à créer des campagnes d'email marketing efficaces et à fidéliser vos clients. Maîtrisez les outils d'automatisation et de segmentation.",
    instructor: "Céline Roussel",
    category: "Marketing Digital",
    duration: "14 heures",
    students: 421,
    lessons: 16,
    price: 34.99,
    level: "Débutant",
    image: "https://dbcfrance.com/wp-content/uploads/2020/03/emailing.jpg",
    quizId: "quiz19",
  },
  {
    id: "20",
    title: "Analyse Web avec Google Analytics",
    description: "Maîtrisez Google Analytics pour analyser le trafic de votre site web et comprendre le comportement de vos utilisateurs. Prenez des décisions éclairées basées sur les données.",
    instructor: "Laurent Gerard",
    category: "Marketing Digital",
    duration: "16 heures",
    students: 310,
    lessons: 20,
    price: 39.99,
    level: "Intermédiaire",
    image: "https://cdn.blog.production.sortlist.cloud/wp-content/uploads/sites/3/2021/02/analyse-site-google-analytics.jpg",
    quizId: "quiz20",
  },

  // Gestion de Projet
  {
    id: "21",
    title: "Méthodologie Agile et Scrum",
    description: "Découvrez les principes de la gestion de projet agile et devenez un Scrum Master certifié. Apprenez à gérer efficacement vos équipes.",
    instructor: "Pierre Martin",
    category: "Gestion de Projet",
    duration: "16 heures",
    students: 632,
    lessons: 20,
    price: 69.99,
    level: "Intermédiaire",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
    quizId: "quiz21",
  },
  {
    id: "22",
    title: "Gestion de Projet avec PMP",
    description: "Préparez-vous à la certification PMP (Project Management Professional) et apprenez les meilleures pratiques de gestion de projet.",
    instructor: "Sophie Dubois",
    category: "Gestion de Projet",
    duration: "24 heures",
    students: 521,
    lessons: 28,
    price: 79.99,
    level: "Avancé",
    image: "https://www.qrpinternational.fr/wp-content/uploads/sites/6/2020/11/Les-avantages-de-la-certification-PMP.jpg",
    quizId: "quiz22",
  },
  {
    id: "23",
    title: "Lean Management - Optimisation",
    description: "Découvrez les principes du Lean Management pour optimiser les processus et réduire les gaspillages. Améliorez l'efficacité de votre organisation.",
    instructor: "Antoine Rousseau",
    category: "Gestion de Projet",
    duration: "14 heures",
    students: 410,
    lessons: 16,
    price: 44.99,
    level: "Intermédiaire",
    image: "https://www.wayden.fr/wp-content/uploads/2023/06/Quelles-sont-les-implications-du-lean-management--644x430.jpg",
    quizId: "quiz23",
  },
  {
    id: "24",
    title: "Gestion des Risques - Anticiper",
    description: "Apprenez à identifier, évaluer et gérer les risques liés à vos projets. Protégez vos objectifs et assurez le succès de vos initiatives.",
    instructor: "Caroline Lefevre",
    category: "Gestion de Projet",
    duration: "12 heures",
    students: 309,
    lessons: 14,
    price: 39.99,
    level: "Débutant",
    image: "https://www.rdcg.org/wp-content/uploads/2024/09/137539-1080x620.jpg",
    quizId: "quiz24",
  },
  {
    id: "25",
    title: "Leadership et Gestion d'Équipe",
    description: "Développez vos compétences en leadership et apprenez à motiver et à gérer efficacement vos équipes. Créez un environnement de travail positif et productif.",
    instructor: "Thomas Martin",
    category: "Gestion de Projet",
    duration: "18 heures",
    students: 208,
    lessons: 22,
    price: 49.99,
    level: "Intermédiaire",
    image: "https://cpi.ch/wp-content/uploads/2021/08/Gestion-dequipe-des-conflits-et-personnelle-ASFC-Leadership-1080x540.jpg",
    quizId: "quiz25",
  }
];

// Mock data for quizzes
export const quizzes: Quiz[] = [
  {
    id: "quiz1",
    title: "Quiz: Introduction au développement web",
    courseId: "1",
    questions: [
      {
        id: "q1-1",
        text: "Quelle balise HTML est utilisée pour définir un paragraphe?",
        options: ["<paragraph>", "<p>", "<para>", "<text>"],
        correctAnswer: 1
      },
      {
        id: "q1-2",
        text: "Comment définit-on un style CSS en ligne?",
        options: [
          "Avec l'attribut 'style'",
          "Avec une balise <css>",
          "Avec l'attribut 'class'",
          "Avec l'attribut 'format'"
        ],
        correctAnswer: 0
      },
      {
        id: "q1-3",
        text: "Quelle fonction JavaScript est utilisée pour sélectionner un élément HTML par son ID?",
        options: [
          "document.query()",
          "document.findElement()",
          "document.getElementById()",
          "document.selectElement()"
        ],
        correctAnswer: 2
      },
      {
        id: "q1-4",
        text: "Quelle propriété CSS permet de définir la couleur du texte?",
        options: ["text-color", "font-color", "color", "text-style"],
        correctAnswer: 2
      },
      {
        id: "q1-5",
        text: "Dans quel élément HTML place-t-on le JavaScript?",
        options: ["<js>", "<javascript>", "<script>", "<code>"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "quiz2",
    title: "Quiz: React.js pour les débutants",
    courseId: "2",
    questions: [
      {
        id: "q2-1",
        text: "Qu'est-ce que JSX dans React?",
        options: [
          "Une extension JavaScript qui permet d'écrire du HTML dans React",
          "Un nouveau langage de programmation",
          "Un outil de compilation JavaScript",
          "Une bibliothèque pour les animations"
        ],
        correctAnswer: 0
      },
      {
        id: "q2-2",
        text: "Comment créer un composant fonctionnel en React?",
        options: [
          "function MyComponent() { return <div>Hello</div>; }",
          "class MyComponent { render() { return <div>Hello</div>; } }",
          "const MyComponent = <div>Hello</div>;",
          "create.component(() => <div>Hello</div>);"
        ],
        correctAnswer: 0
      },
      {
        id: "q2-3",
        text: "Qu'est-ce que le 'state' dans React?",
        options: [
          "Un pays",
          "Un objet qui stocke des données pour un composant",
          "Une fonction pour mettre à jour le DOM",
          "Une bibliothèque externe à React"
        ],
        correctAnswer: 1
      }
    ]
  }
];

// Mock data for certificates
export const certificates: Certificate[] = [
  {
    id: "cert1",
    courseId: "1",
    courseTitle: "Introduction au développement web moderne",
    studentId: "student1",
    studentName: "Jean Dupont",
    issueDate: new Date("2023-04-15"),
    instructor: "Marie Dupont"
  },
  {
    id: "cert2",
    courseId: "3",
    courseTitle: "Bases de données avec MySQL",
    studentId: "student1",
    studentName: "Jean Dupont",
    issueDate: new Date("2023-05-20"),
    instructor: "Sophie Bernard"
  }
];

// Mock data for users (students and teachers)
export const users = {
  students: [
    {
      id: "student1",
      name: "Jean Dupont",
      email: "jean.dupont@example.com",
      enrolledCourses: ["1", "3", "4"],
      completedCourses: ["1", "3"],
      certificates: ["cert1", "cert2"]
    },
    {
      id: "student2",
      name: "Marie Martin",
      email: "marie.martin@example.com",
      enrolledCourses: ["2", "5"],
      completedCourses: [],
      certificates: []
    }
  ],
  teachers: [
    {
      id: "teacher1",
      name: "Marie Dupont",
      email: "marie.dupont@example.com",
      courses: ["1"]
    },
    {
      id: "teacher2",
      name: "Thomas Martin",
      email: "thomas.martin@example.com",
      courses: ["2"]
    },
    {
      id: "teacher3",
      name: "Sophie Bernard",
      email: "sophie.bernard@example.com",
      courses: ["3"]
    }
  ]
};

// Helper function to get a course by ID
export const getCourseById = (id: string): Course | undefined => {
  return courses.find(course => course.id === id);
};

// Helper function to get a quiz by ID
export const getQuizById = (id: string): Quiz | undefined => {
  return quizzes.find(quiz => quiz.id === id);
};

// Helper function to get a quiz by course ID
export const getQuizByCourseId = (courseId: string): Quiz | undefined => {
  return quizzes.find(quiz => quiz.courseId === courseId);
};

// Helper function to get certificates by student ID
export const getCertificatesByStudentId = (studentId: string): Certificate[] => {
  return certificates.filter(cert => cert.studentId === studentId);
};

// Helper function to get courses by teacher ID
export const getCoursesByTeacherId = (teacherId: string): Course[] => {
  const teacherCourseIds = users.teachers.find(t => t.id === teacherId)?.courses || [];
  return courses.filter(course => teacherCourseIds.includes(course.id));
};

// Helper function to get enrolled courses by student ID
export const getEnrolledCoursesByStudentId = (studentId: string): Course[] => {
  const enrolledCourseIds = users.students.find(s => s.id === studentId)?.enrolledCourses || [];
  return courses.filter(course => enrolledCourseIds.includes(course.id));
};

/**
 * Single source of truth for portfolio content.
 * Edit this file to update links, screenshots, certificates and personal details.
 * Anything left empty ('' or null) renders as a clearly marked placeholder or a disabled button.
 */

export const profile = {
  name: 'JEYA SURYA B.',
  fullName: 'Jeya Surya B.',
  title: ['Python Developer', 'AI-Assisted Developer', 'Java Developer'],
  intro:
    'Building intelligent applications and modern digital experiences through Python, AI, and web technologies.',
  email: 'jeyasuryab4@gmail.com',
  phoneDisplay: '+91 6379558565',
  whatsappNumber: '916379558565', // country code + number, digits only
  whatsappMessage:
    'Hello Jeya Surya, I came across your portfolio and would like to connect regarding an opportunity.',
};

export const social = {
  linkedin: 'https://linkedin.com/in/jeyasurya-js',
  github: 'https://github.com/JeyaSuryaBuilds',
  claimMyJob: 'https://www.claimmyjob.com/p/jeyasurya',
};

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'certifications', label: 'Certificates' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

export const about = {
  statement:
    'I am a Computer Science and Engineering graduate who builds web applications with Python, Flask and React, and connects them to AI APIs and databases. I am currently training in Java full stack development, and I am open to entry-level Java Developer, Python Developer and Junior Full Stack Developer roles.',
  facts: [
    { label: 'Degree', value: 'Bachelor of Engineering' },
    { label: 'Department', value: 'Computer Science and Engineering' },
    { label: 'College', value: 'Sardar Raja College of Engineering' },
    { label: 'University', value: 'Anna University' },
    { label: 'CGPA', value: '7.58 / 10' },
    { label: 'Graduation year', value: '2026' },
  ],
  interests: [
    'Python Development',
    'Artificial Intelligence',
    'Full Stack Development',
    'Java Development',
    'AI-Assisted Application Development',
  ],
};

/** tier: 'primary' = Python highlight, 'secondary' = Java, null = standard */
export const skills = [
  {
    id: 'python',
    title: 'Python Development',
    tier: 'primary',
    icon: 'terminal',
    items: ['Python', 'Flask', 'FastAPI', 'REST API Development', 'Pandas', 'Scikit-learn', 'NumPy'],
  },
  {
    id: 'java',
    title: 'Java Development',
    tier: 'secondary',
    icon: 'coffee',
    items: ['Core Java', 'Advanced Java', 'Object-Oriented Programming', 'Collections Framework', 'Exception Handling'],
  },
  {
    id: 'frontend',
    title: 'Frontend Development',
    tier: null,
    icon: 'layout',
    items: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Responsive Web Design'],
  },
  {
    id: 'database',
    title: 'Database',
    tier: null,
    icon: 'database',
    items: ['MySQL', 'MongoDB', 'SQLite', 'Firebase'],
  },
  {
    id: 'ai',
    title: 'AI & Machine Learning',
    tier: null,
    icon: 'brain',
    items: ['Generative AI', 'Google Gemini API', 'Machine Learning', 'TF-IDF', 'Logistic Regression', 'AI Chatbot Development'],
  },
  {
    id: 'ai-dev',
    title: 'AI-Assisted Development',
    tier: null,
    icon: 'sparkles',
    items: ['AI-Powered Application Development', 'Prompt Engineering', 'AI-Assisted Debugging', 'Vibe Coding', 'AI Code Generation'],
  },
  {
    id: 'tools',
    title: 'Tools',
    tier: null,
    icon: 'wrench',
    items: ['Visual Studio Code', 'Git', 'GitHub', 'Postman', 'Vercel', 'Netlify', 'Render'],
  },
  {
    id: 'workflow',
    title: 'Development Workflow',
    tier: null,
    icon: 'workflow',
    items: ['React Application Development', 'AI-Assisted Coding', 'Project Integration', 'API Integration'],
  },
];

/**
 * PROJECTS
 * image:    path under /public, e.g. '/assets/projects/syra-ai.webp'. null shows a placeholder.
 * liveUrl:  deployed URL. '' renders a disabled "Live Demo" button.
 * githubUrl: repository URL. '' renders a disabled "GitHub" button.
 * Only SYRA AI details come from the resume; fill in the others yourself.
 */
export const projects = [
  {
    id: 'syra-ai',
    name: 'SYRA AI',
    category: 'AI-Powered Virtual Assistant',
    description:
      'An AI-powered chatbot with a responsive web interface, a Python Flask backend that talks to AI APIs, user sign-in through Firebase Authentication and email through EmailJS.',
    highlights: [
      'Responsive chat interface built with HTML, CSS and JavaScript.',
      'Backend built with Python Flask, integrated with AI APIs for chatbot interactions.',
      'User authentication implemented with Firebase Authentication.',
      'Email functionality integrated with EmailJS.',
    ],
    tech: ['Python', 'Flask', 'HTML5', 'CSS3', 'JavaScript', 'Firebase Authentication', 'EmailJS'],
    image: '/assets/projects/syra-ai.png',
    liveUrl: 'https://syra-ai-seven.vercel.app/',
    githubUrl: 'https://github.com/JeyaSuryaBuilds/SYRA-AI',
  },
  {
  id: 'fleetpulse',
  name: 'FleetPulse – Smart Fleet & Logistics Management System',
  category: 'Full Stack SaaS Application',

  description: 'FleetPulse is a multi-tenant SaaS platform designed to simplify fleet and logistics operations. It aims to help transportation and logistics companies manage vehicles, drivers, shipments, deliveries, fuel expenses, maintenance, employees, and business operations through a centralized management system with AI-powered insights.',

  highlights: [
    'Developing a centralized fleet and logistics management platform for multiple companies with secure tenant-based data isolation.',
    'Designing vehicle, driver, shipment, delivery, route, fuel, and maintenance management modules.',
    'Building a role-based dashboard with operational analytics, reports, and business insights.',
    'Implementing secure authentication, JWT-based authorization, and company registration workflows.',
    'Integrating AI-powered capabilities for fleet analytics, route recommendations, fuel analysis, and delivery insights.',
    'Designing a scalable SaaS architecture with a centralized backend and MySQL database.'
  ],

  tech: [
    'Java',
    'Spring Boot',
    'Spring Security',
    'React',
    'JavaScript',
    'MySQL',
    'Hibernate',
    'Spring Data JPA',
    'Flyway',
    'REST API',
    'JWT',
    'Tailwind CSS',
    'NVIDIA AI'
  ],

  image: '/assets/projects/fleetpulse.png',
  liveUrl: 'https://fleetpulse-fayzo.netlify.app/',
  githubUrl: 'https://github.com/JeyaSuryaBuilds/FleetPulse',
  },
  {
    id: 'sethu-farm',
    name: 'Sethu Farm',
    category: 'Business Website',
    description: 'Sethu Farm is a web-based business project developed to establish an online presence for a farm-related business.',
    highlights: [
  'Developed a dedicated business website.',
  'Implemented frontend and backend components.',
  'Designed a responsive interface for users.'
  ],
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    image:'/assets/projects/sethu-farm.png',
    liveUrl: 'https://sethufarm.vercel.app',
    githubUrl: 'https://github.com/JeyaSuryaBuilds/SethuFarm',
  },
  {
    id: 'smart-expense-tracker',
    name: 'Smart Expense Tracker',
    category: 'Personal Finance Management',
    description: 'Smart Expense Tracker is a web application designed to help users record, manage and monitor their personal expenses through a digital interface.',
    highlights: [
  'Developed a web-based expense management application.',
  'Implemented backend API functionality.',
  'Used SQLite for database storage.',
  'Integrated frontend and backend services.',
  'Configured application deployment.'
  ],
    tech: ['React', 'JavaScript', 'SQLite', 'REST APIs', 'Vercel', 'Render'],
    image: '/assets/projects/smart-expense-tracker.png',
    liveUrl: 'https://smart-expense-tracker-sage-eight.vercel.app',
    githubUrl: 'https://github.com/JeyaSuryaBuilds/smart-expense-tracker',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce Website',
    category: 'Full Stack Application',
    description: 'E-Commerce Website is a web-based shopping application designed to provide users with an online platform for browsing products and exploring a digital shopping experience.',
    highlights: [
  'Developed a web-based shopping interface.',
  'Designed product browsing functionality.',
  'Structured the application for frontend and backend integration.'
  ],
    tech: ['Python', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    image: '/assets/projects/ecommerce.png',
    liveUrl: 'https://syra-fresh-dairy.vercel.app',
    githubUrl: 'https://github.com/JeyaSuryaBuilds/syra-fresh-dairy',
  },
];

export const experience = [
  {
    id: 'iconix',
    title: 'AI Powered Full Stack Development Internship',
    org: 'Iconix Software Solutions',
    period: 'July 2025',
    body: 'Gained hands-on experience in full-stack development, focused on AI-powered applications.',
  },
  {
    id: 'skybrisk',
    title: 'Web Development Internship',
    org: 'THE SKYBRISK',
    period: 'Feb 2026 - May 2026',
    body: 'Gained practical experience in web development in a professional internship environment.',
  },
  {
    id: 'anudip',
    title: 'Advanced Java Program with AI Trainee',
    org: 'Anudip Foundation',
    period: 'July 2026 - Oct 2026',
    body: 'Completed practical training in Advanced Java and AI, gaining hands-on experience in Java programming, object-oriented concepts, database connectivity, and AI fundamentals. Developed problem-solving skills through practical exercises and technical assignments.',
  },
];

/**
 * CERTIFICATES
 * file: path under /public (png, jpg, webp or pdf), e.g. '/assets/certificates/simplilearn.pdf'. null = not uploaded yet.
 * type: 'image' or 'pdf'
 */
export const certifications = [
  { id: 'anudip-java', name: 'Advanced Java Program with AI Training', issuer: 'Anudip Foundation', file: '/assets/certificates/anudip.jpg', type: 'image' },
  { id: 'simplilearn', name: 'Full Stack Development', issuer: 'Simplilearn', file: '/assets/certificates/simplilearn-full-stack-certificate.png', type: 'image' },
  { id: 'iconix-cert', name: 'AI Powered Full Stack Development Internship', issuer: 'Iconix Software Solutions', file: '/assets/certificates/iconix-full-stack-internship.jpg', type: 'image' },
  { id: 'skybrisk-cert', name: 'Web Development Internship', issuer: 'THE SKYBRISK', file: '/assets/certificates/skybrisk-web-development-internship.png', type: 'image' },
];

export const education = [
  {
    id: 'be',
    title: 'B.E. Computer Science and Engineering',
    org: 'Sardar Raja College of Engineering, Anna University',
    period: '2022 – 2026',
    body: 'Graduation year 2026.',
    meta: 'CGPA 7.58 / 10',
  },
  {
    id: 'anudip',
    title: 'Java Full Stack Development Training',
    org: 'Anudip Foundation',
    period: 'July 2026 – Present',
    body: 'Training in Java programming, JDBC, Hibernate, SQL and full-stack application development.',
    meta: '',
  },
];

export const resume = {
  file: '/assets/resume/Jeya Surya.pdf', // replace this PDF to update View and Download
  downloadName: 'Jeya Surya Resume.pdf',
};

export const socialLinks = () => [
  { id: 'email', label: 'Email', href: `mailto:${profile.email}`, external: false },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: `https://wa.me/${profile.whatsappNumber}?text=${encodeURIComponent(profile.whatsappMessage)}`,
    external: true,
  },
  { id: 'linkedin', label: 'LinkedIn', href: social.linkedin, external: true },
  { id: 'github', label: 'GitHub', href: social.github, external: true },
  { id: 'claimmyjob', label: 'ClaimMyJob', href: social.claimMyJob, external: true },
];

export const suggestedQuestions = [
  'Who is Jeya Surya?',
  'Tell me about his Python skills.',
  'What Java technologies does he know?',
  'Show me his projects.',
  'Tell me about his internships.',
  'What certifications has he completed?',
  'How can I contact him?',
  'Can I download his resume?',
];

export const welcomeMessage =
  "Hey there! I'm SURYA AI, your intelligent portfolio assistant. Ask me anything about Surya's skills, projects, education, certifications, or professional experience!";
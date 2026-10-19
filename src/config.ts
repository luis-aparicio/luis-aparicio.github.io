// All site content lives here. Add a project by appending to `projects`.
//
// Media: drop files in public/images/projects/<name>/ and public/videos/, then reference them
// WITHOUT the "public" prefix, e.g. "/images/projects/<name>/1.png" or "/videos/<name>.mp4".
// The first media item is the card cover (for a video, give it a `poster` image).
// Keep videos short and compressed (H.264 .mp4, ideally < 20 MB; GitHub rejects files > 100 MB).

export interface Media {
  src: string;
  type?: 'image' | 'video'; // defaults to 'image'
  poster?: string; // required for the cover if type is 'video'
  caption?: string;
  alt?: string;
}

export interface ProjectLink {
  label: string;
  url: string;
  kind?: 'github' | 'live' | 'video';
}

export interface Project {
  name: string;
  description: string;
  skills: string[];
  status?: string; // e.g. "In Progress"
  featured?: boolean; // sorts first
  order?: number; // lower first; default 100
  repo?: string; // set for projects synced from GitHub
  links?: ProjectLink[];
  media?: Media[];
}

export interface Bullet {
  label?: string;
  text: string;
}

export interface Experience {
  company: string;
  title: string;
  location?: string;
  summary?: string;
  dateRange: string;
  bullets: Bullet[];
}

export interface Education {
  school: string;
  degree: string;
  dateRange: string;
  details?: string;
}

export const config = {
  name: 'Luis Aparicio',
  title: 'Full Stack Software Engineer',
  description:
    'Portfolio of Luis Aparicio, a full stack software engineer specializing in functional programming and modern TypeScript.',
  accentColor: '#1d4ed8',
  site: 'https://luis-aparicio.github.io',
  social: {
    email: 'laparicio9831@gmail.com',
    linkedin: 'https://www.linkedin.com/in/luis-aparicio-611a9b1a6/',
    github: 'https://github.com/luis-aparicio',
  },
  aboutMe: [
    "Full Stack Software Engineer based in Gainesville, FL with 4+ years of professional experience building production web applications. I specialize in functional programming (Haskell, PureScript, Elm) and modern TypeScript stacks, and I'm passionate about championing developer tooling, AI-assisted workflows, and clean system design.",
    "Outside of work you'll find me at the bouldering gym or tinkering under the hood of my car.",
  ],
  location: 'Gainesville, FL',
  skills: [
    'Haskell', 'Elm', 'PureScript', 'TypeScript', 'JavaScript', 'Python', 'SQL', 'HTML / CSS',
    'Terraform', 'React', 'Node.js', 'Vue', 'AWS', 'Docker', 'Git', 'Claude AI', 'Cursor',
    'CI/CD Engineering', 'DevOps', 'AI Agent Orchestration', 'Spec-Driven Dev', 'Mentoring',
  ],
  projects: [
    {
      name: 'Crochet Pattern Designer & Generator',
      status: 'In Progress',
      description:
        'Full-stack TypeScript web app for designing and generating crochet patterns. Built with Claude Code as a primary development tool — designed, built, and deployed in under one week.',
      skills: ['TypeScript', 'Full Stack', 'Claude Code'],
      // media: [{ src: '/images/projects/crochet/1.png', caption: 'Pattern editor' }],
    },
    {
      name: 'SportsRadar Game Tracker',
      description:
        'PureScript front end application that tracks live sports games and triggers actions based on real-time game state via the SportsRadar API. Capable of sub-second state updates.',
      skills: ['PureScript', 'SportsRadar API', 'Real-time'],
      links: [{ label: 'Source', url: 'https://github.com/luis-aparicio', kind: 'github' }],
      media: [{ src: '/images/nbapic.jpg', alt: 'SportsRadar Game Tracker' }],
    },
    {
      name: 'Iftin Academy E-Learning',
      description:
        'Vue web application providing Python and JavaScript coding courses to students in Somalia and East Africa.',
      skills: ['Vue', 'Python', 'JavaScript'],
      links: [{ label: 'Source', url: 'https://github.com/CIS4914', kind: 'github' }],
      media: [{ src: '/images/iftin.png', alt: 'Iftin Academy' }],
    },
    {
      name: 'Just In Time Career Finder',
      description:
        'React web app with chatbot, login, and avatar editor helping middle/high school students discover careers aligned to their interests and earn rewards for exploration.',
      skills: ['React', 'Chatbot', 'Avatar Editor'],
      links: [{ label: 'Source', url: 'https://github.com/luis-aparicio/Career-Find', kind: 'github' }],
      media: [{ src: '/images/jit.jpg', alt: 'Just In Time Career Finder' }],
    },
    {
      name: 'Cardinal Signs Time Tracker',
      description:
        'Vue and Node.js web app for Cardinal Signs Inc. — employees sign in, log hours, and managers export reports. Deployed with Netlify, MongoDB, and Heroku.',
      skills: ['Vue', 'Node.js', 'MongoDB'],
      links: [{ label: 'Source', url: 'https://github.com/luis-aparicio/csTimeclockV2', kind: 'github' }],
      media: [{ src: '/images/cardproj.jpg', alt: 'Cardinal Signs Time Tracker' }],
    },
  ] as Project[],
  experience: [
    {
      company: 'Panoramic Software',
      title: 'Software Engineer — Front End Developer',
      location: 'Remote, Gainesville FL',
      dateRange: 'Jan 2024 – Present',
      summary: 'PureScript platform modernizing workflow management for government agency staff.',
      bullets: [
        { label: 'High-Volume Delivery', text: 'Delivered 194+ tickets; owned the deployment pipeline and release management, including after-hours support.' },
        { label: 'Feature Ownership', text: 'Led complex multi-developer epics (Role Permissions, Background Checks, Emails Module, S3 Sync); authored specs & estimates; maintained the Impact API Server and assisted in legacy data migration.' },
        { label: 'AI & Developer Tooling', text: 'Championed responsible AI integration (Claude, Cursor) to increase team velocity; introduced MR templates, CI pipeline improvements, dev containers, and Make targets to streamline developer workflow.' },
      ],
    },
    {
      company: 'ACI Learning',
      title: 'Software Engineer — Full Stack Developer',
      location: 'Remote, Gainesville FL',
      dateRange: 'Jun 2021 – Jan 2024',
      summary: 'Cybersecurity, audit, and IT training SaaS for enterprise leaders.',
      bullets: [
        { label: 'Full Stack Feature Delivery', text: 'Built on-demand video, assessments, and lab tools using Haskell, Elm, AWS, C#, and JavaScript; delivered SSO/LTI integration, transcript caching, user on-boarding, and Salesforce integration.' },
        { label: 'Cloud Migration & Mentoring', text: 'Self-taught AWS to migrate on-prem infrastructure to the cloud, reducing frequent outages to near-zero downtime; trained and mentored new hires on Haskell, Elm, and Terraform.' },
      ],
    },
  ] as Experience[],
  education: [
    {
      school: 'University of Florida',
      degree: 'Bachelor of Science in Computer Science',
      dateRange: '2021',
      details: 'Gainesville, FL · Coursework in Front End, Back End, Full Stack, UX Design, and Cybersecurity.',
    },
  ] as Education[],
};

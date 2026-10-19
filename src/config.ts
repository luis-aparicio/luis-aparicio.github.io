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
  title: 'Senior Full Stack Engineer',
  description:
    'Portfolio of Luis Aparicio, a senior full stack engineer specializing in functional programming and modern TypeScript.',
  accentColor: '#1d4ed8',
  site: 'https://luis-aparicio.github.io',
  social: {
    email: 'laparicio9831@gmail.com',
    linkedin: 'https://www.linkedin.com/in/luis-aparicio-611a9b1a6/',
    github: 'https://github.com/luis-aparicio',
  },
  aboutMe: [
    "Senior Full Stack Engineer based in Gainesville, FL with 5+ years of professional experience building production web applications. I specialize in functional programming (Haskell, PureScript, Elm) and modern TypeScript stacks, and I'm passionate about championing developer tooling, AI-assisted workflows, and clean system design.",
    "Outside of work you'll find me at the bouldering gym or tinkering under the hood of my car.",
  ],
  location: 'Gainesville, FL',
  skills: [
    'Haskell', 'Elm', 'PureScript', 'TypeScript', 'JavaScript', 'Python', 'SQL', 'HTML / CSS',
    'Terraform', 'React', 'Node.js', 'Vue', 'FastAPI', 'PostgreSQL', 'SQLite', 'Supabase', 'three.js', 'AWS', 'Docker', 'Git', 'Claude AI', 'Cursor',
    'CI/CD Engineering', 'DevOps', 'AI Agent Orchestration', 'Spec-Driven Dev', 'Mentoring',
  ],
  // Display order of the projects section, by repo name (synced projects) or project name
  // (hand-written ones). Listed projects come first in this order and override the `order` in a
  // repo's manifest; anything not listed follows, sorted by featured then `order`.
  projectOrder: ['pattern-maker', 'chore-tracker', 'NFL Gacha Minigame', 'recipe-timing-wedge'],
  projects: [
    {
      name: 'Crochet Pattern Designer & Generator',
      repo: 'pattern-maker', // fallback: replaced by the synced card once the repo syncs
      status: 'In Progress',
      description:
        'Full-stack TypeScript web app for designing and generating crochet patterns — designed, built, and deployed in under one week.',
      skills: ['TypeScript', 'Full Stack', 'Claude Code'],
      // media: [{ src: '/images/projects/crochet/1.png', caption: 'Pattern editor' }],
    },
    {
      name: 'NFL Gacha Minigame',
      featured: true,
      order: 4, // right after the synced projects (orders 1-3)
      description:
        'A fantasy-football card-collecting game that runs inside Discord. Players spend coins to open packs of NFL player cards across rarity tiers and seasonal editions, build a binder, and set a weekly lineup that scores from real NFL stats. An operator web portal tunes pack odds and checks the live card catalog.',
      skills: ['Python', 'discord.py', 'FastAPI', 'PostgreSQL', 'Peewee'],
      media: [
        { src: '/images/projects/nfl-gacha/cover.jpg', alt: 'NFL Gacha Minigame', caption: 'Opening packs, setting a lineup and browsing the binder in Discord' },
        { src: '/images/projects/nfl-gacha/pack-open.png', caption: 'Opening a pack: rarity, rank and last-game points, with a lineup upgrade suggestion' },
        { src: '/images/projects/nfl-gacha/roster.png', caption: 'Weekly lineup scored from final and projected points' },
        { src: '/images/projects/nfl-gacha/change-starter.png', caption: 'Swapping a starter from the cards you own' },
        { src: '/images/projects/nfl-gacha/spooky-pack.png', caption: 'A seasonal edition pack with themed art' },
        { src: '/images/projects/nfl-gacha/binder.png', caption: 'The binder: showcase, rarity counts and a sortable, paged collection' },
        { src: '/images/projects/nfl-gacha/pack-odds.webp', caption: 'Operator portal: exact pack odds and live rolls compared with the math' },
        { src: '/images/projects/nfl-gacha/catalog.webp', caption: 'Operator portal: card catalog by position and rarity, with drift from the targets' },
      ],
    },
  ] as Project[],
  experience: [
    {
      company: 'Panoramic Software',
      title: 'Senior Software Engineer — Full Stack',
      location: 'Remote, Gainesville FL',
      dateRange: 'Jan 2024 – Present',
      summary: 'PureScript platform modernizing workflow management for government agency staff.',
      bullets: [
        { label: 'Product & Technical Leadership', text: 'Shape features from requirements through delivery, partnering with stakeholders on product requirements, designing the UX, and architecting the system, then leading the build end to end.' },
        { label: 'High-Volume Delivery', text: 'Delivered 194+ tickets; owned the deployment pipeline and release management, including after-hours support.' },
        { label: 'Feature Ownership', text: 'Led complex, multi-developer epics (Role Permissions, Background Checks, Emails Module, S3 Sync); authored specs and estimates; maintained the Impact API Server and assisted in legacy data migration.' },
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

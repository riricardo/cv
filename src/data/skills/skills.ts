import type { Skill } from '../../types/resume.js'

export const skills = {
  react: { name: 'React', category: 'Frontend', level: 'Advanced' },
  reactPt: { name: 'React', category: 'Frontend', level: 'Avançado' },
  typescript: { name: 'TypeScript', category: 'Language', level: 'Advanced' },
  typescriptPt: { name: 'TypeScript', category: 'Linguagem', level: 'Avançado' },
  javascript: { name: 'JavaScript', category: 'Language', level: 'Advanced' },
  javascriptPt: { name: 'JavaScript', category: 'Linguagem', level: 'Avançado' },
  html: { name: 'HTML', category: 'Frontend', level: 'Advanced' },
  htmlPt: { name: 'HTML', category: 'Frontend', level: 'Avançado' },
  css: { name: 'CSS', category: 'Frontend', level: 'Advanced' },
  cssPt: { name: 'CSS', category: 'Frontend', level: 'Avançado' },
  tailwindCss: { name: 'Tailwind CSS', category: 'Styling', level: 'Advanced' },
  tailwindCssPt: {
    name: 'Tailwind CSS',
    category: 'Estilização',
    level: 'Avançado',
  },
  daisyui: { name: 'DaisyUI', category: 'Styling', level: 'Intermediate' },
  daisyuiPt: {
    name: 'DaisyUI',
    category: 'Estilização',
    level: 'Intermediário',
  },
  vite: { name: 'Vite', category: 'Tooling', level: 'Intermediate' },
  vitePt: { name: 'Vite', category: 'Ferramentas', level: 'Intermediário' },
  git: { name: 'Git', category: 'Tooling', level: 'Advanced' },
  gitPt: { name: 'Git', category: 'Ferramentas', level: 'Avançado' },
  githubActions: {
    name: 'GitHub Actions',
    category: 'DevOps',
    level: 'Intermediate',
  },
  githubActionsPt: {
    name: 'GitHub Actions',
    category: 'DevOps',
    level: 'Intermediário',
  },
  nodejs: { name: 'Node.js', category: 'Backend', level: 'Intermediate' },
  nodejsPt: { name: 'Node.js', category: 'Backend', level: 'Intermediário' },
  restApis: { name: 'REST APIs', category: 'Backend', level: 'Intermediate' },
  restApisPt: {
    name: 'REST APIs',
    category: 'Backend',
    level: 'Intermediário',
  },
} satisfies Record<string, Skill>

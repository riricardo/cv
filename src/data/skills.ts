import type { SkillAreas } from '../types/index.ts'

const backendSkills = {
  csharp: 'C#',
  aspNetCore: 'ASP.NET Core',
  restApis: 'REST APIs',
  nodejs: 'Node.js',
}

const frontendSkills = {
  react: 'React',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  html: 'HTML',
  css: 'CSS',
  tailwindCss: 'Tailwind CSS',
  daisyui: 'DaisyUI',
}

const databaseSkills = {
  sqlServer: 'SQL Server',
  postgresql: 'PostgreSQL',
  mongodb: 'MongoDB',
}

const architectureSkills = {
  dependencyInjection: 'Dependency Injection',
  cqrs: 'CQRS',
  mediatr: 'MediatR',
}

const toolSkills = {
  git: 'Git',
  githubActions: 'GitHub Actions',
  vite: 'Vite',
}

export const skills = {
  backend: Object.values(backendSkills),
  frontend: Object.values(frontendSkills),
  databases: Object.values(databaseSkills),
  architecture: Object.values(architectureSkills),
  tools: Object.values(toolSkills),
} satisfies SkillAreas

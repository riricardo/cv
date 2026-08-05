import type { Localized, Skill } from '../types/index.ts'

const skillDefinitions = {
  react: { name: 'React', level: 'Advanced' },
  typescript: { name: 'TypeScript', level: 'Advanced' },
  javascript: { name: 'JavaScript', level: 'Advanced' },
  html: { name: 'HTML', level: 'Advanced' },
  css: { name: 'CSS', level: 'Advanced' },
  tailwindCss: { name: 'Tailwind CSS', level: 'Advanced' },
  daisyui: { name: 'DaisyUI', level: 'Intermediate' },
  vite: { name: 'Vite', level: 'Intermediate' },
  git: { name: 'Git', level: 'Advanced' },
  githubActions: { name: 'GitHub Actions', level: 'Intermediate' },
  nodejs: { name: 'Node.js', level: 'Intermediate' },
  restApis: { name: 'REST APIs', level: 'Intermediate' },
} satisfies Record<string, Skill>

function translateSkillLevelToPt(level: string) {
  return level
    .replace('Advanced', 'Avançado')
    .replace('Intermediate', 'Intermediário')
    .replace('Beginner', 'Iniciante')
}

function translateSkillsToPt() {
  return Object.fromEntries(
    Object.entries(skillDefinitions).map(([skillId, skill]) => [
      skillId,
      {
        name: skill.name,
        level: skill.level ? translateSkillLevelToPt(skill.level) : undefined,
      },
    ]),
  )
}

export const skills = {
  en: skillDefinitions,
  pt: translateSkillsToPt(),
} satisfies Localized<Record<string, Skill>>

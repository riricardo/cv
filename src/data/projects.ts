import type { Localized, Project } from '../types/index.ts'

export const projects = {
  en: {
    interactiveCv: {
      name: 'Interactive CV',
      description:
        'A reusable online resume platform designed to support multiple resume versions.',
      technologies: ['React', 'TypeScript', 'Vite', 'DaisyUI'],
      repositoryUrl: 'https://github.com/riricardo/cv',
      demoUrl: 'https://riricardo.github.io/cv/',
    },
  },
  pt: {
    interactiveCv: {
      name: 'CV Interativo',
      description:
        'Uma plataforma reutilizável de currículo online pensada para suportar múltiplas versões de currículo.',
      technologies: ['React', 'TypeScript', 'Vite', 'DaisyUI'],
      repositoryUrl: 'https://github.com/riricardo/cv',
      demoUrl: 'https://riricardo.github.io/cv/',
    },
  },
} satisfies Localized<Record<string, Project>>

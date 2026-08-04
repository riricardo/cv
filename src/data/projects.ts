import type { Project } from '../types/resume.js'

export const projects = {
  interactiveCv: {
    name: 'Interactive CV',
    description: 'A reusable online resume platform designed to support multiple resume versions.',
    technologies: ['React', 'TypeScript', 'Vite', 'DaisyUI'],
    repositoryUrl: 'https://github.com/riricardo/cv',
    demoUrl: 'https://riricardo.github.io/cv/',
  },
  interactiveCvPt: {
    name: 'CV Interativo',
    description:
      'Uma plataforma reutilizável de currículo online pensada para suportar múltiplas versões de currículo.',
    technologies: ['React', 'TypeScript', 'Vite', 'DaisyUI'],
    repositoryUrl: 'https://github.com/riricardo/cv',
    demoUrl: 'https://riricardo.github.io/cv/',
  },
} satisfies Record<string, Project>

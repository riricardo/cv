import type { Resume } from '../../types/resume.js'
import { education } from '../education/education.js'
import { experience } from '../experience/experience.js'
import { projects } from '../projects/projects.js'
import { skills } from '../skills/skills.js'

export const softwareEnResume: Resume = {
  id: 'software-en',
  language: 'en',
  targetRole: 'Software Engineer',
  professionalSummary:
    'Software engineer focused on building reliable, maintainable and user-friendly web applications with React, TypeScript and modern frontend tooling.',
  experience: [experience.exampleCompany],
  projects: [projects.interactiveCv],
  skills: [
    skills.react,
    skills.typescript,
    skills.javascript,
    skills.html,
    skills.css,
    skills.tailwindCss,
    skills.daisyui,
    skills.vite,
    skills.git,
    skills.githubActions,
    skills.nodejs,
    skills.restApis,
  ],
  education: [education.softwareDevelopment],
  whyText: [
    'I enjoy turning practical product needs into clear, maintainable interfaces.',
    'I value thoughtful collaboration, incremental delivery and code that is easy to evolve.',
  ],
  settings: {
    showProjects: true,
    showPortfolio: true,
    showInteractiveBar: true,
  },
}

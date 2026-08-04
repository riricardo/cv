import type { Resume } from '../../types/resume.js'
import { education } from '../education.js'
import { experience } from '../experience.js'
import { projects } from '../projects.js'
import { skills } from '../skills.js'

export const softwarePtResume: Resume = {
  id: 'software-pt',
  language: 'pt',
  targetRole: 'Engenheiro de Software',
  professionalSummary:
    'Engenheiro de software focado em criar aplicações web confiáveis, manuteníveis e fáceis de usar com React, TypeScript e ferramentas modernas de frontend.',
  experience: [experience.exampleCompanyPt],
  projects: [projects.interactiveCvPt],
  skills: [
    skills.reactPt,
    skills.typescriptPt,
    skills.javascriptPt,
    skills.htmlPt,
    skills.cssPt,
    skills.tailwindCssPt,
    skills.daisyuiPt,
    skills.vitePt,
    skills.gitPt,
    skills.githubActionsPt,
    skills.nodejsPt,
    skills.restApisPt,
  ],
  education: [education.softwareDevelopmentPt],
  whyText: [
    'Gosto de transformar necessidades práticas de produto em interfaces claras e manuteníveis.',
    'Valorizo colaboração cuidadosa, entregas incrementais e código fácil de evoluir.',
  ],
  settings: {
    showProjects: true,
    showPortfolio: true,
    showInteractiveBar: true,
  },
}

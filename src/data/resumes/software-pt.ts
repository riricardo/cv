import type { Resume } from '../../types/index.ts'
import { education } from '../education.ts'
import { experience } from '../experience.ts'
import { projects } from '../projects.ts'
import { skills } from '../skills.ts'

export const softwarePtResume: Resume = {
  id: 'software-pt',
  language: 'pt',
  targetRole: 'Engenheiro de Software',
  professionalSummary:
    'Engenheiro de software focado em criar aplicações web confiáveis, manuteníveis e fáceis de usar com React, TypeScript e ferramentas modernas de frontend.',
  experience: [experience.pt.exampleCompany],
  projects: [projects.pt.interactiveCv],
  skills,
  education: [education.pt.softwareDevelopment],
  whyText: [
    'Gosto de transformar necessidades práticas de produto em interfaces claras e manuteníveis.',
    'Valorizo colaboração cuidadosa, entregas incrementais e código fácil de evoluir.',
  ],
}

import type { Resume } from '../../types/index.ts'
import { education } from '../education.ts'
import { experience } from '../experience.ts'
import { projects } from '../projects.ts'
import { skills } from '../skills.ts'

export const softwareEnResume: Resume = {
  id: 'software-en',
  language: 'en',
  targetRole: 'Software Engineer',
  professionalSummary:
    'Software engineer focused on building reliable, maintainable and user-friendly web applications with React, TypeScript and modern frontend tooling.',
  experience: [experience.en.exampleCompany],
  projects: [projects.en.interactiveCv],
  skills,
  education: [education.en.softwareDevelopment],
  whyText: [
    'I enjoy turning practical product needs into clear, maintainable interfaces.',
    'I value thoughtful collaboration, incremental delivery and code that is easy to evolve.',
  ],
}

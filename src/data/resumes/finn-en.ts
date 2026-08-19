import type { Resume } from '../../types/index.ts'
import { education } from '../education.ts'
import { experience } from '../experience.ts'
import { erpBackendEnProfile } from '../profiles/erp-backend-en.ts'
import { projects } from '../projects.ts'
import { skills } from '../skills.ts'
import { getExperience } from './utils.ts'

export const finnEnResume: Resume = {
  id: 'finn',
  language: 'en',

  professionalSummary:
    'Software Developer interested in applying my enterprise-software and ERP background to the modern SAP ecosystem. I like understanding processes across all layers and using that context to improve quality, cost efficiency, security and maintainability. EU citizen authorised to work across the European Union without sponsorship.',

  experience: [
    getExperience(experience.en, 'bidvestNoonan'),
    getExperience(experience.en, 'linx', erpBackendEnProfile.linx),
    getExperience(experience.en, 'syshouse', erpBackendEnProfile.syshouse),
    getExperience(experience.en, 'japi'),
    getExperience(experience.en, 'numericalAnalysisTutor'),
  ],

  projects: [projects.en.cvWebsite, projects.en.warthogRobotics],

  skills,

  education: [education.en.usp, education.en.linkoping, education.en.senac],

  whyText: [
    'Thanks for your interest. I see a strong fit with FINN because my background is in enterprise and ERP-related software, where understanding business rules, data flow and existing systems is essential.',
    'I bring nearly five years of experience with C#, .NET, Delphi, SQL Server, APIs and integrations, including work connecting modern services with legacy applications and debugging issues across multiple layers.',
    'I am especially interested in growing into the modern SAP ecosystem at FINN, while bringing a practical software-development mindset: ask good questions, understand the process, take ownership and deliver maintainable solutions.',
  ],
}

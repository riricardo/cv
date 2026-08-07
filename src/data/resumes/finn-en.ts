import type { Resume } from '../../types/index.ts'
import { education } from '../education.ts'
import { experience } from '../experience.ts'
import { projects } from '../projects.ts'
import { skills } from '../skills.ts'

export const finnEnResume: Resume = {
  id: 'finn',
  language: 'en',

  targetRole: 'Associate SAP Software Engineer',

  professionalSummary:
    'Software Engineer interested in applying my enterprise-software and ERP background to the modern SAP ecosystem. I enjoy understanding how business processes, data and application layers fit together, then turning that understanding into maintainable improvements for real users and teams. EU citizen authorised to work across the European Union without sponsorship.',

  experience: [
    experience.en.bidvestNoonan,
    experience.en.linx,
    experience.en.syshouse,
    experience.en.japi,
    experience.en.numericalAnalysisTutor,
  ],

  projects: [projects.en.cvWebsite, projects.en.warthogRobotics],

  skills,

  education: [education.en.usp, education.en.linkoping, education.en.senac],

  whyText: [
    'Thanks for your interest. I see a strong fit with FINN because my background is in enterprise and ERP-related software, where understanding business rules, data flow and existing systems is essential.',
    'I bring nearly five years of experience with C#, .NET, Delphi, SQL Server, APIs and integrations, including work connecting modern services with legacy applications and debugging issues across multiple layers.',
    'I am especially interested in growing into the modern SAP ecosystem at FINN, while bringing a practical software-engineering mindset: ask good questions, understand the process, take ownership and deliver maintainable solutions.',
  ],
}

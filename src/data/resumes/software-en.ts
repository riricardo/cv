import type { Resume } from '../../types/index.ts'
import { education } from '../education.ts'
import { experience } from '../experience.ts'
import { projects } from '../projects.ts'
import { skills } from '../skills.ts'

export const softwareEnResume: Resume = {
  id: 'software-en',
  language: 'en',

  professionalSummary:
    'Software Developer focused on building maintainable business applications and improving complex existing systems. I bring a practical background across legacy and modern software, with a strong interest in clean design, reliable integrations and solutions that are simple for teams to understand and evolve. EU citizen authorised to work across the European Union without sponsorship.',

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
    'Thanks for asking. I think I can be a strong fit for teams that need a developer who is comfortable entering an existing system, understanding how it works and making practical improvements without adding unnecessary complexity.',
    'I bring nearly five years of professional software-development experience across desktop, web, mobile and backend systems, with hands-on work in C#, .NET, ASP.NET, Delphi, SQL Server, REST APIs and enterprise applications.',
    'A lot of my experience has been around debugging, business rules, database work, integrations and connecting modern services with legacy applications. That has made me careful about maintainability, testing, documentation and how changes affect real users.',
    'I am also used to working across database, backend and presentation layers, and I am actively deepening my understanding of software design, SOLID principles and architecture. I am a Portuguese and Brazilian citizen with full authorisation to work throughout the European Union.',
  ],
}

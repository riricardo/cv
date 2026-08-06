import type { Resume } from '../../types/index.ts'
import { education } from '../education.ts'
import { experience } from '../experience.ts'
import { projects } from '../projects.ts'
import { skills } from '../skills.ts'

export const softwareEnResume: Resume = {
  id: 'software-en',
  language: 'en',

  targetRole: 'Software Engineer | C# | .NET | Backend & Full-Stack Development',

  professionalSummary:
    'Software Developer with nearly five years of professional experience working across desktop, web, mobile and backend applications. Experienced with C#, .NET, Delphi, ASP.NET, SQL Server, APIs, reporting systems and integrations between modern services and legacy software. Strong background in debugging, database optimisation, reusable components, technical documentation and delivering features across database, backend and presentation layers. I enjoy understanding complex systems, improving existing solutions and building software that is simple, maintainable and practical. Currently deepening my knowledge of software design, SOLID principles and software architecture. EU citizen authorised to work across the European Union without sponsorship.',

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
    'Nearly five years of professional software-development experience across desktop, web, mobile and backend systems.',
    'Practical experience with C#, .NET, ASP.NET, Delphi, SQL Server, REST APIs and enterprise applications.',
    'Able to investigate unfamiliar systems, understand how their components interact and implement maintainable improvements.',
    'Experienced in connecting modern web and backend services with legacy desktop applications.',
    'Strong debugging and problem-solving background involving application code, databases, integrations, environments and deployments.',
    'Comfortable contributing across database, backend and presentation layers.',
    'Experienced with Dependency Injection, CQRS, MediatR, Dapper, Entity Framework, LINQ and Scrum-based development.',
    'Careful with documentation, implementation planning, testing and long-term maintainability.',
    'International experience and current professional experience in Ireland.',
    'Portuguese and Brazilian citizen with full authorisation to work throughout the European Union.',
  ],
}

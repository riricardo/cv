import type { Resume } from '../../types/index.ts'
import { education } from '../education.ts'
import { experience } from '../experience.ts'
import { projects } from '../projects.ts'
import { skills } from '../skills.ts'
import { getExperience } from './utils.ts'

export const softwarePtResume: Resume = {
  id: 'software-pt',
  language: 'pt',

  professionalSummary:
    'Desenvolvedor de Software com foco em construir aplicações de negócio de fácil manutenção e melhorar sistemas complexos já existentes. Tenho uma base prática em software legado e moderno, com forte interesse por design limpo, integrações confiáveis e soluções simples para equipes entenderem e evoluírem. Sou cidadão da União Europeia e posso trabalhar em qualquer país da UE sem necessidade de patrocínio.',

  experience: [
    getExperience(experience.pt, 'bidvestNoonan'),
    getExperience(experience.pt, 'linx'),
    getExperience(experience.pt, 'syshouse'),
    getExperience(experience.pt, 'japi'),
    getExperience(experience.pt, 'numericalAnalysisTutor'),
  ],

  projects: [projects.pt.cvWebsite, projects.pt.warthogRobotics],

  skills,

  education: [education.pt.usp, education.pt.linkoping, education.pt.senac],

  whyText: [
    'Obrigado pelo interesse. Acredito que posso ser uma boa escolha para equipes que precisam de alguém confortável em entrar em sistemas já existentes, entender como eles funcionam e fazer melhorias práticas sem adicionar complexidade desnecessária.',
    'Tenho quase cinco anos de experiência profissional em desenvolvimento de software para sistemas desktop, web, mobile e backend, com experiência prática em C#, .NET, ASP.NET, Delphi, SQL Server, APIs REST e aplicações corporativas.',
    'Boa parte da minha experiência envolve debugging, regras de negócio, banco de dados, integrações e conexão entre serviços modernos e aplicações legadas. Isso me tornou cuidadoso com manutenção, testes, documentação e impacto real das mudanças para os usuários.',
    'Também estou acostumado a contribuir entre banco de dados, backend e interface, e sigo aprofundando meus conhecimentos em design de software, princípios SOLID e arquitetura. Sou cidadão português e brasileiro, com autorização para trabalhar em toda a União Europeia.',
  ],
}

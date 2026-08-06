import type { Resume } from '../../types/index.ts'

import { education } from '../education.ts'
import { experience } from '../experience.ts'
import { projects } from '../projects.ts'
import { skills } from '../skills.ts'

export const softwarePtResume: Resume = {
  id: 'software-pt',
  language: 'pt',

  targetRole: 'Software Developer',

  professionalSummary:
    'Desenvolvedor de Software com quase cinco anos de experiência profissional em aplicações desktop, web, mobile e backend. Possuo experiência com C#, .NET, Delphi, ASP.NET, SQL Server, APIs, sistemas de relatórios e integrações entre serviços modernos e sistemas legados. Tenho forte atuação em debugging, otimização de bancos de dados, desenvolvimento de componentes reutilizáveis, documentação técnica e entrega de funcionalidades envolvendo banco de dados, backend e interface. Gosto de compreender sistemas complexos, melhorar soluções existentes e desenvolver software simples, prático e de fácil manutenção. Atualmente estou aprofundando meus conhecimentos em design de software, princípios SOLID e arquitetura. Sou cidadão da União Europeia e posso trabalhar em qualquer país da UE sem necessidade de patrocínio.',

  experience: [
    experience.pt.bidvestNoonan,
    experience.pt.linx,
    experience.pt.syshouse,
    experience.pt.japi,
    experience.pt.numericalAnalysisTutor,
  ],

  projects: [projects.pt.cvWebsite, projects.pt.warthogRobotics],

  skills,

  education: [education.pt.usp, education.pt.linkoping, education.pt.senac],

  whyText: [
    'Quase cinco anos de experiência profissional em desenvolvimento de sistemas desktop, web, mobile e backend.',
    'Experiência prática com C#, .NET, ASP.NET, Delphi, SQL Server, APIs REST e aplicações corporativas.',
    'Capacidade de investigar sistemas desconhecidos, compreender a interação entre seus componentes e implementar melhorias sustentáveis.',
    'Experiência na integração de serviços modernos de backend e web com aplicações desktop legadas.',
    'Forte experiência em debugging e resolução de problemas envolvendo código, bancos de dados, integrações, ambientes e publicações.',
    'Capacidade de contribuir em diferentes camadas, incluindo banco de dados, backend e interface.',
    'Experiência com Injeção de Dependência, CQRS, MediatR, Dapper, Entity Framework, LINQ e desenvolvimento com Scrum.',
    'Atenção à documentação, planejamento da implementação, testes e manutenção futura.',
    'Experiência internacional e atuação profissional atual na Irlanda.',
    'Cidadão português e brasileiro, com autorização para trabalhar em toda a União Europeia.',
  ],
}

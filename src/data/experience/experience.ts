import type { Experience } from '../../types/resume.js'

export const experience = {
  exampleCompany: {
    company: 'Example Company',
    role: 'Software Engineer',
    location: 'Dublin, Ireland',
    startDate: '2022-01',
    endDate: 'Present',
    current: true,
    description:
      'Builds and maintains frontend features for internal and customer-facing products.',
    highlights: [
      'Implemented reusable React components with TypeScript.',
      'Improved UI consistency through shared styling patterns.',
      'Collaborated with product and design teams to deliver incremental improvements.',
    ],
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
  },
  exampleCompanyPt: {
    company: 'Empresa Exemplo',
    role: 'Engenheiro de Software',
    location: 'Dublin, Irlanda',
    startDate: '2022-01',
    endDate: 'Present',
    current: true,
    description:
      'Desenvolve e mantém funcionalidades frontend para produtos internos e voltados ao usuário.',
    highlights: [
      'Implementou componentes React reutilizáveis com TypeScript.',
      'Melhorou a consistência da interface com padrões compartilhados de estilo.',
      'Colaborou com times de produto e design para entregar melhorias incrementais.',
    ],
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
  },
} satisfies Record<string, Experience>

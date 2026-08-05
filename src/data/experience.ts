import type { Experience, Localized } from '../types/index.ts'

export const experience = {
  en: {
    exampleCompany: {
      company: 'Example Company',
      role: 'Software Engineer',
      location: 'Dublin, Ireland',
      startDate: '2022-01',
      endDate: 'Present',
      description:
        'Builds and maintains frontend features for internal and customer-facing products.',
      highlights: [
        'Implemented reusable React components with TypeScript.',
        'Improved UI consistency through shared styling patterns.',
        'Collaborated with product and design teams to deliver incremental improvements.',
      ],
      technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    },
  },
  pt: {
    exampleCompany: {
      company: 'Empresa Exemplo',
      role: 'Engenheiro de Software',
      location: 'Dublin, Irlanda',
      startDate: '2022-01',
      endDate: 'Present',
      description:
        'Desenvolve e mantém funcionalidades frontend para produtos internos e voltados ao usuário.',
      highlights: [
        'Implementou componentes React reutilizáveis com TypeScript.',
        'Melhorou a consistência da interface com padrões compartilhados de estilo.',
        'Colaborou com times de produto e design para entregar melhorias incrementais.',
      ],
      technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    },
  },
} satisfies Localized<Record<string, Experience>>

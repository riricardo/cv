import type { Education, Localized } from '../types/index.ts'

export const education = {
  en: {
    softwareDevelopment: {
      institution: 'Example University',
      degree: 'Software Development',
      location: 'Dublin, Ireland',
      startDate: '2018-09',
      endDate: '2021-06',
    },
  },
  pt: {
    softwareDevelopment: {
      institution: 'Universidade Exemplo',
      degree: 'Desenvolvimento de Software',
      location: 'Dublin, Irlanda',
      startDate: '2018-09',
      endDate: '2021-06',
    },
  },
} satisfies Localized<Record<string, Education>>

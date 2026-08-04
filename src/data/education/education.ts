import type { Education } from '../../types/resume.js'

export const education = {
  softwareDevelopment: {
    institution: 'Example University',
    degree: 'Software Development',
    location: 'Dublin, Ireland',
    startDate: '2018-09',
    endDate: '2021-06',
  },
  softwareDevelopmentPt: {
    institution: 'Universidade Exemplo',
    degree: 'Desenvolvimento de Software',
    location: 'Dublin, Irlanda',
    startDate: '2018-09',
    endDate: '2021-06',
  },
} satisfies Record<string, Education>

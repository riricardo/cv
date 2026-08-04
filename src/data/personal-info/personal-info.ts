import type { PersonalInfo } from '../../types/resume.js'

export const personalInfo = {
  info: {
    name: 'Ricardo Cardona',
    professionalTitle: 'Software Engineer',
    location: 'Dublin, Ireland',
    email: 'ricardo@example.com',
  },
  infoPt: {
    name: 'Ricardo Cardona',
    professionalTitle: 'Engenheiro de Software',
    location: 'Dublin, Irlanda',
    email: 'ricardo@example.com',
  },
} satisfies Record<string, PersonalInfo>

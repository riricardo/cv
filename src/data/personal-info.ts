import type { PersonalInfo } from '../types/resume.js'

export const personalInfo = {
  info: {
    name: 'Ricardo Cardona',
    professionalTitle: 'Software Engineer',
    location: 'Dublin, Ireland',
    email: 'ricardo@example.com',
    phone: '+353 1 000 0000',
    nationality: 'Brazilian / Italian',
  },
  infoPt: {
    name: 'Ricardo Cardona',
    professionalTitle: 'Engenheiro de Software',
    location: 'Dublin, Irlanda',
    email: 'ricardo@example.com',
    phone: '+353 1 000 0000',
    nationality: 'Brasileiro / Italiano',
  },
} satisfies Record<string, PersonalInfo>

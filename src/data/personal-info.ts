import type { Localized, PersonalInfo } from '../types/index.ts'

export const personalInfo = {
  en: {
    name: 'Ricardo Cardona',
    location: 'Dublin, Ireland',
    email: 'ricardo@example.com',
    phone: '+353 1 000 0000',
    nationality: 'Brazilian / Italian',
    githubUrl: 'https://github.com/riricardo',
    linkedInUrl: 'https://www.linkedin.com/',
    portfolioUrl: 'https://riricardo.github.io/cv/',
  },
  pt: {
    name: 'Ricardo Cardona',
    location: 'Dublin, Irlanda',
    email: 'ricardo@example.com',
    phone: '+353 1 000 0000',
    nationality: 'Brasileiro / Italiano',
    githubUrl: 'https://github.com/riricardo',
    linkedInUrl: 'https://www.linkedin.com/',
    portfolioUrl: 'https://riricardo.github.io/cv/',
  },
} satisfies Localized<PersonalInfo>

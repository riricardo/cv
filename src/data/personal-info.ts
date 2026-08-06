import type { Localized, PersonalInfo } from '../types/index.ts'

export const personalInfo = {
  en: {
    name: 'Ricardo Augusto Cardona',
    location: 'Leixlip, Ireland',
    email: 'ricardo.augusto.cardona@gmail.com',
    phone: '+353 83 189 4310',
    nationality: 'Portuguese & Brazilian | EU Citizen',
    githubUrl: 'https://github.com/riricardo',
    linkedInUrl: 'https://www.linkedin.com/in/ricardo-augusto-cardona',
    portfolioUrl: 'https://riricardo.github.io/portfolio',
  },
  pt: {
    name: 'Ricardo Augusto Cardona',
    location: 'Leixlip, Irlanda',
    email: 'ricardo.augusto.cardona@gmail.com',
    phone: '+353 83 189 4310',
    nationality: 'Português e Brasileiro | Cidadão da União Europeia',
    githubUrl: 'https://github.com/riricardo',
    linkedInUrl: 'https://www.linkedin.com/in/ricardo-augusto-cardona',
    portfolioUrl: 'https://riricardo.github.io/portfolio',
  },
} satisfies Localized<PersonalInfo>

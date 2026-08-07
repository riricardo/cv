import type { Localized, PersonalInfo } from '../types/index.ts'

export const personalInfo = {
  en: {
    name: 'Ricardo Cardona',
    fullName: 'Ricardo Augusto Cardona',
    location: 'Leixlip, Ireland',
    displayLocation: 'Ireland',
    email: 'ricardo.augusto.cardona@gmail.com',
    phone: '+353 83 189 4310',
    nationality: 'Portuguese & Brazilian | EU Citizen',
    professionalDescription: 'Software Developer',
    githubUrl: 'https://github.com/riricardo',
    linkedInUrl: 'https://www.linkedin.com/in/ricardo-augusto-cardona',
    portfolioUrl: 'https://riricardo.github.io/portfolio',
  },
  pt: {
    name: 'Ricardo Cardona',
    fullName: 'Ricardo Augusto Cardona',
    location: 'Leixlip, Irlanda',
    displayLocation: 'Irlanda',
    email: 'ricardo.augusto.cardona@gmail.com',
    phone: '+353 83 189 4310',
    nationality: 'Português e Brasileiro | Cidadão da União Europeia',
    professionalDescription: 'Desenvolvedor de Software',
    githubUrl: 'https://github.com/riricardo',
    linkedInUrl: 'https://www.linkedin.com/in/ricardo-augusto-cardona',
    portfolioUrl: 'https://riricardo.github.io/portfolio',
  },
} satisfies Localized<PersonalInfo>

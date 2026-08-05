import type { Localized, SpokenLanguage } from '../types/index.ts'

export const languages = {
  en: [
    { name: 'English', level: 'Professional' },
    { name: 'Portuguese', level: 'Native' },
  ],
  pt: [
    { name: 'Inglês', level: 'Profissional' },
    { name: 'Português', level: 'Nativo' },
  ],
} satisfies Localized<SpokenLanguage[]>

import type { Language } from '../../types/resume.js'

export const languages = {
  english: { name: 'English', level: 'Professional' },
  portuguese: { name: 'Portuguese', level: 'Native' },
  englishPt: { name: 'Inglês', level: 'Profissional' },
  portuguesePt: { name: 'Português', level: 'Nativo' },
} satisfies Record<string, Language>

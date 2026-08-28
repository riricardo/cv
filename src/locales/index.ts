import enJson from './en.json' with { type: 'json' }
import ptJson from './pt.json' with { type: 'json' }

export type Locale = {
  actionsLabel: string
  interactiveMessage: string
  portfolio: string
  download: string
  downloadAriaLabel: string
  downloadTitle: string
  summary: string
  experience: string
  projects: string
  skills: string
  languages: string
  education: string
  close: string
  seeLess: string
  seeMore: string
  present: string
  repository: string
  demo: string
}

export const en: Locale = enJson
export const pt: Locale = ptJson

export const locales: Record<string, Locale> = {
  en,
  pt,
}

export const defaultLocale = en
export type ResumeText = Locale

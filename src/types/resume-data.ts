import type { Language } from './localization.ts'

export interface PersonalInfo {
  name: string
  location: string
  email?: string
  phone?: string
  nationality?: string
  githubUrl: string
  linkedInUrl: string
  portfolioUrl: string
}

export interface Experience {
  company: string
  role: string
  location?: string
  startDate: string
  endDate?: string
  description: string
  highlights?: string[]
  technologies?: string[]
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  repositoryUrl?: string
  demoUrl?: string
}

export interface Skill {
  name: string
  level?: string
}

export interface Education {
  institution: string
  degree: string
  location?: string
  startDate: string
  endDate?: string
}

export interface SpokenLanguage {
  name: string
  level: string
}

export interface Resume {
  id: string
  language: Language
  targetRole: string
  professionalSummary: string
  experience: Experience[]
  projects: Project[]
  skills: Skill[]
  education: Education[]
  whyText: string[]
}

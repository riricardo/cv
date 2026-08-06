import type { Language } from './localization.ts'

export interface PersonalInfo {
  name: string
  fullName?: string
  location: string
  displayLocation?: string
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

export type SkillAreaId = 'backend' | 'frontend' | 'databases' | 'architecture' | 'tools'

export type SkillAreas = Record<SkillAreaId, string[]>

export interface Education {
  institution: string
  degree: string
  location?: string
  startDate: string
  endDate?: string
  description: string
  highlights: string[]
  technologies: string[]
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
  skills: SkillAreas
  education: Education[]
  whyText: string[]
}

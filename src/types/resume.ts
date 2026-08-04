export interface PersonalInfo {
  name: string
  professionalTitle: string
  location: string
  email?: string
  phone?: string
  nationality?: string
}

export interface Experience {
  company: string
  role: string
  location?: string
  startDate: string
  endDate?: string
  current?: boolean
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
  category?: string
  level?: string
}

export interface Education {
  institution: string
  degree: string
  location?: string
  startDate: string
  endDate?: string
  description?: string
}

export interface Language {
  name: string
  level: string
}

export interface ContactLink {
  label: string
  url: string
  icon?: string
}

export interface ResumeSettings {
  showProjects?: boolean
  showPortfolio?: boolean
  showInteractiveBar?: boolean
}

export interface Resume {
  id: string
  language: string
  company?: string
  targetRole: string
  professionalSummary: string
  experience: Experience[]
  projects: Project[]
  skills: Skill[]
  education: Education[]
  whyText: string[]
  settings?: ResumeSettings
}

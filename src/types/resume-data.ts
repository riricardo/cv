export type Id = string
export type Language = string

export interface DocumentMetadata {
  id: Id
  version: number
  createdAt: string
  updatedAt: string
}

export interface TranslatedDocument extends DocumentMetadata {
  translationGroupId?: Id
  language: Language
}

export interface PersonalInfo extends TranslatedDocument {
  name: string
  fullName?: string
  location: string
  displayLocation?: string
  email?: string
  phone?: string
  nationality?: string
  professionalDescription: string
  pageTitle: string
  whyTitle: string
  githubUrl: string
  linkedInUrl: string
  portfolioUrl: string
}

export interface Highlight {
  id: Id
  category: string
  value: string
}

export interface ResumeHighlight {
  includeInDownload: boolean
  value: string
}

export interface ProfileExperience {
  experienceId: Id
  print: boolean
  highlightIds: Id[]
  downloadHighlightIds?: Id[]
}

export interface ExperienceDocument extends TranslatedDocument {
  company: string
  role: string
  location?: string
  startDate: string
  endDate?: string
  description: string
  skillIds: Id[]
  highlights: Highlight[]
}

export interface Experience extends Omit<ExperienceDocument, 'highlights' | 'skillIds'> {
  includeInDownload: boolean
  highlights: ResumeHighlight[]
  technologies: string[]
}

export interface ProjectDocument extends TranslatedDocument {
  name: string
  description: string
  skillIds: Id[]
  repositoryUrl?: string
  demoUrl?: string
}

export interface Project extends Omit<ProjectDocument, 'skillIds'> {
  technologies: string[]
}

export interface Skill extends DocumentMetadata {
  name: string
  type?: string
}

export interface SkillCategoryDocument extends TranslatedDocument {
  name: string
  icon?: string
  skillIds: Id[]
}

export interface SkillCategory extends Omit<SkillCategoryDocument, 'skillIds'> {
  skills: string[]
}

export interface EducationDocument extends TranslatedDocument {
  institution: string
  degree: string
  location?: string
  startDate: string
  endDate?: string
  description: string
  highlights: Highlight[]
  skillIds: Id[]
}

export interface Education extends Omit<EducationDocument, 'skillIds'> {
  technologies: string[]
}

export interface SpokenLanguage extends TranslatedDocument {
  name: string
  proficiency: string
}

export interface ProfileDocument extends TranslatedDocument {
  name: string
  personalInfoId: Id
  professionalSummary: string
  experiences: ProfileExperience[]
  educationIds: Id[]
  projectIds: Id[]
  skillCategoryIds: Id[]
  spokenLanguageIds: Id[]
}

export interface ResumeDocument extends DocumentMetadata {
  name: string
  linkId: string
  language: Language
  profileId: Id
  whyText: string | string[]
  details?: Record<string, string>
}

export interface Resume extends ResumeDocument {
  profile: ProfileDocument
  personalInfo: PersonalInfo
  professionalSummary: string
  experience: Experience[]
  projects: Project[]
  skillCategories: SkillCategory[]
  education: Education[]
  spokenLanguages: SpokenLanguage[]
}

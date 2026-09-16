import type {
  Education,
  Experience,
  Highlight,
  Id,
  PersonalInfo,
  ProfileDocument,
  Project,
  Resume,
  ResumeDocument,
  ResumeHighlight,
  SkillCategory,
  SpokenLanguage,
} from '../types/index.ts'

type ApiDocumentMetadata = {
  id: Id
  createdAt: string
  updatedAt: string
  language?: string | null
}

type ApiResumeDocument = ApiDocumentMetadata & {
  name: string
  linkId: string
  profileId: Id
  whyText: string[]
  details?: Record<string, string | null> | null
}

type ApiProfileDocument = ApiDocumentMetadata & {
  name: string
  personalInfoId: Id
  professionalSummary: string
  experiences: {
    experienceId: Id
    print: boolean
    highlightIds: Id[]
    downloadHighlightIds?: Id[] | null
  }[]
  educationIds: Id[]
  projectIds: Id[]
  skillIds: Id[]
  spokenLanguageIds: Id[]
}

type ApiPersonalInfo = ApiDocumentMetadata & {
  name: string
  fullName?: string | null
  location: string
  displayLocation?: string | null
  email?: string | null
  phone?: string | null
  nationality?: string | null
  professionalDescription: string
  pageTitle: string
  whyTitle: string
  githubUrl: string
  linkedInUrl: string
  portfolioUrl: string
}

type ApiExperienceDocument = ApiDocumentMetadata & {
  company: string
  role: string
  location?: string | null
  description: string
  startDate: string
  endDate?: string | null
  highlights: Highlight[]
  skillIds: Id[]
}

type ApiEducationDocument = ApiDocumentMetadata & {
  institution: string
  degree: string
  location?: string | null
  startDate: string
  endDate?: string | null
  description: string
  highlights: Highlight[]
  skillIds: Id[]
}

type ApiProjectDocument = ApiDocumentMetadata & {
  name: string
  description: string
  skillIds: Id[]
  repositoryUrl?: string | null
  demoUrl?: string | null
}

type ApiSkillDetails = {
  skill: {
    id: Id
    createdAt: string
    updatedAt: string
    name: string
    categoryId: Id
  }
  category: {
    id: Id
    createdAt: string
    updatedAt: string
    language?: string | null
    name: string
    icon?: string | null
  } | null
}

type ApiResumeResponse = {
  resume: ApiResumeDocument
  profile: {
    profile: ApiProfileDocument
    personalInfo: ApiPersonalInfo | null
    experiences: { experience: ApiExperienceDocument; skills: ApiSkillDetails[] }[]
    education: { education: ApiEducationDocument; skills: ApiSkillDetails[] }[]
    projects: { project: ApiProjectDocument; skills: ApiSkillDetails[] }[]
    skills: ApiSkillDetails[]
    spokenLanguages: SpokenLanguage[]
  } | null
}

const apiBaseUrl = String(import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

export function hasApiBaseUrl() {
  return Boolean(apiBaseUrl)
}

export async function fetchResumeByLink(linkId: string): Promise<Resume> {
  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is not configured.')
  }

  const response = await fetch(`${apiBaseUrl}/api/resumes/by-link/${encodeURIComponent(linkId)}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Resume API request failed with status ${response.status}.`)
  }

  return mapApiResume((await response.json()) as ApiResumeResponse)
}

function mapApiResume(payload: ApiResumeResponse): Resume {
  if (!payload.profile) {
    throw new Error('Resume API response does not include profile data.')
  }

  if (!payload.profile.personalInfo) {
    throw new Error('Resume API response does not include personal info.')
  }

  const profile = withVersion({
    ...payload.profile.profile,
    language: normalizeLanguage(payload.profile.profile.language),
    experiences: payload.profile.profile.experiences.map((experience) => ({
      ...experience,
      downloadHighlightIds: experience.downloadHighlightIds ?? undefined,
    })),
    skillCategoryIds: [],
  }) as ProfileDocument
  const resume = withVersion({
    ...payload.resume,
    language: normalizeLanguage(payload.resume.language),
    whyText: payload.resume.whyText ?? [],
    details: normalizeDetails(payload.resume.details),
  }) as ResumeDocument

  return {
    ...resume,
    profile,
    personalInfo: mapPersonalInfo(payload.profile.personalInfo),
    professionalSummary: profile.professionalSummary,
    experience: payload.profile.experiences.map((entry) =>
      mapExperience(entry.experience, entry.skills, profile),
    ),
    projects: payload.profile.projects.map((entry) => mapProject(entry.project, entry.skills)),
    skillCategories: mapSkillCategories(payload.profile.skills),
    education: payload.profile.education.map((entry) =>
      mapEducation(entry.education, entry.skills),
    ),
    spokenLanguages: payload.profile.spokenLanguages.map((language) =>
      withVersion({
        ...language,
        language: normalizeLanguage(language.language),
      }),
    ),
  }
}

function mapPersonalInfo(personalInfo: ApiPersonalInfo): PersonalInfo {
  return withVersion({
    ...personalInfo,
    language: normalizeLanguage(personalInfo.language),
    fullName: personalInfo.fullName ?? undefined,
    displayLocation: personalInfo.displayLocation ?? undefined,
    email: personalInfo.email ?? undefined,
    phone: personalInfo.phone ?? undefined,
    nationality: personalInfo.nationality ?? undefined,
  }) as PersonalInfo
}

function mapExperience(
  experience: ApiExperienceDocument,
  skills: ApiSkillDetails[],
  profile: ProfileDocument,
): Experience {
  const profileExperience = profile.experiences.find((item) => item.experienceId === experience.id)
  const highlightIds = profileExperience?.highlightIds ?? experience.highlights.map(({ id }) => id)
  const downloadHighlightIds = profileExperience?.downloadHighlightIds ?? highlightIds

  return withVersion({
    ...experience,
    language: normalizeLanguage(experience.language),
    endDate: experience.endDate ?? undefined,
    includeInDownload: profileExperience?.print ?? true,
    location: experience.location ?? undefined,
    highlights: mapHighlights(experience.highlights, highlightIds, downloadHighlightIds),
    technologies: mapSkillNames(skills),
  }) as Experience
}

function mapProject(project: ApiProjectDocument, skills: ApiSkillDetails[]): Project {
  return withVersion({
    ...project,
    language: normalizeLanguage(project.language),
    repositoryUrl: project.repositoryUrl ?? undefined,
    demoUrl: project.demoUrl ?? undefined,
    technologies: mapSkillNames(skills),
  }) as Project
}

function mapEducation(education: ApiEducationDocument, skills: ApiSkillDetails[]): Education {
  return withVersion({
    ...education,
    language: normalizeLanguage(education.language),
    endDate: education.endDate ?? undefined,
    location: education.location ?? undefined,
    technologies: mapSkillNames(skills),
  }) as Education
}

function mapHighlights(
  highlights: Highlight[],
  highlightIds: Id[],
  downloadHighlightIds: Id[],
): ResumeHighlight[] {
  const highlightsById = new Map(highlights.map((highlight) => [highlight.id, highlight]))
  const downloadHighlightIdSet = new Set(downloadHighlightIds)

  return highlightIds.flatMap((highlightId) => {
    const highlight = highlightsById.get(highlightId)

    if (!highlight) {
      return []
    }

    return {
      includeInDownload: downloadHighlightIdSet.has(highlightId),
      value: highlight.value,
    }
  })
}

function mapSkillCategories(skills: ApiSkillDetails[]): SkillCategory[] {
  const categories = new Map<Id, SkillCategory>()

  for (const { category, skill } of skills) {
    const categoryId = category?.id ?? skill.categoryId ?? 'uncategorized'
    const existingCategory = categories.get(categoryId)

    if (existingCategory) {
      existingCategory.skills.push(skill.name)
      continue
    }

    categories.set(categoryId, {
      id: categoryId,
      version: 0,
      createdAt: category?.createdAt ?? skill.createdAt,
      updatedAt: category?.updatedAt ?? skill.updatedAt,
      language: normalizeLanguage(category?.language),
      name: category?.name ?? 'Skills',
      icon: category?.icon ?? 'fa-tag',
      skills: [skill.name],
    })
  }

  return [...categories.values()]
}

function mapSkillNames(skills: ApiSkillDetails[]) {
  return skills.map(({ skill }) => skill.name)
}

function normalizeDetails(details: ApiResumeDocument['details']) {
  if (!details) {
    return undefined
  }

  return Object.fromEntries(
    Object.entries(details).flatMap(([key, value]) => (value === null ? [] : [[key, value]])),
  )
}

function normalizeLanguage(language: string | null | undefined) {
  return language ?? 'en'
}

function withVersion<T extends { version?: number }>(
  document: Omit<T, 'version'> & { version?: number },
) {
  return {
    version: 0,
    ...document,
  } as T
}

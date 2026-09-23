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
import type { CollectionKey, EditableCollections } from '../data/edit/collectionStore.ts'
import type { JsonObject } from '../types/edit.ts'

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
  gitHubUrl: string
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

const collectionResources: Record<CollectionKey, string> = {
  skillCategories: 'skill-categories',
  skills: 'skills',
  details: 'personal-info',
  education: 'education',
  experience: 'experiences',
  languages: 'spoken-languages',
  profiles: 'profiles',
  projects: 'projects',
  resumes: 'resumes',
}

export function hasApiBaseUrl() {
  return Boolean(apiBaseUrl)
}

export async function fetchResumeByLink(linkId: string, signal?: AbortSignal): Promise<Resume> {
  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is not configured.')
  }

  const response = await fetch(`${apiBaseUrl}/api/resumes/by-link/${encodeURIComponent(linkId)}`, {
    cache: 'no-store',
    signal,
  })

  if (!response.ok) {
    throw new Error(`Resume API request failed with status ${response.status}.`)
  }

  return mapApiResume((await response.json()) as ApiResumeResponse)
}

export async function fetchEditableCollections(signal?: AbortSignal): Promise<EditableCollections> {
  assertApiBaseUrl()

  const entries = await Promise.all(
    Object.entries(collectionResources).map(async ([collectionKey, resource]) => {
      const response = await fetch(`${apiBaseUrl}/api/${resource}`, { cache: 'no-store', signal })
      await assertSuccessfulResponse(response)
      const documents = (await response.json()) as JsonObject[]

      return [collectionKey, documents.map((document) => mapApiDocument(collectionKey, document))]
    }),
  )

  return Object.fromEntries(entries) as EditableCollections
}

export async function syncEditableCollections(
  previous: EditableCollections,
  next: EditableCollections,
  masterKey: string,
) {
  assertApiBaseUrl()

  for (const collectionKey of Object.keys(collectionResources) as CollectionKey[]) {
    const previousDocuments = previous[collectionKey] as unknown as JsonObject[]
    const nextDocuments = next[collectionKey] as unknown as JsonObject[]
    const previousById = new Map(
      previousDocuments.map((document) => [String(document.id), document]),
    )
    const nextById = new Map(nextDocuments.map((document) => [String(document.id), document]))

    for (const document of nextDocuments) {
      const id = String(document.id ?? '')
      const previousDocument = previousById.get(id)

      if (!previousDocument) {
        await writeEditableDocument(collectionKey, undefined, document, masterKey)
      } else if (JSON.stringify(previousDocument) !== JSON.stringify(document)) {
        await writeEditableDocument(collectionKey, id, document, masterKey)
      }
    }

    for (const [id] of previousById) {
      if (!nextById.has(id)) {
        await requestAdmin(`${apiBaseUrl}/api/${collectionResources[collectionKey]}/${id}`, {
          method: 'DELETE',
          masterKey,
        })
      }
    }
  }
}

async function writeEditableDocument(
  collectionKey: CollectionKey,
  id: string | undefined,
  document: JsonObject,
  masterKey: string,
) {
  const resource = collectionResources[collectionKey]
  const body = toApiDocument(collectionKey, document, Boolean(id))
  const url = id
    ? `${apiBaseUrl}/api/${resource}/${encodeURIComponent(id)}`
    : `${apiBaseUrl}/api/${resource}`

  await requestAdmin(url, {
    body: JSON.stringify(body),
    masterKey,
    method: id ? 'PUT' : 'POST',
  })
}

async function requestAdmin(
  url: string,
  options: { body?: string; masterKey: string; method: 'DELETE' | 'POST' | 'PUT' },
) {
  const response = await fetch(url, {
    body: options.body,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      'X-MASTER-KEY': options.masterKey,
    },
    method: options.method,
  })

  await assertSuccessfulResponse(response)
}

async function assertSuccessfulResponse(response: Response) {
  if (response.ok) {
    return
  }

  let details = ''
  const responseText = await response.text()

  if (responseText) {
    try {
      const body = JSON.parse(responseText) as { message?: string }
      details = ` ${body.message ?? JSON.stringify(body)}`
    } catch {
      details = ` ${responseText}`
    }
  }

  throw new Error(`API request failed with status ${response.status}.${details}`)
}

function assertApiBaseUrl() {
  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is not configured.')
  }
}

function mapApiDocument(collectionKey: string, document: JsonObject): JsonObject {
  if (collectionKey !== 'details' || document.gitHubUrl === undefined) {
    return document
  }

  const { gitHubUrl, ...rest } = document
  return { ...rest, githubUrl: gitHubUrl }
}

function toApiDocument(collectionKey: string, document: JsonObject, includeId: boolean) {
  const { createdAt: _createdAt, updatedAt: _updatedAt, version: _version, ...editable } = document
  const body = includeId || isGuid(editable.id) ? editable : omitProperty(editable, 'id')

  if (collectionKey !== 'details' || body.githubUrl === undefined) {
    return body
  }

  const { githubUrl, ...rest } = body
  return { ...rest, gitHubUrl: githubUrl }
}

function isGuid(value: JsonObject[string]) {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  )
}

function omitProperty(value: JsonObject, key: string): JsonObject {
  return Object.fromEntries(Object.entries(value).filter(([entryKey]) => entryKey !== key))
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
  const { gitHubUrl, ...rest } = personalInfo

  return withVersion({
    ...rest,
    githubUrl: gitHubUrl,
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

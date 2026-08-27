import type {
  Education,
  EducationDocument,
  Experience,
  ExperienceDocument,
  Id,
  PersonalInfo,
  ProfileDocument,
  Project,
  ProjectDocument,
  Resume,
  ResumeDocument,
  ResumeHighlight,
  Skill,
  SkillCategory,
  SkillCategoryDocument,
  SpokenLanguage,
} from '../../types/index.ts'
import educationJson from '../collections/education.json' with { type: 'json' }
import experiencesJson from '../collections/experiences.json' with { type: 'json' }
import personalInfoJson from '../collections/personalInfo.json' with { type: 'json' }
import profilesJson from '../collections/profiles.json' with { type: 'json' }
import projectsJson from '../collections/projects.json' with { type: 'json' }
import resumesJson from '../collections/resumes.json' with { type: 'json' }
import skillCategoriesJson from '../collections/skillCategories.json' with { type: 'json' }
import skillsJson from '../collections/skills.json' with { type: 'json' }
import spokenLanguagesJson from '../collections/spokenLanguages.json' with { type: 'json' }

const educationDocuments = educationJson as EducationDocument[]
const experienceDocuments = experiencesJson as ExperienceDocument[]
const personalInfoDocuments = personalInfoJson as PersonalInfo[]
const profileDocuments = profilesJson as ProfileDocument[]
const projectDocuments = projectsJson as ProjectDocument[]
const resumeDocuments = resumesJson as ResumeDocument[]
const skillCategoryDocuments = skillCategoriesJson as SkillCategoryDocument[]
const skillDocuments = skillsJson as Skill[]
const spokenLanguageDocuments = spokenLanguagesJson as SpokenLanguage[]

const educationById = mapById(educationDocuments)
const experiencesById = mapById(experienceDocuments)
const personalInfoById = mapById(personalInfoDocuments)
const profilesById = mapById(profileDocuments)
const projectsById = mapById(projectDocuments)
const skillCategoriesById = mapById(skillCategoryDocuments)
const skillsById = mapById(skillDocuments)
const spokenLanguagesById = mapById(spokenLanguageDocuments)

export const defaultResumeId = 'software-en'

export const resumes: Record<string, ResumeDocument> = Object.fromEntries(
  resumeDocuments.map((resume) => [resume.id, resume]),
)

export function getResume(resumeId: string = defaultResumeId): Resume {
  const resume = resumes[resumeId] ?? resumes[defaultResumeId]
  const profile = getRequired(profilesById, resume.profileId, `Resume "${resume.id}" profileId`)
  const personalInfo = getRequired(
    personalInfoById,
    profile.personalInfoId,
    `Profile "${profile.id}" personalInfoId`,
  )

  return {
    ...resume,
    profile,
    personalInfo,
    professionalSummary: profile.professionalSummary,
    experience: profile.experiences.map((profileExperience) =>
      resolveExperience(profile.id, profileExperience),
    ),
    projects: profile.projectIds.map((projectId) => resolveProject(profile.id, projectId)),
    skillCategories: profile.skillCategoryIds.map((categoryId) =>
      resolveSkillCategory(profile.id, categoryId),
    ),
    education: profile.educationIds.map((educationId) => resolveEducation(profile.id, educationId)),
    spokenLanguages: profile.spokenLanguageIds.map((languageId) =>
      getRequired(spokenLanguagesById, languageId, `Profile "${profile.id}" spokenLanguageIds`),
    ),
  }
}

function resolveExperience(
  profileId: Id,
  profileExperience: ProfileDocument['experiences'][number],
): Experience {
  const experience = getRequired(
    experiencesById,
    profileExperience.experienceId,
    `Profile "${profileId}" experiences`,
  )

  return {
    ...experience,
    includeInDownload: profileExperience.print,
    highlights: resolveHighlights(profileId, experience, profileExperience.highlightIds),
    technologies: resolveSkillNames(experience.skillIds, `Experience "${experience.id}" skillIds`),
  }
}

function resolveHighlights(
  profileId: Id,
  experience: ExperienceDocument,
  highlightIds: Id[],
): ResumeHighlight[] {
  const highlightsById = mapById(experience.highlights)

  return highlightIds.map((highlightId) => {
    const highlight = getRequired(
      highlightsById,
      highlightId,
      `Profile "${profileId}" highlights for experience "${experience.id}"`,
    )

    return {
      includeInDownload: true,
      value: highlight.value,
    }
  })
}

function resolveProject(profileId: Id, projectId: Id): Project {
  const project = getRequired(projectsById, projectId, `Profile "${profileId}" projectIds`)

  return {
    ...project,
    technologies: resolveSkillNames(project.skillIds, `Project "${project.id}" skillIds`),
  }
}

function resolveEducation(profileId: Id, educationId: Id): Education {
  const education = getRequired(educationById, educationId, `Profile "${profileId}" educationIds`)

  return {
    ...education,
    technologies: resolveSkillNames(education.skillIds, `Education "${education.id}" skillIds`),
  }
}

function resolveSkillCategory(profileId: Id, categoryId: Id): SkillCategory {
  const category = getRequired(
    skillCategoriesById,
    categoryId,
    `Profile "${profileId}" skillCategoryIds`,
  )

  return {
    ...category,
    skills: resolveSkillNames(category.skillIds, `Skill category "${category.id}" skillIds`),
  }
}

function resolveSkillNames(skillIds: Id[], context: string): string[] {
  return skillIds.map((skillId) => getRequired(skillsById, skillId, context).name)
}

function mapById<T extends { id: Id }>(documents: T[]): Map<Id, T> {
  return new Map(documents.map((document) => [document.id, document]))
}

function getRequired<T>(documents: Map<Id, T>, id: Id, context: string): T {
  const document = documents.get(id)
  if (!document) {
    throw new Error(`${context} references missing document "${id}".`)
  }

  return document
}

validateCollections()

function validateCollections() {
  for (const resume of resumeDocuments) {
    getRequired(profilesById, resume.profileId, `Resume "${resume.id}" profileId`)
  }

  for (const profile of profileDocuments) {
    getRequired(personalInfoById, profile.personalInfoId, `Profile "${profile.id}" personalInfoId`)

    for (const profileExperience of profile.experiences) {
      const experience = getRequired(
        experiencesById,
        profileExperience.experienceId,
        `Profile "${profile.id}" experiences`,
      )
      const highlightIds = new Set(experience.highlights.map((highlight) => highlight.id))

      for (const highlightId of profileExperience.highlightIds) {
        if (!highlightIds.has(highlightId)) {
          throw new Error(
            `Profile "${profile.id}" references missing highlight "${highlightId}" on experience "${experience.id}".`,
          )
        }
      }
    }

    for (const educationId of profile.educationIds) {
      const education = getRequired(
        educationById,
        educationId,
        `Profile "${profile.id}" educationIds`,
      )
      validateSkillIds(education.skillIds, `Education "${education.id}" skillIds`)
    }

    for (const projectId of profile.projectIds) {
      const project = getRequired(projectsById, projectId, `Profile "${profile.id}" projectIds`)
      validateSkillIds(project.skillIds, `Project "${project.id}" skillIds`)
    }

    for (const categoryId of profile.skillCategoryIds) {
      const category = getRequired(
        skillCategoriesById,
        categoryId,
        `Profile "${profile.id}" skillCategoryIds`,
      )
      validateSkillIds(category.skillIds, `Skill category "${category.id}" skillIds`)
    }

    for (const languageId of profile.spokenLanguageIds) {
      getRequired(spokenLanguagesById, languageId, `Profile "${profile.id}" spokenLanguageIds`)
    }
  }

  for (const experience of experienceDocuments) {
    validateSkillIds(experience.skillIds, `Experience "${experience.id}" skillIds`)
  }
}

function validateSkillIds(skillIds: Id[], context: string) {
  for (const skillId of skillIds) {
    getRequired(skillsById, skillId, context)
  }
}

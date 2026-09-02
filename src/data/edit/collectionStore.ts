import type {
  EducationDocument,
  ExperienceDocument,
  PersonalInfo,
  ProfileDocument,
  ProjectDocument,
  ResumeDocument,
  Skill,
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

export type CollectionKey =
  | 'details'
  | 'education'
  | 'experience'
  | 'languages'
  | 'profiles'
  | 'projects'
  | 'resumes'
  | 'skillCategories'
  | 'skills'

export type EditableCollections = {
  details: PersonalInfo[]
  education: EducationDocument[]
  experience: ExperienceDocument[]
  languages: SpokenLanguage[]
  profiles: ProfileDocument[]
  projects: ProjectDocument[]
  resumes: ResumeDocument[]
  skillCategories: SkillCategoryDocument[]
  skills: Skill[]
}

export const editableCollectionKeys: CollectionKey[] = [
  'details',
  'experience',
  'education',
  'profiles',
  'projects',
  'skills',
  'languages',
  'resumes',
  'skillCategories',
]

export const defaultEditableCollections: EditableCollections = {
  details: personalInfoJson as PersonalInfo[],
  education: educationJson as EducationDocument[],
  experience: experiencesJson as ExperienceDocument[],
  languages: spokenLanguagesJson as SpokenLanguage[],
  profiles: profilesJson as ProfileDocument[],
  projects: projectsJson as ProjectDocument[],
  resumes: resumesJson as ResumeDocument[],
  skillCategories: skillCategoriesJson as SkillCategoryDocument[],
  skills: skillsJson as Skill[],
}

let currentEditableCollections = cloneCollections(defaultEditableCollections)

export function cloneCollections(collections: EditableCollections): EditableCollections {
  return structuredClone(collections)
}

export function readEditableCollections(): EditableCollections {
  return cloneCollections(currentEditableCollections)
}

export function writeEditableCollections(collections: EditableCollections) {
  currentEditableCollections = cloneCollections(collections)
  window.dispatchEvent(new Event('cv-edit-collections-changed'))
}

export function getSectionDocuments(collections: EditableCollections, sectionId: string) {
  return collections[sectionId as CollectionKey] ?? []
}

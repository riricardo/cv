import type { EditableRecord, EditSection } from '../../types/edit.ts'
import { defaultEditableCollections, getSectionDocuments } from './collectionStore.ts'

export const editSectionDefinitions: Omit<EditSection, 'documents'>[] = [
  {
    id: 'details',
    title: 'Personal details',
    description: 'Name, contact details, location and professional description.',
  },
  {
    id: 'experience',
    title: 'Experience',
    description: 'Companies, roles, descriptions, technologies and highlights.',
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Courses, institutions, periods and academic highlights.',
  },
  {
    id: 'profiles',
    title: 'Profiles',
    description: 'Resume curation, sections, experiences and highlights.',
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Projects, descriptions, links and related technologies.',
  },
  {
    id: 'skills',
    title: 'Skills',
    description: 'Individual skills used across resumes.',
  },
  {
    id: 'languages',
    title: 'Languages',
    description: 'Spoken languages and proficiency levels.',
  },
  {
    id: 'resumes',
    title: 'Resumes',
    description: 'Published versions, Why me text and associated profile.',
  },
]

export const editSections: EditSection[] = editSectionDefinitions.map((section) => ({
  ...section,
  documents: getSectionDocuments(
    defaultEditableCollections,
    section.id,
  ) as unknown as EditableRecord[],
}))

export const editSectionsById = new Map(editSections.map((section) => [section.id, section]))

import educationJson from '../collections/education.json' with { type: 'json' }
import experiencesJson from '../collections/experiences.json' with { type: 'json' }
import personalInfoJson from '../collections/personalInfo.json' with { type: 'json' }
import profilesJson from '../collections/profiles.json' with { type: 'json' }
import projectsJson from '../collections/projects.json' with { type: 'json' }
import resumesJson from '../collections/resumes.json' with { type: 'json' }
import skillCategoriesJson from '../collections/skillCategories.json' with { type: 'json' }
import skillsJson from '../collections/skills.json' with { type: 'json' }
import spokenLanguagesJson from '../collections/spokenLanguages.json' with { type: 'json' }
import type { EditableRecord, EditSection } from '../../types/edit.ts'

export const editSections: EditSection[] = [
  {
    id: 'details',
    title: 'Personal details',
    description: 'Name, contact details, location and professional description.',
    documents: personalInfoJson as unknown as EditableRecord[],
  },
  {
    id: 'experience',
    title: 'Experience',
    description: 'Companies, roles, descriptions, technologies and highlights.',
    documents: experiencesJson as unknown as EditableRecord[],
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Courses, institutions, periods and academic highlights.',
    documents: educationJson as unknown as EditableRecord[],
  },
  {
    id: 'profiles',
    title: 'Profiles',
    description: 'Resume curation, sections, experiences and highlights.',
    documents: profilesJson as unknown as EditableRecord[],
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Projects, descriptions, links and related technologies.',
    documents: projectsJson as unknown as EditableRecord[],
  },
  {
    id: 'skills',
    title: 'Skills',
    description: 'Individual skills used across resumes.',
    documents: skillsJson as unknown as EditableRecord[],
  },
  {
    id: 'skill-categories',
    title: 'Skill categories',
    description: 'Skill groups shown in the resume.',
    documents: skillCategoriesJson as unknown as EditableRecord[],
  },
  {
    id: 'languages',
    title: 'Languages',
    description: 'Spoken languages and proficiency levels.',
    documents: spokenLanguagesJson as unknown as EditableRecord[],
  },
  {
    id: 'resumes',
    title: 'Resumes',
    description: 'Published versions, Why me text and associated profile.',
    documents: resumesJson as unknown as EditableRecord[],
  },
]

export const editSectionsById = new Map(editSections.map((section) => [section.id, section]))

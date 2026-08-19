import type { Experience, Language } from '../../types/index.ts'
import type { ResumeText } from '../../data/resume-translations.ts'
import ExperienceSection, { type ExperienceSectionItem } from './ExperienceSection.tsx'

type WorkSectionProps = {
  experiences: Experience[]
  language: Language
  text: ResumeText
  title: string
}

function mapExperienceToSectionItem(experience: Experience): ExperienceSectionItem {
  return {
    description: experience.description,
    endDate: experience.endDate,
    highlights: experience.highlights,
    id: experience.id,
    location: experience.location,
    skills: experience.technologies,
    startDate: experience.startDate,
    subtitle: experience.company,
    title: experience.role,
  }
}

function WorkSection({ experiences, language, text, title }: WorkSectionProps) {
  return (
    <ExperienceSection
      headingId="experience-heading"
      items={experiences.map(mapExperienceToSectionItem)}
      language={language}
      text={text}
      title={title}
    />
  )
}

export default WorkSection

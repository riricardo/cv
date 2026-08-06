import type { Education, Language } from '../../types/index.ts'
import type { ResumeText } from '../../data/resume-translations.ts'
import ExperienceSection, { type ExperienceSectionItem } from './ExperienceSection.tsx'

type EducationSectionProps = {
  education: Education[]
  language: Language
  text: ResumeText
  title: string
}

function mapEducationToSectionItem(education: Education): ExperienceSectionItem {
  return {
    description: education.description,
    endDate: education.endDate,
    highlights: education.highlights,
    id: `${education.institution}-${education.startDate}`,
    location: education.location,
    skills: education.technologies,
    startDate: education.startDate,
    subtitle: education.institution,
    title: education.degree,
  }
}

function EducationSection({ education, language, text, title }: EducationSectionProps) {
  return (
    <ExperienceSection
      headingId="education-heading"
      items={education.map(mapEducationToSectionItem)}
      language={language}
      text={text}
      title={title}
    />
  )
}

export default EducationSection

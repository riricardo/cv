import type { SkillAreaId, SkillAreas } from '../../types/index.ts'
import type { ResumeText } from '../../data/resume-translations.ts'
import SectionTitle from './SectionTitle.tsx'

type SkillsSectionProps = {
  skills: SkillAreas
  text: ResumeText
}

function getSkillEntries(skills: SkillAreas) {
  return Object.entries(skills) as Array<[SkillAreaId, string[]]>
}

function SkillsSection({ skills, text }: SkillsSectionProps) {
  return (
    <section aria-labelledby="skills-heading">
      <SectionTitle id="skills-heading">{text.skills}</SectionTitle>
      <div className="mt-4 space-y-4">
        {getSkillEntries(skills).map(([skillArea, skillNames]) => (
          <section className="skill-category" key={skillArea}>
            <h3 className="skill-category-title">{text.skillAreaTitles[skillArea]}</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {skillNames.map((skillName) => (
                <li className="skill-tag" key={skillName}>
                  {skillName}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}

export default SkillsSection

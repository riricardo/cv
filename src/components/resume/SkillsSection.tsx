import type { SkillAreaId, SkillAreas } from '../../types/index.ts'
import type { ResumeText } from '../../data/resume-translations.ts'
import SectionTitle from './SectionTitle.tsx'

type SkillsSectionProps = {
  skills: SkillAreas
  text: ResumeText
}

const skillAreaIcons = {
  backend: 'fa-code',
  frontend: 'fa-display',
  databases: 'fa-database',
  architecture: 'fa-layer-group',
  tools: 'fa-wrench',
} satisfies Record<SkillAreaId, string>

function getSkillEntries(skills: SkillAreas) {
  return Object.entries(skills) as Array<[SkillAreaId, string[]]>
}

function SkillsSection({ skills, text }: SkillsSectionProps) {
  return (
    <section aria-labelledby="skills-heading">
      <SectionTitle id="skills-heading">{text.skills}</SectionTitle>
      <div className="skill-list mt-5">
        {getSkillEntries(skills).map(([skillArea, skillNames]) => (
          <section className="skill-category" key={skillArea}>
            <h3 className="skill-category-title">
              <span aria-hidden="true" className={`fa-solid ${skillAreaIcons[skillArea]}`} />
              {text.skillAreaTitles[skillArea]}
            </h3>
            <ul className="skill-tags">
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

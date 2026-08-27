import type { SkillCategory } from '../../types/index.ts'
import type { ResumeText } from '../../locales/index.ts'
import SectionTitle from './SectionTitle.tsx'
import SkillTags from './SkillTags.tsx'

type SkillsSectionProps = {
  skillCategories: SkillCategory[]
  text: ResumeText
}

function SkillsSection({ skillCategories, text }: SkillsSectionProps) {
  return (
    <section aria-labelledby="skills-heading">
      <SectionTitle id="skills-heading">{text.skills}</SectionTitle>
      <div className="skill-list mt-5">
        {skillCategories.map((skillCategory) => (
          <section className="skill-category" key={skillCategory.id}>
            <h3 className="skill-category-title">
              <span aria-hidden="true" className={`fa-solid ${skillCategory.icon ?? 'fa-tag'}`} />
              {skillCategory.name}
            </h3>
            <SkillTags items={skillCategory.skills} />
          </section>
        ))}
      </div>
    </section>
  )
}

export default SkillsSection

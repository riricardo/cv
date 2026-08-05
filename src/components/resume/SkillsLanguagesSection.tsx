import type { Skill, SpokenLanguage } from '../../types/index.ts'
import type { ResumeText } from '../../data/resume-translations.ts'
import SectionTitle from './SectionTitle.tsx'

type SkillsLanguagesSectionProps = {
  languages: SpokenLanguage[]
  skills: Skill[]
  text: ResumeText
}

function SkillsLanguagesSection({ languages, skills, text }: SkillsLanguagesSectionProps) {
  return (
    <div className="resume-section mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <section aria-labelledby="skills-heading">
        <SectionTitle id="skills-heading">{text.skills}</SectionTitle>
        <ul className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li className="skill-tag" key={`${skill.name}-${skill.level}`}>
              {skill.name}
              {skill.level ? ` - ${skill.level}` : null}
            </li>
          ))}
        </ul>
      </section>

      {languages.length ? (
        <section aria-labelledby="languages-heading">
          <SectionTitle id="languages-heading">{text.languages}</SectionTitle>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {languages.map((spokenLanguage) => (
              <li
                className="flex items-center gap-2 rounded-2xl border border-base-300/80 bg-base-100/75 px-3 py-2 shadow-sm"
                key={spokenLanguage.name}
              >
                <span aria-hidden="true" className="language-marker">
                  •
                </span>
                {spokenLanguage.name} - {spokenLanguage.level}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

export default SkillsLanguagesSection

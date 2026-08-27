import type { SpokenLanguage } from '../../types/index.ts'
import type { ResumeText } from '../../locales/index.ts'
import SectionTitle from './SectionTitle.tsx'

type LanguagesSectionProps = {
  languages: SpokenLanguage[]
  text: ResumeText
}

function LanguagesSection({ languages, text }: LanguagesSectionProps) {
  if (!languages.length) {
    return null
  }

  return (
    <section aria-labelledby="languages-heading">
      <SectionTitle id="languages-heading">{text.languages}</SectionTitle>
      <ul className="language-list">
        {languages.map((spokenLanguage) => (
          <li className="language-item" key={spokenLanguage.name}>
            <span aria-hidden="true" className="language-marker">
              •
            </span>
            {spokenLanguage.name} - {spokenLanguage.proficiency}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default LanguagesSection

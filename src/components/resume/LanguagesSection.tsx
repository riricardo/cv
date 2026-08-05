import type { SpokenLanguage } from '../../types/index.ts'
import type { ResumeText } from '../../data/resume-translations.ts'
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
  )
}

export default LanguagesSection

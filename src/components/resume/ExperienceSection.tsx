import type { Experience, Language } from '../../types/index.ts'
import PeriodText from './PeriodText.tsx'
import SectionTitle from './SectionTitle.tsx'

type ExperienceSectionProps = {
  experiences: Experience[]
  language: Language
  title: string
}

function ExperienceSection({ experiences, language, title }: ExperienceSectionProps) {
  return (
    <section aria-labelledby="experience-heading" className="resume-section mt-8">
      <SectionTitle id="experience-heading">{title}</SectionTitle>
      <div className="mt-4 grid gap-6">
        {experiences.map((experience) => (
          <article
            className="card w-full min-w-0 break-inside-avoid rounded-2xl border border-base-300/80 bg-base-100/75 shadow-sm backdrop-blur transition hover:-translate-y-px hover:shadow-md"
            key={`${experience.company}-${experience.startDate}`}
          >
            <div className="card-body min-w-0 p-4 sm:p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-950">{experience.role}</h3>
                  <p className="font-semibold text-blue-800">{experience.company}</p>
                </div>
                <PeriodText
                  endDate={experience.endDate}
                  language={language}
                  startDate={experience.startDate}
                />
              </div>
              <p className="mt-2 leading-7 text-slate-700 break-anywhere">
                {experience.description}
              </p>
              {experience.highlights?.length ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                  {experience.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ExperienceSection

import type { Education, Language } from '../../types/index.ts'
import PeriodText from './PeriodText.tsx'
import SectionTitle from './SectionTitle.tsx'

type EducationSectionProps = {
  education: Education[]
  language: Language
  title: string
}

function EducationSection({ education, language, title }: EducationSectionProps) {
  return (
    <section aria-labelledby="education-heading" className="resume-section mt-8">
      <SectionTitle id="education-heading">{title}</SectionTitle>
      <div className="mt-4 grid gap-4">
        {education.map((item) => (
          <article
            className="card w-full min-w-0 break-inside-avoid rounded-2xl border border-base-300/80 bg-base-100/75 shadow-sm backdrop-blur transition hover:-translate-y-px hover:shadow-md"
            key={`${item.institution}-${item.startDate}`}
          >
            <div className="card-body min-w-0 p-4 sm:p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="font-bold text-slate-950">{item.degree}</h3>
                  <p className="font-semibold text-blue-800">{item.institution}</p>
                  {item.location ? <p className="text-sm text-slate-600">{item.location}</p> : null}
                </div>
                <PeriodText endDate={item.endDate} language={language} startDate={item.startDate} />
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-700 break-anywhere">
                {item.description}
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <ul className="mt-4 flex flex-wrap gap-2">
                {item.technologies.map((technology) => (
                  <li className="skill-tag" key={technology}>
                    {technology}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default EducationSection

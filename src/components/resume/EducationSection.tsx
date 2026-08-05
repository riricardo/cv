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
      <div className="mt-4 grid gap-3">
        {education.map((item) => (
          <article
            className="card w-full min-w-0 break-inside-avoid rounded-2xl border border-base-300/80 bg-base-100/75 shadow-sm backdrop-blur"
            key={`${item.institution}-${item.startDate}`}
          >
            <div className="card-body p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="font-bold text-slate-950">{item.degree}</h3>
                  <p className="text-slate-700">{item.institution}</p>
                </div>
                <PeriodText endDate={item.endDate} language={language} startDate={item.startDate} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default EducationSection

import { useId, useRef, useState } from 'react'
import type { Language, ResumeHighlight } from '../../types/index.ts'
import type { ResumeText } from '../../locales/index.ts'
import PeriodText from './PeriodText.tsx'
import SectionTitle from './SectionTitle.tsx'
import SkillTags from './SkillTags.tsx'

type SectionHighlight = string | ResumeHighlight

export type ExperienceSectionItem = {
  description: string
  endDate?: string
  highlights?: SectionHighlight[]
  id: string
  includeInDownload?: boolean
  location?: string
  skills?: string[]
  startDate: string
  subtitle: string
  title: string
}

type ExperienceSectionProps = {
  headingId: string
  items: ExperienceSectionItem[]
  language: Language
  text: ResumeText
  title: string
}

type ExperienceCardProps = {
  item: ExperienceSectionItem
  language: Language
  text: ResumeText
}

function hasHighlights(highlights?: SectionHighlight[]) {
  return Boolean(highlights?.length)
}

function HighlightList({ highlights }: { highlights?: SectionHighlight[] }) {
  if (!highlights?.length) {
    return null
  }

  return (
    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
      {highlights.map((highlight) => (
        <li
          className={
            typeof highlight === 'string' || highlight.includeInDownload
              ? undefined
              : 'download-hidden'
          }
          key={typeof highlight === 'string' ? highlight : highlight.value}
        >
          {typeof highlight === 'string' ? highlight : highlight.value}
        </li>
      ))}
    </ul>
  )
}

function scrollToPosition(top: number) {
  const startTop = window.scrollY
  const distance = top - startTop
  const duration = 700
  const startTime = performance.now()

  function easeOutCubic(progress: number) {
    return 1 - Math.pow(1 - progress, 3)
  }

  function step(currentTime: number) {
    const elapsedTime = currentTime - startTime
    const progress = Math.min(elapsedTime / duration, 1)

    window.scrollTo(0, startTop + distance * easeOutCubic(progress))

    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }

  window.requestAnimationFrame(step)
}

function ExperienceCard({ item, language, text }: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const detailsId = useId()
  const cardRef = useRef<HTMLElement>(null)
  const hasDetails = Boolean(item.location || hasHighlights(item.highlights) || item.skills?.length)

  function handleToggle() {
    if (isExpanded) {
      const shouldRecenterCard = (cardRef.current?.getBoundingClientRect().top ?? 0) < 0

      setIsExpanded(false)

      if (shouldRecenterCard) {
        window.requestAnimationFrame(() => {
          const cardTop = cardRef.current?.getBoundingClientRect().top ?? 0

          scrollToPosition(window.scrollY + cardTop - 70)
        })
      }

      return
    }

    setIsExpanded(true)
  }

  return (
    <article
      className={`card w-full min-w-0 break-inside-avoid rounded-2xl border border-base-300/80 bg-base-100/75 shadow-sm backdrop-blur transition hover:-translate-y-px hover:shadow-md ${
        item.includeInDownload === false ? 'download-hidden' : ''
      }`}
      ref={cardRef}
    >
      <div className="card-body min-w-0 p-4 sm:p-5">
        <div className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
          </div>
          <PeriodText
            endDate={item.endDate}
            language={language}
            presentText={text.present}
            startDate={item.startDate}
          />
          <div className="min-w-0 sm:col-start-1">
            <p className="font-semibold text-blue-800">{item.subtitle}</p>
            {item.location ? (
              <p
                className={`location-text mt-1 expandable-inline-content ${isExpanded ? 'is-expanded' : ''}`}
              >
                {item.location}
              </p>
            ) : null}
          </div>
        </div>
        <p className="mt-2 leading-7 text-slate-700 break-anywhere">{item.description}</p>
        {hasDetails ? (
          <div className={`expandable-content ${isExpanded ? 'is-expanded' : ''}`} id={detailsId}>
            {hasHighlights(item.highlights) ? (
              <HighlightList highlights={item.highlights!} />
            ) : null}
            {item.skills?.length ? (
              <div className="mt-4">
                <SkillTags items={item.skills} />
              </div>
            ) : null}
          </div>
        ) : null}
        {hasDetails ? (
          <button
            aria-controls={detailsId}
            aria-expanded={isExpanded}
            className="expandable-toggle"
            onClick={handleToggle}
            type="button"
          >
            {isExpanded ? text.seeLess : text.seeMore}
            <span
              aria-hidden="true"
              className={`fa-solid fa-chevron-down ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        ) : null}
      </div>
    </article>
  )
}

function ExperienceSection({ headingId, items, language, text, title }: ExperienceSectionProps) {
  return (
    <section aria-labelledby={headingId} className="resume-section mt-8">
      <SectionTitle id={headingId}>{title}</SectionTitle>
      <div className="mt-4 grid gap-6">
        {items.map((item) => (
          <ExperienceCard item={item} key={item.id} language={language} text={text} />
        ))}
      </div>
    </section>
  )
}

export default ExperienceSection

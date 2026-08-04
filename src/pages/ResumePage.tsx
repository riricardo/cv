import { useEffect, useRef } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { contactLinks } from '../data/contact-links.js'
import { languages as languageData } from '../data/languages.js'
import { personalInfo as personalInfoData } from '../data/personal-info.js'
import { portfolioUrl } from '../data/portfolio-url.js'
import { resumes, softwareEnResume } from '../data/resumes/index.js'
import type { Resume } from '../types/resume.js'

const faviconUrl = `${import.meta.env.BASE_URL}favicon.svg`
const profilePhotoUrls = [
  'assets/profile-1.jpg',
  'assets/profile-2.jpg',
  'assets/profile-3.jpg',
].map((path) => `${import.meta.env.BASE_URL}${path}`)

const translations = {
  en: {
    actionsLabel: 'Interactive resume actions',
    interactiveMessage: 'This resume has an interactive version!',
    whyTitle: 'Why Ric?',
    portfolio: 'Portfolio',
    download: 'Download CV',
    downloadAriaLabel: 'Download CV by opening the print dialog',
    downloadTitle: 'Open print dialog without interactive elements',
    summary: 'Professional Summary',
    experience: 'Experience',
    projects: 'Projects',
    skills: 'Skills',
    languages: 'Languages',
    education: 'Education',
    closeWhyDialog: 'Close Why Ric dialog',
    close: 'close',
    present: 'Present',
    repository: 'Repository',
    demo: 'Demo',
  },
  pt: {
    actionsLabel: 'Ações interativas do currículo',
    interactiveMessage: 'Este currículo possui uma versão interativa!',
    whyTitle: 'Por que Ric?',
    portfolio: 'Portfólio',
    download: 'Baixar CV',
    downloadAriaLabel: 'Baixar CV abrindo a janela de impressão',
    downloadTitle: 'Abrir janela de impressão sem elementos interativos',
    summary: 'Resumo Profissional',
    experience: 'Experiência',
    projects: 'Projetos',
    skills: 'Competências',
    languages: 'Idiomas',
    education: 'Formação',
    closeWhyDialog: 'Fechar diálogo Por que Ric',
    close: 'fechar',
    present: 'Atual',
    repository: 'Repositório',
    demo: 'Demo',
  },
} satisfies Record<string, Record<string, string>>

type ContactItem = {
  href?: string
  icon: string
  label: string
}

function isContactItem(item: ContactItem | undefined): item is ContactItem {
  return Boolean(item)
}

function getResumeLanguage(resume: Resume) {
  return resume.language === 'pt' ? 'pt' : 'en'
}

function formatMonthYear(value: string, language: 'en' | 'pt') {
  if (value.toLowerCase() === 'present') {
    return translations[language].present
  }

  const [year, month = '01'] = value.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return new Intl.DateTimeFormat(language === 'pt' ? 'pt-BR' : 'en-US', {
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatPeriod(startDate: string, endDate: string | undefined, language: 'en' | 'pt') {
  const start = formatMonthYear(startDate, language)
  const end = endDate ? formatMonthYear(endDate, language) : translations[language].present

  return `${start} - ${end}`
}

function getMapUrl(location: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
}

function ResumePage() {
  const { resumeId = softwareEnResume.id } = useParams()
  const resume = resumes[resumeId]
  const whyRicDialogRef = useRef<HTMLDialogElement>(null)
  const profilePhotoUrlRef = useRef(
    profilePhotoUrls[Math.floor(Math.random() * profilePhotoUrls.length)],
  )
  const language = resume ? getResumeLanguage(resume) : 'en'

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  if (!resume) {
    return <Navigate replace to={`/${softwareEnResume.id}`} />
  }

  const text = translations[language]
  const personalInfo = language === 'pt' ? personalInfoData.infoPt : personalInfoData.info
  const spokenLanguages =
    language === 'pt'
      ? [languageData.englishPt, languageData.portuguesePt]
      : [languageData.english, languageData.portuguese]
  const globalContactLinks = [contactLinks.github, contactLinks.linkedin]
  const contactItems: ContactItem[] = (
    [
      personalInfo?.email
        ? {
            href: `mailto:${personalInfo.email}`,
            icon: 'fa-solid fa-envelope',
            label: personalInfo.email,
          }
        : undefined,
      personalInfo?.phone
        ? {
            href: `tel:${personalInfo.phone.replaceAll(' ', '')}`,
            icon: 'fa-solid fa-phone',
            label: personalInfo.phone,
          }
        : undefined,
      ...globalContactLinks.map((link) => ({
        href: link.url,
        icon: link.icon ?? 'fa-solid fa-link',
        label: link.label,
      })),
      personalInfo?.nationality
        ? {
            icon: 'fa-solid fa-passport',
            label: personalInfo.nationality,
          }
        : undefined,
    ] satisfies Array<ContactItem | undefined>
  ).filter(isContactItem)

  return (
    <div className="resume-page min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_42%,_#f7f8fb_100%)] px-2 py-3 text-slate-900 sm:px-6 sm:py-4 lg:px-8">
      {resume.settings?.showInteractiveBar !== false ? (
        <aside
          aria-label={text.actionsLabel}
          className="interactive-bar mx-auto mb-2 flex max-w-5xl flex-col gap-3 rounded-2xl border border-base-300/70 bg-base-100/80 p-2.5 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:rounded-3xl"
        >
          <p className="px-2 text-sm font-semibold text-slate-700">👋 {text.interactiveMessage}</p>

          <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:w-auto sm:grid-cols-3">
            <button
              className="toolbar-button"
              onClick={() => whyRicDialogRef.current?.showModal()}
              type="button"
            >
              <img alt="" className="h-4 w-4" src={faviconUrl} />
              {text.whyTitle}
            </button>
            {resume.settings?.showPortfolio !== false ? (
              <a className="toolbar-button" href={portfolioUrl} rel="noreferrer" target="_blank">
                <span aria-hidden="true" className="fa-solid fa-code" />
                {text.portfolio}
              </a>
            ) : null}
            <button
              aria-label={text.downloadAriaLabel}
              className="toolbar-button toolbar-button-primary"
              onClick={() => window.print()}
              title={text.downloadTitle}
              type="button"
            >
              <span aria-hidden="true" className="fa-solid fa-download" />
              {text.download}
            </button>
          </div>
        </aside>
      ) : null}

      <main className="resume-document card mx-auto w-full max-w-5xl min-w-0 rounded-2xl border border-base-300/80 bg-base-100/80 shadow-xl ring-1 ring-base-300/70 backdrop-blur-xl sm:rounded-[2rem]">
        <div className="resume-document-content min-w-0 px-4 py-5 sm:px-8 md:px-10 md:py-8">
          <header className="min-w-0 overflow-hidden rounded-2xl border border-base-300/80 bg-[linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.9)_55%,_rgba(241,245,249,0.72))] p-4 shadow-sm sm:rounded-[1.5rem] sm:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="role-tag">
                    <span aria-hidden="true" className="fa-solid fa-briefcase" />
                    {resume.targetRole}
                  </span>
                  {personalInfo?.location ? (
                    <a
                      className="info-pill"
                      href={getMapUrl(personalInfo.location)}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span aria-hidden="true" className="fa-solid fa-location-dot text-blue-800" />
                      {personalInfo.location}
                    </a>
                  ) : null}
                </div>

                <div className="profile-name-row mt-4">
                  <div className="profile-photo interactive-only">
                    <img alt={personalInfo.name} src={profilePhotoUrlRef.current} />
                  </div>

                  <div className="min-w-0">
                    <h1 className="text-4xl font-bold leading-tight text-slate-950 break-anywhere sm:text-5xl">
                      {personalInfo?.name}
                    </h1>
                  </div>
                </div>

                <p className="profile-summary mt-4 max-w-2xl text-base leading-7 text-slate-700">
                  {resume.professionalSummary}
                </p>
              </div>

              <ul className="grid w-full min-w-0 gap-2 text-sm text-slate-700 md:w-auto md:min-w-64">
                {contactItems.map((item) => (
                  <li key={item.label}>
                    {'href' in item && item.href ? (
                      <a
                        className="grid grid-cols-[1.5rem_minmax(0,1fr)] items-center gap-2 rounded-2xl border border-base-300/70 bg-base-100/65 px-3 py-2 text-slate-700 underline-offset-4 shadow-sm transition hover:-translate-y-px hover:bg-base-100 hover:text-blue-800 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                        href={item.href}
                        rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                      >
                        <span
                          aria-hidden="true"
                          className={`${item.icon} text-center text-blue-800`}
                        />
                        <span className="min-w-0 break-anywhere">{item.label}</span>
                      </a>
                    ) : (
                      <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] items-center gap-2 rounded-2xl border border-base-300/70 bg-base-100/65 px-3 py-2 text-slate-700 shadow-sm">
                        <span
                          aria-hidden="true"
                          className={`${item.icon} text-center text-blue-800`}
                        />
                        <span className="min-w-0 break-anywhere">{item.label}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </header>

          <section aria-labelledby="summary-heading" className="resume-section mt-7">
            <h2 className="resume-section-title" id="summary-heading">
              {text.summary}
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
              {resume.professionalSummary}
            </p>
          </section>

          <section aria-labelledby="experience-heading" className="resume-section mt-8">
            <h2 className="resume-section-title" id="experience-heading">
              {text.experience}
            </h2>
            <div className="mt-4 grid gap-6">
              {resume.experience.map((experience) => (
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
                      <p className="text-sm font-medium text-slate-500">
                        {formatPeriod(experience.startDate, experience.endDate, language)}
                      </p>
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

          {resume.settings?.showProjects !== false ? (
            <section aria-labelledby="projects-heading" className="resume-section mt-8">
              <h2 className="resume-section-title" id="projects-heading">
                {text.projects}
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {resume.projects.map((project) => (
                  <article
                    className="card w-full min-w-0 break-inside-avoid rounded-2xl border border-base-300/80 bg-base-100/75 shadow-sm backdrop-blur transition hover:-translate-y-px hover:shadow-md"
                    key={project.name}
                  >
                    <div className="card-body min-w-0 p-4 sm:p-5">
                      <h3 className="font-bold text-slate-950">{project.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-700 break-anywhere">
                        {project.description}
                      </p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-blue-800 break-anywhere">
                        {project.technologies.join(' / ')}
                      </p>
                      {project.repositoryUrl || project.demoUrl ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.repositoryUrl ? (
                            <a
                              className="toolbar-button"
                              href={project.repositoryUrl}
                              rel="noreferrer"
                              target="_blank"
                            >
                              <span aria-hidden="true" className="fa-brands fa-github" />
                              {text.repository}
                            </a>
                          ) : null}
                          {project.demoUrl ? (
                            <a
                              className="toolbar-button"
                              href={project.demoUrl}
                              rel="noreferrer"
                              target="_blank"
                            >
                              <span
                                aria-hidden="true"
                                className="fa-solid fa-arrow-up-right-from-square"
                              />
                              {text.demo}
                            </a>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <div className="resume-section mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <section aria-labelledby="skills-heading">
              <h2 className="resume-section-title" id="skills-heading">
                {text.skills}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <li className="skill-tag" key={`${skill.name}-${skill.level}`}>
                    {skill.name}
                    {skill.level ? ` - ${skill.level}` : null}
                  </li>
                ))}
              </ul>
            </section>

            {spokenLanguages.length ? (
              <section aria-labelledby="languages-heading">
                <h2 className="resume-section-title" id="languages-heading">
                  {text.languages}
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {spokenLanguages.map((spokenLanguage) => (
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

          <section aria-labelledby="education-heading" className="resume-section mt-8">
            <h2 className="resume-section-title" id="education-heading">
              {text.education}
            </h2>
            <div className="mt-4 grid gap-3">
              {resume.education.map((item) => (
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
                      <p className="text-sm font-medium text-slate-500">
                        {formatPeriod(item.startDate, item.endDate, language)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <dialog className="modal" ref={whyRicDialogRef}>
        <div className="modal-box relative w-[calc(100vw-1.5rem)] max-w-none lg:max-w-2xl max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain bg-base-100/90 p-0 shadow-2xl ring-1 ring-base-300 backdrop-blur">
          <form method="dialog">
            <button
              aria-label={text.closeWhyDialog}
              className="btn btn-circle btn-ghost btn-sm absolute top-2.5 right-3 z-10"
              type="submit"
            >
              <span aria-hidden="true" className="fa-solid fa-xmark" />
            </button>
          </form>
          <div className="p-5 sm:p-6">
            <h2 className="resume-section-title pr-10">
              <span className="inline-flex items-center gap-2">
                <img alt="" className="h-5 w-5" src={faviconUrl} />
                {text.whyTitle}
              </span>
            </h2>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
              {resume.whyText.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        <form className="modal-backdrop" method="dialog">
          <button type="submit">{text.close}</button>
        </form>
      </dialog>
    </div>
  )
}

export default ResumePage

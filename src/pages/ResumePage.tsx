import { useRef } from 'react'

const faviconUrl = `${import.meta.env.BASE_URL}favicon.svg`

const contactItems = [
  {
    href: 'mailto:alex.morgan@example.com',
    icon: 'fa-solid fa-envelope',
    label: 'alex.morgan@example.com',
  },
  {
    href: 'tel:+35310000000',
    icon: 'fa-solid fa-phone',
    label: '+353 1 000 0000',
  },
  {
    href: 'https://github.com/example',
    icon: 'fa-brands fa-github',
    label: 'github.com/example',
  },
  {
    href: 'https://www.linkedin.com/',
    icon: 'fa-brands fa-linkedin',
    label: 'LinkedIn',
  },
  {
    icon: 'fa-solid fa-passport',
    label: 'Brazilian / Italian',
  },
]

const experiences = [
  {
    company: 'Northstar Labs',
    role: 'Frontend Engineer',
    period: '2022 - Present',
    description:
      'Builds accessible React interfaces for internal tools used by product and operations teams.',
    highlights: [
      'Improved reusable component patterns across product surfaces.',
      'Partnered with designers to ship clearer workflows for complex data entry.',
      'Reduced UI regressions by tightening TypeScript usage and review habits.',
    ],
  },
  {
    company: 'Blue Ridge Studio',
    role: 'Web Developer',
    period: '2020 - 2022',
    description: 'Delivered responsive websites and lightweight dashboards for service businesses.',
    highlights: [
      'Created fast, mobile-first pages with semantic HTML and modern CSS.',
      'Maintained shared design tokens across multiple client projects.',
    ],
  },
]

const projects = [
  {
    name: 'Interactive CV Platform',
    description: 'Prototype for a reusable online resume system with multiple tailored versions.',
    technologies: ['React', 'TypeScript', 'Vite'],
  },
  {
    name: 'Operations Dashboard',
    description: 'Internal dashboard concept for monitoring task queues and delivery health.',
    technologies: ['React', 'Tailwind CSS', 'REST APIs'],
  },
]

const skills = [
  'React',
  'TypeScript',
  'JavaScript',
  'HTML',
  'CSS',
  'Tailwind CSS',
  'Accessibility',
  'Git',
  'Vite',
  'REST APIs',
]

const education = [
  {
    institution: 'Example Institute of Technology',
    degree: 'Diploma in Software Development',
    period: '2018 - 2020',
  },
]

const languages = ['English - Professional', 'Portuguese - Native']

function ResumePage() {
  const whyRicDialogRef = useRef<HTMLDialogElement>(null)

  return (
    <div className="resume-page min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_42%,_#f7f8fb_100%)] px-2 py-3 text-slate-900 sm:px-6 sm:py-4 lg:px-8">
      <aside
        aria-label="Interactive resume actions"
        className="interactive-bar mx-auto mb-2 flex max-w-5xl flex-col gap-3 rounded-2xl border border-base-300/70 bg-base-100/80 p-2.5 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:rounded-3xl"
      >
        <p className="px-2 text-sm font-semibold text-slate-700">
          👋 Este currículo possui uma versão interativa!
        </p>

        <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:w-auto sm:grid-cols-3">
          <button
            className="toolbar-button"
            onClick={() => whyRicDialogRef.current?.showModal()}
            type="button"
          >
            <img alt="" className="h-4 w-4" src={faviconUrl} />
            Why Ric?
          </button>
          <a
            className="toolbar-button"
            href="https://riricardo.github.io/portfolio/"
            rel="noreferrer"
            target="_blank"
          >
            <span aria-hidden="true" className="fa-solid fa-code" />
            Portfolio
          </a>
          <button
            aria-label="Download CV by opening the print dialog"
            className="toolbar-button toolbar-button-primary"
            onClick={() => window.print()}
            title="Open print dialog without interactive elements"
            type="button"
          >
            <span aria-hidden="true" className="fa-solid fa-download" />
            Download CV
          </button>
        </div>
      </aside>

      <main className="resume-document card mx-auto w-full max-w-5xl min-w-0 rounded-2xl border border-base-300/80 bg-base-100/80 shadow-xl ring-1 ring-base-300/70 backdrop-blur-xl sm:rounded-[2rem]">
        <div className="resume-document-content min-w-0 px-4 py-5 sm:px-8 md:px-10 md:py-8">
          <header className="min-w-0 overflow-hidden rounded-2xl border border-base-300/80 bg-[linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.9)_55%,_rgba(241,245,249,0.72))] p-4 shadow-sm sm:rounded-[1.5rem] sm:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 max-w-3xl">
                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="role-tag">
                        <span aria-hidden="true" className="fa-solid fa-briefcase" />
                        Frontend Software Engineer
                      </span>
                      <a
                        className="info-pill"
                        href="https://www.google.com/maps/search/?api=1&query=Dublin%2C%20Ireland"
                        rel="noreferrer"
                        target="_blank"
                      >
                        <span
                          aria-hidden="true"
                          className="fa-solid fa-location-dot text-blue-800"
                        />
                        Dublin, Ireland
                      </a>
                    </div>
                    <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-950 break-anywhere sm:text-5xl">
                      Alex Morgan
                    </h1>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
                      Frontend engineer focused on polished, maintainable and accessible web
                      interfaces.
                    </p>
                  </div>

                  <div className="profile-photo interactive-only">
                    <span aria-hidden="true" className="fa-solid fa-user" />
                  </div>
                </div>
              </div>

              <ul className="grid w-full min-w-0 gap-2 text-sm text-slate-700 md:w-auto md:min-w-64">
                {contactItems.map((item) => (
                  <li key={item.label}>
                    {item.href ? (
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
              Professional Summary
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
              Frontend engineer focused on building maintainable, accessible and reliable web
              interfaces. Comfortable working across product, design and engineering to turn
              practical needs into polished user experiences.
            </p>
          </section>

          <section aria-labelledby="experience-heading" className="resume-section mt-8">
            <h2 className="resume-section-title" id="experience-heading">
              Experience
            </h2>
            <div className="mt-4 grid gap-6">
              {experiences.map((experience) => (
                <article
                  className="card w-full min-w-0 break-inside-avoid rounded-2xl border border-base-300/80 bg-base-100/75 shadow-sm backdrop-blur transition hover:-translate-y-px hover:shadow-md"
                  key={experience.company}
                >
                  <div className="card-body min-w-0 p-4 sm:p-5">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-950">{experience.role}</h3>
                        <p className="font-semibold text-blue-800">{experience.company}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-500">{experience.period}</p>
                    </div>
                    <p className="mt-2 leading-7 text-slate-700 break-anywhere">
                      {experience.description}
                    </p>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                      {experience.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="projects-heading" className="resume-section mt-8">
            <h2 className="resume-section-title" id="projects-heading">
              Projects
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
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
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="resume-section mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <section aria-labelledby="skills-heading">
              <h2 className="resume-section-title" id="skills-heading">
                Skills
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li className="skill-tag" key={skill}>
                    {skill}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="languages-heading">
              <h2 className="resume-section-title" id="languages-heading">
                Languages
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {languages.map((language) => (
                  <li
                    className="flex items-center gap-2 rounded-2xl border border-base-300/80 bg-base-100/75 px-3 py-2 shadow-sm"
                    key={language}
                  >
                    <span aria-hidden="true" className="language-marker">
                      •
                    </span>
                    {language}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section aria-labelledby="education-heading" className="resume-section mt-8">
            <h2 className="resume-section-title" id="education-heading">
              Education
            </h2>
            <div className="mt-4 grid gap-3">
              {education.map((item) => (
                <article
                  className="card w-full min-w-0 break-inside-avoid rounded-2xl border border-base-300/80 bg-base-100/75 shadow-sm backdrop-blur"
                  key={item.institution}
                >
                  <div className="card-body p-5">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <div>
                        <h3 className="font-bold text-slate-950">{item.degree}</h3>
                        <p className="text-slate-700">{item.institution}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-500">{item.period}</p>
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
              aria-label="Close Why Ric dialog"
              className="btn btn-circle btn-ghost btn-sm absolute top-2.5 right-3 z-10"
              type="submit"
            >
              <span aria-hidden="true" className="fa-solid fa-xmark" />
            </button>
          </form>
          <div className="mt-4 mr-14 ml-4 h-1.5 rounded-full bg-linear-to-r from-blue-700/70 via-blue-500/35 to-slate-300" />
          <div className="p-5 sm:p-6">
            <h2 className="pr-10 text-xl font-bold text-slate-950">Why Ric?</h2>

            <p className="mt-4 text-sm leading-relaxed text-slate-700">
              Ric likes interfaces that are practical, calm and useful. This resume keeps the
              traditional CV readable while adding small interactive paths for context, portfolio
              work and quick actions.
            </p>
          </div>
        </div>
        <form className="modal-backdrop" method="dialog">
          <button type="submit">close</button>
        </form>
      </dialog>
    </div>
  )
}

export default ResumePage

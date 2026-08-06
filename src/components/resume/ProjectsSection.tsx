import type { Project } from '../../types/index.ts'
import type { ResumeText } from '../../data/resume-translations.ts'
import SectionTitle from './SectionTitle.tsx'

type ProjectsSectionProps = {
  projects: Project[]
  text: ResumeText
}

function ProjectsSection({ projects, text }: ProjectsSectionProps) {
  return (
    <section aria-labelledby="projects-heading" className="resume-section mt-8">
      <SectionTitle id="projects-heading">{text.projects}</SectionTitle>
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
              <p className="project-technologies">{project.technologies.join(' / ')}</p>
              {project.repositoryUrl || project.demoUrl ? (
                <div className="project-links">
                  {project.repositoryUrl ? (
                    <a
                      className="project-link toolbar-button"
                      href={project.repositoryUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span aria-hidden="true" className="fa-brands fa-github" />
                      <span className="project-link-label">{text.repository}</span>
                      <span className="project-link-print-label">{project.repositoryUrl}</span>
                    </a>
                  ) : null}
                  {project.demoUrl ? (
                    <a
                      className="project-link toolbar-button"
                      href={project.demoUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span aria-hidden="true" className="fa-solid fa-arrow-up-right-from-square" />
                      <span className="project-link-label">{text.demo}</span>
                      <span className="project-link-print-label">{project.demoUrl}</span>
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ProjectsSection

import type { ResumeText } from '../../data/resume-translations.ts'

type ResumeActionBarProps = {
  faviconUrl: string
  onWhyClick: () => void
  portfolioUrl: string
  text: ResumeText
}

function ResumeActionBar({ faviconUrl, onWhyClick, portfolioUrl, text }: ResumeActionBarProps) {
  return (
    <aside
      aria-label={text.actionsLabel}
      className="interactive-bar mx-auto mb-2 flex max-w-5xl flex-col gap-3 rounded-2xl border border-base-300/70 bg-base-100/80 p-2.5 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:rounded-3xl"
    >
      <p className="px-2 text-sm font-semibold text-slate-700">👋 {text.interactiveMessage}</p>

      <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:w-auto sm:grid-cols-3">
        <button className="toolbar-button" onClick={onWhyClick} type="button">
          <img alt="" className="h-4 w-4" src={faviconUrl} />
          {text.whyTitle}
        </button>
        <a className="toolbar-button" href={portfolioUrl} rel="noreferrer" target="_blank">
          <span aria-hidden="true" className="fa-solid fa-code" />
          {text.portfolio}
        </a>
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
  )
}

export default ResumeActionBar

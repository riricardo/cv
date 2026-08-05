import type { RefObject } from 'react'
import type { ResumeText } from '../../data/resume-translations.ts'

type WhyMeDialogProps = {
  dialogRef: RefObject<HTMLDialogElement | null>
  faviconUrl: string
  text: ResumeText
  whyText: string[]
}

function WhyMeDialog({ dialogRef, faviconUrl, text, whyText }: WhyMeDialogProps) {
  return (
    <dialog className="modal" ref={dialogRef}>
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
            {whyText.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
      <form className="modal-backdrop" method="dialog">
        <button type="submit">{text.close}</button>
      </form>
    </dialog>
  )
}

export default WhyMeDialog

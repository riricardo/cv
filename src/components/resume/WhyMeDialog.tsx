import type { RefObject } from 'react'
import type { ResumeText } from '../../locales/index.ts'

type WhyMeDialogProps = {
  dialogRef: RefObject<HTMLDialogElement | null>
  faviconUrl: string
  text: ResumeText
  title: string
  whyText: string | string[]
}

function WhyMeDialog({ dialogRef, faviconUrl, text, title, whyText }: WhyMeDialogProps) {
  const paragraphs = Array.isArray(whyText) ? whyText : [whyText]

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box relative max-h-[calc(100dvh-1.5rem)] w-[calc(100vw-1.5rem)] max-w-none overflow-y-auto bg-base-100/90 p-0 shadow-2xl ring-1 ring-base-300 backdrop-blur lg:max-w-2xl">
        <form method="dialog">
          <button
            aria-label={`${text.close} ${title}`}
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
              {title}
            </span>
          </h2>

          <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
            {paragraphs.map((paragraph, index) => (
              <p className="whitespace-pre-line" key={`${paragraph}-${index}`}>
                {paragraph}
              </p>
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

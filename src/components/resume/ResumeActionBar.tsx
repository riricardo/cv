import { useState } from 'react'
import type { ResumeText } from '../../locales/index.ts'

type ResumeActionBarProps = {
  faviconUrl: string
  fileName: string
  onWhyClick: () => void
  portfolioUrl: string
  text: ResumeText
  whyTitle: string
}

function ResumeActionBar({
  faviconUrl,
  fileName,
  onWhyClick,
  portfolioUrl,
  text,
  whyTitle,
}: ResumeActionBarProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

  async function downloadPdf() {
    const resumeDocument = document.querySelector<HTMLElement>('.resume-document')
    if (!resumeDocument || isGeneratingPdf) return

    setIsGeneratingPdf(true)
    document.documentElement.classList.add('pdf-exporting')

    try {
      await document.fonts.ready
      const { default: html2pdf } = await import('html2pdf.js')
      await html2pdf()
        .set({
          filename: `${sanitizeFileName(fileName)}.pdf`,
          margin: [8, 8, 8, 8],
          image: { type: 'jpeg', quality: 0.98 },
          enableLinks: true,
          html2canvas: {
            backgroundColor: '#ffffff',
            scale: 2,
            scrollX: 0,
            scrollY: 0,
            useCORS: true,
            windowWidth: 1120,
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(resumeDocument)
        .save()
    } catch (error) {
      console.error('PDF generation failed.', error)
      window.alert('Could not generate the PDF. Please try again.')
    } finally {
      document.documentElement.classList.remove('pdf-exporting')
      setIsGeneratingPdf(false)
    }
  }

  return (
    <aside
      aria-label={text.actionsLabel}
      className="interactive-bar mx-auto mb-2 flex max-w-5xl flex-col gap-3 rounded-2xl border border-base-300/70 bg-base-100/80 p-2.5 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:rounded-3xl"
    >
      <p className="px-2 text-sm font-semibold text-slate-700">👋 {text.interactiveMessage}</p>

      <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:w-auto sm:grid-cols-3">
        <button className="toolbar-button" onClick={onWhyClick} type="button">
          <img alt="" className="h-4 w-4" src={faviconUrl} />
          {whyTitle}
        </button>
        <a className="toolbar-button" href={portfolioUrl} rel="noreferrer" target="_blank">
          <span aria-hidden="true" className="fa-solid fa-code" />
          {text.portfolio}
        </a>
        <button
          aria-label={text.downloadAriaLabel}
          className="toolbar-button toolbar-button-primary"
          disabled={isGeneratingPdf}
          onClick={downloadPdf}
          title={text.downloadTitle}
          type="button"
        >
          <span
            aria-hidden="true"
            className={`fa-solid ${isGeneratingPdf ? 'fa-spinner fa-spin' : 'fa-download'}`}
          />
          {isGeneratingPdf ? 'Generating PDF...' : text.download}
        </button>
      </div>
    </aside>
  )
}

function sanitizeFileName(value: string) {
  const sanitized = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return sanitized || 'cv'
}

export default ResumeActionBar

import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import {
  EducationSection,
  ProjectsSection,
  ResumeActionBar,
  ResumeHeader,
  SectionTitle,
  LanguagesSection,
  SkillsSection,
  WorkSection,
  WhyMeDialog,
} from '../components/resume/index.ts'
import { getRandomProfilePhotoUrl, resumeAssets } from '../constants/assets.ts'
import { defaultLocale, locales } from '../locales/index.ts'
import { fetchResumeByLink, hasApiBaseUrl } from '../services/api.ts'
import type { Resume } from '../types/index.ts'

type ResumePageProps = {
  resumeId: string
}

type ApiResumeState =
  { status: 'loading' } | { status: 'ready'; resume: Resume } | { status: 'error'; message: string }

const apiRequestTimeoutMs = 10_000

function ResumePage({ resumeId }: ResumePageProps) {
  const [apiResumeState, setApiResumeState] = useState<ApiResumeState>({ status: 'loading' })
  const [requestAttempt, setRequestAttempt] = useState(0)
  const whyMeDialogRef = useRef<HTMLDialogElement>(null)
  const profilePhotoUrlRef = useRef(getRandomProfilePhotoUrl())

  useEffect(() => {
    if (!hasApiBaseUrl()) {
      setApiResumeState({
        status: 'error',
        message: 'VITE_API_BASE_URL is not configured.',
      })
      return
    }

    let isDisposed = false
    let didTimeout = false
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => {
      didTimeout = true
      controller.abort()
    }, apiRequestTimeoutMs)

    setApiResumeState({ status: 'loading' })

    fetchResumeByLink(resumeId, controller.signal)
      .then((apiResume) => {
        if (!isDisposed) {
          setApiResumeState({ status: 'ready', resume: apiResume })
        }
      })
      .catch((error: unknown) => {
        if (!isDisposed) {
          setApiResumeState({
            status: 'error',
            message: didTimeout
              ? 'The API took too long to respond.'
              : error instanceof Error
                ? error.message
                : 'Resume API request failed.',
          })
        }
      })
      .finally(() => {
        window.clearTimeout(timeoutId)
      })

    return () => {
      isDisposed = true
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [requestAttempt, resumeId])

  useEffect(() => {
    if (apiResumeState.status !== 'ready') {
      return
    }

    document.documentElement.lang = apiResumeState.resume.language
    document.title = apiResumeState.resume.personalInfo.pageTitle
  }, [apiResumeState])

  if (apiResumeState.status === 'loading') {
    return (
      <ResumePageShell>
        <StatusMessage tone="info" title="Loading resume from API..." />
      </ResumePageShell>
    )
  }

  if (apiResumeState.status === 'error') {
    return (
      <ResumePageShell>
        <StatusMessage
          action={
            <button
              className="btn btn-sm mt-4"
              onClick={() => setRequestAttempt((value) => value + 1)}
            >
              Try again
            </button>
          }
          message={apiResumeState.message}
          tone="error"
          title="Resume unavailable"
        />
      </ResumePageShell>
    )
  }

  const resume = apiResumeState.resume
  const language = resume.language
  const text = locales[language] ?? defaultLocale
  const personalInfo = resume.personalInfo

  return (
    <ResumePageShell>
      <ResumeActionBar
        faviconUrl={resumeAssets.faviconUrl}
        onWhyClick={() => whyMeDialogRef.current?.showModal()}
        portfolioUrl={personalInfo.portfolioUrl}
        text={text}
        whyTitle={personalInfo.whyTitle}
      />

      <main className="resume-document card mx-auto w-full max-w-5xl min-w-0 rounded-2xl border border-base-300/80 bg-base-100/80 shadow-xl ring-1 ring-base-300/70 backdrop-blur-xl sm:rounded-4xl">
        <div className="resume-document-content min-w-0 px-4 py-5 sm:px-8 md:px-10 md:py-8">
          <ResumeHeader personalInfo={personalInfo} profilePhotoUrl={profilePhotoUrlRef.current} />

          <section aria-labelledby="summary-heading" className="resume-section mt-7">
            <SectionTitle id="summary-heading">{text.summary}</SectionTitle>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
              {resume.professionalSummary}
            </p>
          </section>

          <WorkSection
            experiences={resume.experience}
            language={language}
            text={text}
            title={text.experience}
          />

          <ProjectsSection projects={resume.projects} text={text} />

          <div className="resume-section mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <SkillsSection skillCategories={resume.skillCategories} text={text} />
            <LanguagesSection languages={resume.spokenLanguages} text={text} />
          </div>

          <EducationSection
            education={resume.education}
            language={language}
            text={text}
            title={text.education}
          />
        </div>
      </main>

      <WhyMeDialog
        dialogRef={whyMeDialogRef}
        faviconUrl={resumeAssets.faviconUrl}
        text={text}
        title={personalInfo.whyTitle}
        whyText={resume.whyText}
      />
    </ResumePageShell>
  )
}

function ResumePageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="resume-page min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#eef4ff_42%,#f7f8fb_100%)] px-2 py-3 text-slate-900 sm:px-6 sm:py-4 lg:px-8">
      {children}
    </div>
  )
}

function StatusMessage({
  action,
  message,
  title,
  tone,
}: {
  action?: React.ReactNode
  message?: string
  title: string
  tone: 'error' | 'info'
}) {
  const [showDetails, setShowDetails] = useState(false)
  const classes =
    tone === 'error'
      ? 'border-rose-200 bg-rose-50 text-rose-900'
      : 'border-blue-100 bg-blue-50 text-blue-900'

  return (
    <main
      className={`mx-auto mt-12 max-w-2xl rounded-lg border px-5 py-4 shadow-sm ${classes}`}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <h1 className="text-base font-bold">{title}</h1>
      {message ? (
        <>
          <button
            aria-expanded={showDetails}
            className="btn btn-ghost btn-xs mt-2 px-0"
            onClick={() => setShowDetails((value) => !value)}
            type="button"
          >
            {showDetails ? 'Hide details' : 'Details'}
          </button>
          {showDetails ? <p className="mt-2 text-sm leading-6">{message}</p> : null}
        </>
      ) : null}
      {action ? <div>{action}</div> : null}
    </main>
  )
}

export default ResumePage

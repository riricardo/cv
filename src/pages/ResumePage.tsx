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
import { readEditableCollections } from '../data/edit/collectionStore.ts'
import { getResume } from '../data/resumes/index.ts'
import { defaultLocale, locales } from '../locales/index.ts'

type ResumePageProps = {
  resumeId?: string
}

function ResumePage({ resumeId }: ResumePageProps) {
  const [collections, setCollections] = useState(readEditableCollections)
  const resume = getResume(resumeId, collections)
  const language = resume.language
  const whyMeDialogRef = useRef<HTMLDialogElement>(null)
  const profilePhotoUrlRef = useRef(getRandomProfilePhotoUrl())

  useEffect(() => {
    function refreshCollections() {
      setCollections(readEditableCollections())
    }

    window.addEventListener('storage', refreshCollections)
    window.addEventListener('cv-edit-collections-changed', refreshCollections)

    return () => {
      window.removeEventListener('storage', refreshCollections)
      window.removeEventListener('cv-edit-collections-changed', refreshCollections)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const text = locales[language] ?? defaultLocale
  const personalInfo = resume.personalInfo

  useEffect(() => {
    document.title = personalInfo.pageTitle
  }, [personalInfo.pageTitle])

  return (
    <div className="resume-page min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#eef4ff_42%,#f7f8fb_100%)] px-2 py-3 text-slate-900 sm:px-6 sm:py-4 lg:px-8">
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
    </div>
  )
}

export default ResumePage

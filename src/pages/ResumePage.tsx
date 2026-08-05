import { useEffect, useRef } from 'react'
import {
  EducationSection,
  ExperienceSection,
  ProjectsSection,
  ResumeActionBar,
  ResumeHeader,
  SectionTitle,
  SkillsLanguagesSection,
  WhyMeDialog,
} from '../components/resume/index.ts'
import { getRandomProfilePhotoUrl, resumeAssets } from '../constants/assets.ts'
import { languages } from '../data/languages.ts'
import { personalInfo as personalInfoData } from '../data/personal-info.ts'
import { resumeTranslations } from '../data/resume-translations.ts'
import { getResume } from '../data/resumes/index.ts'

type ResumePageProps = {
  resumeId?: string
}

function ResumePage({ resumeId }: ResumePageProps) {
  const resume = getResume(resumeId)
  const language = resume.language
  const whyMeDialogRef = useRef<HTMLDialogElement>(null)
  const profilePhotoUrlRef = useRef(getRandomProfilePhotoUrl())

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const text = resumeTranslations[language]
  const personalInfo = personalInfoData[language]
  const spokenLanguages = languages[language]

  return (
    <div className="resume-page min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#eef4ff_42%,#f7f8fb_100%)] px-2 py-3 text-slate-900 sm:px-6 sm:py-4 lg:px-8">
      <ResumeActionBar
        faviconUrl={resumeAssets.faviconUrl}
        onWhyClick={() => whyMeDialogRef.current?.showModal()}
        portfolioUrl={personalInfo.portfolioUrl}
        text={text}
      />

      <main className="resume-document card mx-auto w-full max-w-5xl min-w-0 rounded-2xl border border-base-300/80 bg-base-100/80 shadow-xl ring-1 ring-base-300/70 backdrop-blur-xl sm:rounded-4xl">
        <div className="resume-document-content min-w-0 px-4 py-5 sm:px-8 md:px-10 md:py-8">
          <ResumeHeader
            personalInfo={personalInfo}
            profilePhotoUrl={profilePhotoUrlRef.current}
            resume={resume}
          />

          <section aria-labelledby="summary-heading" className="resume-section mt-7">
            <SectionTitle id="summary-heading">{text.summary}</SectionTitle>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
              {resume.professionalSummary}
            </p>
          </section>

          <ExperienceSection
            experiences={resume.experience}
            language={language}
            title={text.experience}
          />

          <ProjectsSection projects={resume.projects} text={text} />

          <SkillsLanguagesSection languages={spokenLanguages} skills={resume.skills} text={text} />

          <EducationSection
            education={resume.education}
            language={language}
            title={text.education}
          />
        </div>
      </main>

      <WhyMeDialog
        dialogRef={whyMeDialogRef}
        faviconUrl={resumeAssets.faviconUrl}
        text={text}
        whyText={resume.whyText}
      />
    </div>
  )
}

export default ResumePage

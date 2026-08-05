import { useEffect } from 'react'
import { defaultResumeId, resumes } from './data/resumes/index.ts'
import ResumePage from './pages/ResumePage.tsx'

const basename = '/cv'

function getResumeIdFromPath(pathname: string) {
  const routePath = pathname.startsWith(`${basename}/`)
    ? pathname.slice(basename.length)
    : pathname === basename
      ? '/'
      : pathname
  const resumeId = decodeURIComponent(routePath.split('/').filter(Boolean)[0] ?? '')

  return resumeId in resumes ? resumeId : defaultResumeId
}

function App() {
  const resumeId = getResumeIdFromPath(window.location.pathname)

  useEffect(() => {
    const expectedPath = `${basename}/${resumeId}`

    if (window.location.pathname !== expectedPath) {
      window.history.replaceState(null, '', expectedPath)
    }
  }, [resumeId])

  return <ResumePage resumeId={resumeId} />
}

export default App

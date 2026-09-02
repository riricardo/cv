import { useEffect, useState } from 'react'
import { Redirect, Route, Switch, useParams } from 'react-router-dom'
import { readEditableCollections } from './data/edit/collectionStore.ts'
import { defaultResumeId, resumes } from './data/resumes/index.ts'
import EditPage from './pages/EditPage.tsx'
import ResumePage from './pages/ResumePage.tsx'

function ResumeRoute() {
  const { resumeId } = useParams<{ resumeId?: string }>()
  const [collections, setCollections] = useState(readEditableCollections)
  const editedResumeIds = new Set(
    collections.resumes.flatMap((resume) => [resume.id, resume.linkId]),
  )

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

  if (!resumeId || (!(resumeId in resumes) && !editedResumeIds.has(resumeId))) {
    return <Redirect to={`/${defaultResumeId}`} />
  }

  return <ResumePage key={resumeId} resumeId={resumeId} />
}

function App() {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to={`/${defaultResumeId}`} />
      </Route>
      <Route exact path="/edit">
        <EditPage />
      </Route>
      <Route exact path="/edit/:sectionId">
        <EditPage />
      </Route>
      <Route exact path="/edit/:sectionId/:documentId">
        <EditPage />
      </Route>
      <Route path="/:resumeId">
        <ResumeRoute />
      </Route>
      <Route path="*">
        <Redirect to={`/${defaultResumeId}`} />
      </Route>
    </Switch>
  )
}

export default App

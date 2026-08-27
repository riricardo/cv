import { Redirect, Route, Switch, useParams } from 'react-router-dom'
import { defaultResumeId, resumes } from './data/resumes/index.ts'
import EditPage from './pages/EditPage.tsx'
import ResumePage from './pages/ResumePage.tsx'

function ResumeRoute() {
  const { resumeId } = useParams<{ resumeId?: string }>()

  if (!resumeId || !(resumeId in resumes)) {
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

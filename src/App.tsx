import { Redirect, Route, Switch, useParams } from 'react-router-dom'
import { defaultResumeId, resumes } from './data/resumes/index.ts'
import ResumePage from './pages/ResumePage.tsx'

function ResumeRoute() {
  const { resumeId } = useParams<{ resumeId?: string }>()

  if (!resumeId || !(resumeId in resumes)) {
    return <Redirect to={`/${defaultResumeId}`} />
  }

  return <ResumePage resumeId={resumeId} />
}

function App() {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to={`/${defaultResumeId}`} />
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

import { Navigate, Route, Routes } from 'react-router-dom'
import ResumePage from './pages/ResumePage.js'

function App() {
  return (
    <Routes>
      <Route element={<Navigate replace to="/software-en" />} path="/" />
      <Route element={<ResumePage />} path="/:resumeId" />
      <Route element={<Navigate replace to="/software-en" />} path="*" />
    </Routes>
  )
}

export default App

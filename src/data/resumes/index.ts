import { finnEnResume } from './finn-en.ts'
import { softwareEnResume } from './software-en.ts'
import { softwarePtResume } from './software-pt.ts'

export const resumes = {
  [finnEnResume.id]: finnEnResume,
  [softwareEnResume.id]: softwareEnResume,
  [softwarePtResume.id]: softwarePtResume,
}

type ResumeId = keyof typeof resumes

export const defaultResumeId = softwareEnResume.id

export function getResume(resumeId: string = defaultResumeId) {
  return resumes[resumeId as ResumeId] ?? resumes[defaultResumeId]
}

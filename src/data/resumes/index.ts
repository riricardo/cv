import { softwareEnResume } from './software-en.ts'
import { softwarePtResume } from './software-pt.ts'

export const resumes = {
  [softwareEnResume.id]: softwareEnResume,
  [softwarePtResume.id]: softwarePtResume,
}

type ResumeId = keyof typeof resumes

export const defaultResumeId = softwareEnResume.id

export function getResume(resumeId: string = defaultResumeId) {
  return resumes[resumeId as ResumeId] ?? resumes[defaultResumeId]
}

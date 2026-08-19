import type { ExperienceProfile, ExperienceProfileHighlight } from '../../types/index.ts'

function highlights(indexes: number[], includeInDownload = true): ExperienceProfileHighlight[] {
  return indexes.map((index) => ({
    includeInDownload,
    index,
  }))
}

export const erpBackendEnProfile: ExperienceProfile = {
  linx: highlights([0, 1, 2, 3, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 20]),
  syshouse: highlights([0, 1, 6, 7, 8, 9, 10, 11, 12]),
}

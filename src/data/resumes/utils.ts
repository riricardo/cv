import type {
  CatalogExperience,
  Experience,
  ExperienceProfileHighlight,
  ResumeHighlight,
} from '../../types/index.ts'

export type HighlightSelection = ExperienceProfileHighlight[]

/**
 * Finds an experience item by ID in a catalog list and converts it into a finalized Experience object.
 *
 * @param experiences Array of experience items
 * @param id The experience ID (e.g. 'linx')
 * @returns Finalized Experience object ready for a resume
 */
export function getExperience(
  experiences: CatalogExperience[],
  id: string,
  selection?: HighlightSelection,
): Experience {
  const exp = findExperience(experiences, id)

  return {
    ...exp,
    highlights: pickHighlights(exp, selection),
  }
}

/**
 * Converts an entire list of catalog experiences into finalized Experience objects with all highlights.
 */
export function getExperiences(experiences: CatalogExperience[]): Experience[] {
  return experiences.map((exp) => getExperience(experiences, exp.id))
}

function findExperience(experiences: CatalogExperience[], id: string): CatalogExperience {
  const exp = experiences.find((item) => item.id === id)
  if (!exp) {
    throw new Error(`Experience with id "${id}" was not found.`)
  }

  return exp
}

function pickHighlights(exp: CatalogExperience, selection?: HighlightSelection): ResumeHighlight[] {
  if (!exp.highlights) return []

  if (selection === undefined) {
    return exp.highlights.map((highlight) => ({
      includeInDownload: true,
      value: highlight.value,
    }))
  }

  const selectedHighlights: ResumeHighlight[] = []

  for (const selected of selection) {
    const highlight = exp.highlights[selected.index]
    if (!highlight) {
      throw new Error(
        `Highlight index "${selected.index}" was not found in experience "${exp.id}".`,
      )
    }

    selectedHighlights.push({
      includeInDownload: selected.includeInDownload,
      value: highlight.value,
    })
  }

  return selectedHighlights
}

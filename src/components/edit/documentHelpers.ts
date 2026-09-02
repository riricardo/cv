import type { EditableRecord, EditSection } from '../../types/edit.ts'

export function findDocument(section: EditSection, routeId: string) {
  return (
    section.documents.find((document) => document.id === routeId) ??
    section.documents.find(
      (document) => hasUniqueLanguageRoute(section, document) && document.language === routeId,
    )
  )
}

export function getDocumentRouteId(_section: EditSection, document: EditableRecord) {
  return document.id
}

export function getDocumentTitle(document: EditableRecord) {
  return (
    document.name ??
    document.role ??
    document.institution ??
    document.degree ??
    document.professionalDescription ??
    document.id
  )
}

export function getDocumentSubtitle(document: EditableRecord) {
  return (
    document.company ??
    document.description ??
    document.professionalSummary ??
    document.translationGroupId ??
    document.id
  )
}

export function formatKey(key: string) {
  if (key === 'linkId') {
    return 'Link ID'
  }

  if (key === 'publicLink') {
    return 'Public link'
  }

  return key
    .replace(/Ids$/, 's')
    .replace(/Id$/, '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (letter) => letter.toUpperCase())
}

export function isReferenceField(key?: string) {
  return Boolean(key && key !== 'linkId' && /Id(s)?$/.test(key))
}

export function shouldDisplayField(key: string) {
  return !['id', 'translationGroupId'].includes(key)
}

export function canEditField(sectionId: string, key: string) {
  return (
    sectionId !== 'profiles' && !['version', 'createdAt', 'updatedAt', 'publicLink'].includes(key)
  )
}

function hasUniqueLanguageRoute(section: EditSection, document: EditableRecord) {
  return (
    Boolean(document.language) &&
    section.documents.filter((item) => item.language === document.language).length === 1
  )
}

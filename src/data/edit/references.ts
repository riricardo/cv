import type { EditableRecord, JsonValue } from '../../types/edit.ts'
import { editSections } from './sections.ts'

const referenceRecords = buildReferenceRecords()

export function getReferencedRecord(id: string) {
  return referenceRecords.get(id)
}

export function getReferenceTitle(record: EditableRecord) {
  return (
    getStringValue(record.value) ??
    getStringValue(record.name) ??
    getRoleTitle(record) ??
    getStringValue(record.institution) ??
    getStringValue(record.degree) ??
    getStringValue(record.professionalDescription) ??
    record.id
  )
}

export function getReferenceSubtitle(record: EditableRecord) {
  return (
    getStringValue(record.company) ??
    getStringValue(record.description) ??
    getStringValue(record.professionalSummary) ??
    getStringValue(record.category) ??
    getStringValue(record.translationGroupId)
  )
}

function buildReferenceRecords() {
  const records = new Map<string, EditableRecord>()

  for (const section of editSections) {
    for (const document of section.documents) {
      records.set(document.id, document)
      addNestedReferenceRecords(records, document)
    }
  }

  return records
}

function addNestedReferenceRecords(records: Map<string, EditableRecord>, value: JsonValue) {
  if (Array.isArray(value)) {
    for (const item of value) {
      addNestedReferenceRecords(records, item)
    }
    return
  }

  if (!value || typeof value !== 'object') {
    return
  }

  if (typeof value.id === 'string') {
    records.set(value.id, value as EditableRecord)
  }

  for (const nestedValue of Object.values(value)) {
    if (nestedValue !== undefined) {
      addNestedReferenceRecords(records, nestedValue)
    }
  }
}

function getRoleTitle(record: EditableRecord) {
  const role = getStringValue(record.role)
  const company = getStringValue(record.company)

  if (role && company) {
    return `${role} at ${company}`
  }

  return role
}

function getStringValue(value: JsonValue | undefined) {
  return typeof value === 'string' && value.trim() ? value : undefined
}

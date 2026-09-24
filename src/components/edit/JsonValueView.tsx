import type React from 'react'
import { Link } from 'react-router-dom'
import type { EditableRecord, JsonObject, JsonValue } from '../../types/edit.ts'
import {
  getReferencedRecord,
  getReferenceSubtitle,
  getReferenceTitle,
} from '../../data/edit/references.ts'
import { formatEditDate } from './dateFormatting.ts'
import { formatKey, isReferenceField, shouldDisplayField } from './documentHelpers.ts'
import { useEditActions } from './editActionsContextValue.ts'

function JsonValueView({
  canEdit = false,
  documentId,
  fieldKey,
  sectionId = 'edit',
  value,
}: {
  canEdit?: boolean
  documentId?: string
  fieldKey?: string
  sectionId?: string
  value: JsonValue | undefined
}): React.ReactNode {
  const { sections } = useEditActions()

  if (value === undefined || value === null) {
    return <span className="text-slate-400">-</span>
  }

  if (fieldKey === 'whyText' && Array.isArray(value)) {
    return <span className="break-anywhere whitespace-pre-line">{value.join('\n\n')}</span>
  }

  if (sectionId === 'profiles' && Array.isArray(value)) {
    if (fieldKey === 'experiences') {
      return (
        <ProfileExperiencesValue
          canEdit={canEdit}
          documentId={documentId}
          experiences={value}
          sections={sections}
        />
      )
    }

    if (['educationIds', 'projectIds', 'skillIds', 'spokenLanguageIds'].includes(fieldKey ?? '')) {
      return <ProfileReferencesValue ids={value} sections={sections} />
    }
  }

  if (Array.isArray(value)) {
    if (!value.length) {
      return <span className="text-slate-400">[]</span>
    }

    return (
      <ul className="space-y-2">
        {value.map((item, index) => (
          <li className="break-anywhere rounded-md bg-slate-50 p-3" key={index}>
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <JsonValueView
                  canEdit={false}
                  documentId={documentId}
                  fieldKey={fieldKey}
                  sectionId={sectionId}
                  value={item}
                />
              </div>
              {canEdit ? (
                <ItemInlineActions
                  documentId={documentId}
                  fieldKey={fieldKey}
                  index={index}
                  sectionId={sectionId}
                  value={item}
                />
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    )
  }

  if (typeof value === 'object') {
    return (
      <dl className="space-y-2">
        {Object.entries(value)
          .filter(([key]) => shouldDisplayField(key))
          .map(([key, nestedValue]) => (
            <div className="grid gap-1 sm:grid-cols-[10rem_1fr]" key={key}>
              <dt className="break-anywhere font-bold text-slate-600">{formatKey(key)}</dt>
              <dd className="min-w-0">
                <JsonValueView
                  canEdit={canEdit}
                  documentId={documentId}
                  fieldKey={key}
                  sectionId={sectionId}
                  value={nestedValue}
                />
              </dd>
            </div>
          ))}
      </dl>
    )
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }

  if (typeof value === 'string') {
    if (fieldKey === 'whyText') {
      return <span className="break-anywhere whitespace-pre-line">{value}</span>
    }

    if (fieldKey === 'publicLink') {
      return (
        <Link
          className="break-anywhere font-bold text-blue-800 hover:text-blue-950"
          to={`/${value}`}
        >
          /#/{value}
        </Link>
      )
    }

    const formattedDate = formatEditDate(fieldKey, value)

    if (formattedDate) {
      return <span className="break-anywhere">{formattedDate}</span>
    }
  }

  if (typeof value === 'string' && isReferenceField(fieldKey)) {
    const referencedRecord =
      sections.flatMap((section) => section.documents).find((document) => document.id === value) ??
      getReferencedRecord(value)

    if (referencedRecord) {
      return <ReferenceCard record={referencedRecord} />
    }
  }

  return <span className="break-anywhere">{value}</span>
}

function ProfileReferencesValue({
  ids,
  sections,
}: {
  ids: JsonValue[]
  sections: ReturnType<typeof useEditActions>['sections']
}) {
  const records = sections.flatMap((section) => section.documents)

  if (!ids.length) return <span className="text-slate-400">None selected</span>

  return (
    <ul className="space-y-2">
      {ids.map((id) => {
        const record = records.find((candidate) => candidate.id === id)
        return record ? (
          <li key={String(id)}>
            <ReferenceCard record={record} />
          </li>
        ) : null
      })}
    </ul>
  )
}

function ProfileExperiencesValue({
  canEdit,
  documentId,
  experiences,
  sections,
}: {
  canEdit: boolean
  documentId?: string
  experiences: JsonValue[]
  sections: ReturnType<typeof useEditActions>['sections']
}) {
  const records = sections.find((section) => section.id === 'experience')?.documents ?? []

  if (!experiences.length) return <span className="text-slate-400">None selected</span>

  return (
    <ul className="space-y-2">
      {experiences.map((item, index) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) return null

        const profileExperience = item as JsonObject
        const experience = records.find(
          (candidate) => candidate.id === String(profileExperience.experienceId ?? ''),
        )
        if (!experience) return null

        const highlights = getSelectedHighlightLabels(experience, profileExperience)

        return (
          <li className="rounded-md bg-slate-50 p-3" key={experience.id}>
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900">{getReferenceTitle(experience)}</p>
                {highlights.length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-600">
                    {highlights.map(({ id, value }) => (
                      <li className="break-anywhere" key={id}>
                        {value}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">No highlights selected</p>
                )}
              </div>
              {canEdit ? (
                <ItemInlineActions
                  documentId={documentId}
                  fieldKey="experiences"
                  index={index}
                  sectionId="profiles"
                  value={item}
                />
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function getSelectedHighlightLabels(experience: EditableRecord, profileExperience: JsonObject) {
  const selectedIds = Array.isArray(profileExperience.highlightIds)
    ? profileExperience.highlightIds.filter((id): id is string => typeof id === 'string')
    : []
  const highlights = Array.isArray(experience.highlights) ? experience.highlights : []

  return selectedIds.flatMap((id) => {
    const highlight = highlights.find(
      (candidate) =>
        candidate &&
        typeof candidate === 'object' &&
        !Array.isArray(candidate) &&
        candidate.id === id,
    )

    return highlight && typeof highlight === 'object' && !Array.isArray(highlight)
      ? [{ id, value: String(highlight.value ?? id) }]
      : []
  })
}

function ItemInlineActions({
  documentId,
  fieldKey,
  index,
  sectionId,
  value,
}: {
  documentId?: string
  fieldKey?: string
  index: number
  sectionId: string
  value: JsonValue
}) {
  const { openDeleteConfirmation, openEditModal } = useEditActions()
  const label = `${formatKey(fieldKey ?? 'Item')} ${index + 1}`
  const canEditItem = fieldKey !== 'skillIds'

  return (
    <div className="flex shrink-0 gap-2">
      {canEditItem ? (
        <button
          aria-label={`Edit ${label}`}
          className="edit-icon-button"
          onClick={() =>
            openEditModal({
              action: 'edit',
              documentId,
              fieldKey,
              itemIndex: index,
              label,
              sectionId,
              value,
            })
          }
          type="button"
        >
          <span aria-hidden="true" className="fa-solid fa-pen" />
        </button>
      ) : null}
      <button
        aria-label={`Delete ${label}`}
        className="edit-icon-button edit-icon-button-danger"
        onClick={() =>
          openDeleteConfirmation({
            action: 'delete',
            documentId,
            fieldKey,
            itemIndex: index,
            label,
            sectionId,
            value,
          })
        }
        type="button"
      >
        <span aria-hidden="true" className="fa-solid fa-trash" />
      </button>
    </div>
  )
}

function ReferenceCard({ record }: { record: ReturnType<typeof getReferencedRecord> }) {
  if (!record) {
    return null
  }

  const subtitle = getReferenceSubtitle(record)

  return (
    <div className="rounded-md bg-slate-50 px-3 py-2">
      <p className="break-anywhere font-bold text-slate-900">{getReferenceTitle(record)}</p>
      {subtitle ? (
        <p className="break-anywhere mt-1 text-xs leading-5 text-slate-600">{subtitle}</p>
      ) : null}
    </div>
  )
}

export default JsonValueView

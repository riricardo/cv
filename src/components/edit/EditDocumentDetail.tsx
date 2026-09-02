import type { EditableRecord, EditSection } from '../../types/edit.ts'
import type { JsonValue } from '../../types/edit.ts'
import { canEditField, formatKey, getDocumentTitle, shouldDisplayField } from './documentHelpers.ts'
import { useEditActions } from './editActionsContextValue.ts'
import EditShell from './EditShell.tsx'
import JsonValueView from './JsonValueView.tsx'

function EditDocumentDetail({
  document,
  section,
}: {
  document: EditableRecord
  section: EditSection
}) {
  const { openDeleteConfirmation, openEditModal } = useEditActions()
  const entries = getDisplayEntries(section, document)
  const canEditDocument = section.id !== 'profiles'

  return (
    <EditShell
      eyebrow={section.title}
      title={getDocumentTitle(document)}
      backTo={`/edit/${section.id}`}
    >
      <dl className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white/88 shadow-sm">
        {entries.map(([key, value]) => (
          <div className="grid gap-2 p-4 md:grid-cols-[13rem_1fr]" key={key}>
            <dt className="break-anywhere text-sm font-bold text-slate-700">
              <span>{formatKey(key)}</span>
              {canEditField(section.id, key) ? (
                <span className="mt-2 flex gap-2">
                  {shouldShowAddButton(section.id, key, value) ? (
                    <button
                      aria-label={`Add ${formatKey(key)} item`}
                      className="edit-icon-button"
                      onClick={() =>
                        openEditModal({
                          action: 'add',
                          documentId: document.id,
                          fieldKey: key,
                          label: `Add ${formatKey(key)} item`,
                          sectionId: section.id,
                          value,
                        })
                      }
                      type="button"
                    >
                      <span aria-hidden="true" className="fa-solid fa-plus" />
                    </button>
                  ) : null}
                  {shouldShowFieldEditButton(key, value) ? (
                    <button
                      aria-label={`Edit ${formatKey(key)}`}
                      className="edit-icon-button"
                      onClick={() =>
                        openEditModal({
                          action: 'edit',
                          documentId: document.id,
                          fieldKey: key,
                          label: formatKey(key),
                          sectionId: section.id,
                          value,
                        })
                      }
                      type="button"
                    >
                      <span aria-hidden="true" className="fa-solid fa-pen" />
                    </button>
                  ) : null}
                  {shouldShowFieldDeleteButton(key, value) ? (
                    <button
                      aria-label={`Delete ${formatKey(key)}`}
                      className="edit-icon-button edit-icon-button-danger"
                      onClick={() =>
                        openDeleteConfirmation({
                          action: 'delete',
                          documentId: document.id,
                          fieldKey: key,
                          label: formatKey(key),
                          sectionId: section.id,
                          value,
                        })
                      }
                      type="button"
                    >
                      <span aria-hidden="true" className="fa-solid fa-trash" />
                    </button>
                  ) : null}
                </span>
              ) : null}
            </dt>
            <dd className="min-w-0 text-sm leading-6 text-slate-800">
              <JsonValueView
                canEdit={canEditDocument && canEditField(section.id, key)}
                documentId={document.id}
                fieldKey={key}
                sectionId={section.id}
                value={value}
              />
            </dd>
          </div>
        ))}
      </dl>
    </EditShell>
  )
}

function shouldShowAddButton(sectionId: string, key: string, value: JsonValue | undefined) {
  return Array.isArray(value) && !(sectionId === 'resumes' && key === 'whyText')
}

function shouldShowFieldEditButton(key: string, value: JsonValue | undefined) {
  return !Array.isArray(value) || key === 'whyText'
}

function shouldShowFieldDeleteButton(key: string, value: JsonValue | undefined) {
  return !Array.isArray(value) || key === 'whyText'
}

function getDisplayEntries(section: EditSection, document: EditableRecord) {
  const entries: [string, JsonValue | undefined][] = []

  for (const [key, value] of Object.entries(document)) {
    if (!shouldDisplayField(key)) {
      continue
    }

    entries.push([key, value])

    if (section.id === 'resumes' && key === 'linkId' && typeof value === 'string') {
      entries.push(['publicLink', value])
    }
  }

  return entries
}

export default EditDocumentDetail

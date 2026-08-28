import type { EditableRecord, EditSection } from '../../types/edit.ts'
import type { JsonValue } from '../../types/edit.ts'
import { formatKey, getDocumentTitle, shouldDisplayField } from './documentHelpers.ts'
import EditShell from './EditShell.tsx'
import JsonValueView from './JsonValueView.tsx'

function EditDocumentDetail({
  document,
  section,
}: {
  document: EditableRecord
  section: EditSection
}) {
  const entries = getDisplayEntries(section, document)

  return (
    <EditShell
      eyebrow={section.title}
      title={getDocumentTitle(document)}
      backTo={`/edit/${section.id}`}
    >
      <dl className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white/88 shadow-sm">
        {entries.map(([key, value]) => (
          <div className="grid gap-2 p-4 md:grid-cols-[13rem_1fr]" key={key}>
            <dt className="break-anywhere text-sm font-bold text-slate-700">{formatKey(key)}</dt>
            <dd className="min-w-0 text-sm leading-6 text-slate-800">
              <JsonValueView fieldKey={key} value={value} />
            </dd>
          </div>
        ))}
      </dl>
    </EditShell>
  )
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

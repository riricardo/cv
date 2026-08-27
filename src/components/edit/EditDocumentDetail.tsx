import type { EditableRecord, EditSection } from '../../types/edit.ts'
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
  return (
    <EditShell
      eyebrow={section.title}
      title={getDocumentTitle(document)}
      backTo={`/edit/${section.id}`}
    >
      <dl className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white/88 shadow-sm">
        {Object.entries(document)
          .filter(([key]) => shouldDisplayField(key))
          .map(([key, value]) => (
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

export default EditDocumentDetail

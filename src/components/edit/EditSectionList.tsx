import { Link } from 'react-router-dom'
import type { EditSection } from '../../types/edit.ts'
import { getDocumentRouteId, getDocumentSubtitle, getDocumentTitle } from './documentHelpers.ts'
import { useEditActions } from './editActionsContextValue.ts'
import EditShell from './EditShell.tsx'
import LanguageBadge from './LanguageBadge.tsx'

function EditSectionList({ section }: { section: EditSection }) {
  const { openActionModal } = useEditActions()
  const canEdit = section.id !== 'profiles'

  return (
    <EditShell
      addLabel={canEdit ? `Add ${section.title}` : undefined}
      addSectionId={section.id}
      backTo="/edit"
      eyebrow="Collection"
      title={section.title}
    >
      <div className="space-y-3">
        {section.documents.map((document) => {
          const viewTo = `/edit/${section.id}/${getDocumentRouteId(section, document)}`
          const content = (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 text-left">
                <h2 className="break-anywhere text-base font-bold leading-6 text-slate-950">
                  {getDocumentTitle(document)}
                </h2>
                <p className="break-anywhere mt-1 text-sm leading-6 text-slate-600">
                  {getDocumentSubtitle(document)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {document.language ? <LanguageBadge language={document.language} /> : null}
                <span
                  aria-hidden="true"
                  className="fa-solid fa-chevron-right text-sm text-slate-400 transition group-hover:text-blue-700"
                />
              </div>
            </div>
          )

          return canEdit ? (
            <div
              className="group flex gap-2 rounded-lg border border-slate-200 bg-white/88 p-4 shadow-sm transition hover:border-blue-300 hover:bg-white hover:shadow-md"
              key={document.id}
            >
              <Link className="min-w-0 flex-1" to={viewTo}>
                {content}
              </Link>
              <button
                aria-label={`Open actions for ${getDocumentTitle(document)}`}
                className="edit-icon-button shrink-0"
                onClick={() =>
                  openActionModal({
                    action: 'item',
                    documentId: document.id,
                    label: getDocumentTitle(document),
                    sectionId: section.id,
                    value: document,
                    viewTo,
                  })
                }
                type="button"
              >
                <span aria-hidden="true" className="fa-solid fa-ellipsis" />
              </button>
            </div>
          ) : (
            <Link
              className="group block rounded-lg border border-slate-200 bg-white/88 p-4 shadow-sm transition hover:border-blue-300 hover:bg-white hover:shadow-md"
              key={document.id}
              to={viewTo}
            >
              {content}
            </Link>
          )
        })}
      </div>
    </EditShell>
  )
}

export default EditSectionList

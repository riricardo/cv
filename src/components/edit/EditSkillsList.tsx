import { Link } from 'react-router-dom'
import type { EditSection } from '../../types/edit.ts'
import { groupSkillsByFixedType } from '../../data/edit/skillTypes.ts'
import { useEditActions } from './editActionsContextValue.ts'
import EditShell from './EditShell.tsx'
import { getDocumentTitle } from './documentHelpers.ts'

function EditSkillsList({ section }: { section: EditSection }) {
  const { openActionModal } = useEditActions()
  const groups = groupSkillsByFixedType(section.documents)

  return (
    <EditShell
      addLabel="Add Skill"
      addSectionId={section.id}
      backTo="/edit"
      eyebrow="Collection"
      title={section.title}
    >
      <div className="space-y-6">
        {groups.map((group) =>
          group.skills.length ? (
            <section key={group.id}>
              <h2 className="text-sm font-bold uppercase tracking-normal text-slate-500">
                {group.title}
              </h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {group.skills.map((skill) => {
                  const viewTo = `/edit/${section.id}/${skill.id}`

                  return (
                    <div
                      className="flex items-center gap-2 rounded-md bg-slate-50 px-4 py-3"
                      key={skill.id}
                    >
                      <Link className="min-w-0 flex-1" to={viewTo}>
                        <p className="break-anywhere text-sm font-bold text-slate-900">
                          {getDocumentTitle(skill)}
                        </p>
                      </Link>
                      <button
                        aria-label={`Open actions for ${getDocumentTitle(skill)}`}
                        className="edit-icon-button shrink-0"
                        onClick={() =>
                          openActionModal({
                            action: 'item',
                            documentId: skill.id,
                            label: getDocumentTitle(skill),
                            sectionId: section.id,
                            value: skill,
                            viewTo,
                          })
                        }
                        type="button"
                      >
                        <span aria-hidden="true" className="fa-solid fa-ellipsis" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          ) : null,
        )}
      </div>
    </EditShell>
  )
}

export default EditSkillsList

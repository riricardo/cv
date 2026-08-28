import type { EditSection } from '../../types/edit.ts'
import { groupSkillsByFixedType } from '../../data/edit/skillTypes.ts'
import EditShell from './EditShell.tsx'
import { getDocumentTitle } from './documentHelpers.ts'

function EditSkillsList({ section }: { section: EditSection }) {
  const groups = groupSkillsByFixedType(section.documents)

  return (
    <EditShell eyebrow="Collection" title={section.title} backTo="/edit">
      <div className="space-y-6">
        {groups.map((group) =>
          group.skills.length ? (
            <section key={group.id}>
              <h2 className="text-sm font-bold uppercase tracking-normal text-slate-500">
                {group.title}
              </h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {group.skills.map((skill) => (
                  <div className="rounded-md bg-slate-50 px-4 py-3" key={skill.id}>
                    <p className="break-anywhere text-sm font-bold text-slate-900">
                      {getDocumentTitle(skill)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null,
        )}
      </div>
    </EditShell>
  )
}

export default EditSkillsList

import { Link } from 'react-router-dom'
import type { EditSection } from '../../types/edit.ts'
import EditShell from './EditShell.tsx'

function EditHome({ sections }: { sections: EditSection[] }) {
  return (
    <EditShell eyebrow="Configuration" title="Edit CV" backTo="/">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <Link
            className="group rounded-lg border border-slate-200 bg-white/88 p-4 text-left shadow-sm transition hover:border-blue-300 hover:bg-white hover:shadow-md"
            key={section.id}
            to={`/edit/${section.id}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-base font-bold leading-6 text-slate-950">{section.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{section.description}</p>
              </div>
              <span
                aria-hidden="true"
                className="fa-solid fa-chevron-right mt-1 text-sm text-slate-400 transition group-hover:text-blue-700"
              />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-normal text-slate-500">
              {section.documents.length} items
            </p>
          </Link>
        ))}
      </div>
    </EditShell>
  )
}

export default EditHome

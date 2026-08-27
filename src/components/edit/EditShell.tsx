import type React from 'react'
import { Link } from 'react-router-dom'

type EditShellProps = {
  backTo: string
  children: React.ReactNode
  eyebrow: string
  title: string
}

function EditShell({ backTo, children, eyebrow, title }: EditShellProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#eef4ff_42%,#f7f8fb_100%)] px-3 py-4 text-slate-900 sm:px-6 lg:px-8">
      <main className="mx-auto w-full max-w-6xl">
        <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-normal text-blue-800">{eyebrow}</p>
            <h1 className="break-anywhere mt-1 text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">
              {title}
            </h1>
          </div>
          <Link
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/88 px-3 text-sm font-bold text-slate-700 shadow-sm hover:border-blue-300 hover:text-blue-800"
            to={backTo}
          >
            <span aria-hidden="true" className="fa-solid fa-arrow-left" />
            Back
          </Link>
        </header>
        {children}
      </main>
    </div>
  )
}

export default EditShell

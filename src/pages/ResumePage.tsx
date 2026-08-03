import { Link, useParams } from 'react-router-dom'

function ResumePage() {
  const { resumeId } = useParams<{ resumeId: string }>()

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 p-6">
      <section className="card w-full max-w-xl bg-base-100 shadow-xl">
        <div className="card-body gap-6">
          <div className="space-y-2">
            <h1 className="card-title text-3xl">Resume</h1>
            {resumeId ? (
              <p className="text-lg">Resume: {resumeId}</p>
            ) : (
              <p className="text-base-content/70">Nenhum currículo foi selecionado.</p>
            )}
          </div>

          <div className="card-actions">
            <Link className="btn btn-outline" to="/">
              Voltar ao início
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ResumePage

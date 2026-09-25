import { useEffect } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { EditActionsProvider } from '../components/edit/EditActionsContext.tsx'
import EditDocumentDetail from '../components/edit/EditDocumentDetail.tsx'
import EditHome from '../components/edit/EditHome.tsx'
import EditSectionList from '../components/edit/EditSectionList.tsx'
import EditSkillsList from '../components/edit/EditSkillsList.tsx'
import LoadingState from '../components/LoadingState.tsx'
import { findDocument } from '../components/edit/documentHelpers.ts'
import { useEditActions } from '../components/edit/editActionsContextValue.ts'

function EditPage() {
  return (
    <EditActionsProvider>
      <EditPageContent />
    </EditActionsProvider>
  )
}

function EditPageContent() {
  const { isLoading, loadError, loginValue, openLoginModal, retryLoad, sections } = useEditActions()
  const { sectionId, documentId } = useParams<{ sectionId?: string; documentId?: string }>()
  const section = sectionId ? sections.find((item) => item.id === sectionId) : undefined
  const selectedDocument = section && documentId ? findDocument(section, documentId) : undefined

  useEffect(() => {
    document.title = section ? `${section.title} | Edit CV` : 'Edit CV'
  }, [section])

  if (!loginValue.trim()) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-4">
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-bold text-white shadow-md hover:bg-blue-800"
          onClick={openLoginModal}
          type="button"
        >
          <span aria-hidden="true" className="fa-solid fa-right-to-bracket" />
          Login
        </button>
      </main>
    )
  }

  if (isLoading) {
    return <LoadingState fullScreen label="Loading..." />
  }

  if (loadError) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-4 text-slate-900">
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-white p-5 shadow-sm">
          <h1 className="font-bold">Could not load editor data</h1>
          <p className="mt-2 break-words text-sm leading-6 text-slate-600">{loadError}</p>
          <button className="btn btn-sm mt-4" onClick={retryLoad} type="button">
            Try again
          </button>
        </div>
      </main>
    )
  }

  if (!sectionId) {
    return <EditHome sections={sections} />
  }

  if (!section) {
    return <Redirect to="/edit" />
  }

  if (!documentId) {
    if (section.id === 'skills') {
      return <EditSkillsList section={section} />
    }

    return <EditSectionList section={section} />
  }

  if (!selectedDocument) {
    return <Redirect to={`/edit/${section.id}`} />
  }

  return <EditDocumentDetail document={selectedDocument} section={section} />
}

export default EditPage

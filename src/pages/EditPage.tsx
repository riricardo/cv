import { useEffect } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { EditActionsProvider } from '../components/edit/EditActionsContext.tsx'
import EditDocumentDetail from '../components/edit/EditDocumentDetail.tsx'
import EditHome from '../components/edit/EditHome.tsx'
import EditSectionList from '../components/edit/EditSectionList.tsx'
import EditSkillsList from '../components/edit/EditSkillsList.tsx'
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
  const { sections } = useEditActions()
  const { sectionId, documentId } = useParams<{ sectionId?: string; documentId?: string }>()
  const section = sectionId ? sections.find((item) => item.id === sectionId) : undefined
  const selectedDocument = section && documentId ? findDocument(section, documentId) : undefined

  useEffect(() => {
    document.title = section ? `${section.title} | Edit CV` : 'Edit CV'
  }, [section])

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

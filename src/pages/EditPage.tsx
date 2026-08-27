import { Redirect, useParams } from 'react-router-dom'
import EditDocumentDetail from '../components/edit/EditDocumentDetail.tsx'
import EditHome from '../components/edit/EditHome.tsx'
import EditSectionList from '../components/edit/EditSectionList.tsx'
import { findDocument } from '../components/edit/documentHelpers.ts'
import { editSections, editSectionsById } from '../data/edit/sections.ts'

function EditPage() {
  const { sectionId, documentId } = useParams<{ sectionId?: string; documentId?: string }>()

  if (!sectionId) {
    return <EditHome sections={editSections} />
  }

  const section = editSectionsById.get(sectionId)
  if (!section) {
    return <Redirect to="/edit" />
  }

  if (!documentId) {
    return <EditSectionList section={section} />
  }

  const document = findDocument(section, documentId)
  if (!document) {
    return <Redirect to={`/edit/${section.id}`} />
  }

  return <EditDocumentDetail document={document} section={section} />
}

export default EditPage

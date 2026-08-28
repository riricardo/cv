import { useEffect } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import EditDocumentDetail from '../components/edit/EditDocumentDetail.tsx'
import EditHome from '../components/edit/EditHome.tsx'
import EditSectionList from '../components/edit/EditSectionList.tsx'
import EditSkillsList from '../components/edit/EditSkillsList.tsx'
import { findDocument } from '../components/edit/documentHelpers.ts'
import { editSections, editSectionsById } from '../data/edit/sections.ts'

function EditPage() {
  const { sectionId, documentId } = useParams<{ sectionId?: string; documentId?: string }>()
  const section = sectionId ? editSectionsById.get(sectionId) : undefined
  const selectedDocument = section && documentId ? findDocument(section, documentId) : undefined

  useEffect(() => {
    document.title = section ? `${section.title} | Edit CV` : 'Edit CV'
  }, [section])

  if (!sectionId) {
    return <EditHome sections={editSections} />
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

import { createContext, useContext } from 'react'
import type { EditActionTarget, EditToast, JsonValue } from '../../types/edit.ts'
import type { EditSection } from '../../types/edit.ts'

export type EditActionsContextValue = {
  activeTarget?: EditActionTarget
  closeActionModal: () => void
  closeConfirmModal: () => void
  closeEditModal: () => void
  closeLoginModal: () => void
  confirmTarget?: EditActionTarget
  editTarget?: EditActionTarget
  sections: EditSection[]
  loginValue: string
  openActionModal: (target: EditActionTarget) => void
  openAddModal: (sectionId: string, label: string) => void
  openDeleteConfirmation: (target: EditActionTarget) => void
  openEditModal: (target: EditActionTarget) => void
  openLoginModal: () => void
  runConfirmedDelete: () => void
  runEditSave: (value: JsonValue) => void
  saveLogin: (value: string) => void
  toast?: EditToast
}

export const EditActionsContext = createContext<EditActionsContextValue | undefined>(undefined)

export function useEditActions() {
  const context = useContext(EditActionsContext)

  if (!context) {
    throw new Error('useEditActions must be used inside EditActionsProvider.')
  }

  return context
}

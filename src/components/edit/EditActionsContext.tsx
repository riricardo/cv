import type React from 'react'
import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { editSectionDefinitions } from '../../data/edit/sections.ts'
import {
  cloneCollections,
  getSectionDocuments,
  readEditableCollections,
  writeEditableCollections,
  type CollectionKey,
  type EditableCollections,
} from '../../data/edit/collectionStore.ts'
import { fixedSkillTypes } from '../../data/edit/skillTypes.ts'
import type {
  EditableRecord,
  EditActionTarget,
  EditToast,
  JsonObject,
  JsonValue,
} from '../../types/edit.ts'
import {
  EditActionsContext,
  type EditActionsContextValue,
  useEditActions,
} from './editActionsContextValue.ts'
import { formatKey } from './documentHelpers.ts'

const loginStorageKey = 'cv-edit-login'
const languageOptions = ['en', 'pt', 'es', 'fr', 'de', 'it']
const highlightCategoryOptions = [
  'general',
  'enterprise',
  'backend',
  'desktop',
  'frontend',
  'mobile',
  'database',
  'integration',
  'leadership',
  'learning',
]

export function EditActionsProvider({ children }: { children: React.ReactNode }) {
  const [activeTarget, setActiveTarget] = useState<EditActionTarget>()
  const [confirmTarget, setConfirmTarget] = useState<EditActionTarget>()
  const [collections, setCollections] = useState(readEditableCollections)
  const [editTarget, setEditTarget] = useState<EditActionTarget>()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loginValue, setLoginValue] = useState(readStoredLogin)
  const [toast, setToast] = useState<EditToast>()
  const sections = useMemo(
    () =>
      editSectionDefinitions.map((section) => ({
        ...section,
        documents: getSectionDocuments(collections, section.id) as unknown as EditableRecord[],
      })),
    [collections],
  )

  function showToast(type: EditToast['type'], message: string) {
    setToast({ id: Date.now(), message, type })
  }

  const value = useMemo<EditActionsContextValue>(
    () => ({
      activeTarget,
      closeActionModal: () => setActiveTarget(undefined),
      closeConfirmModal: () => setConfirmTarget(undefined),
      closeEditModal: () => setEditTarget(undefined),
      closeLoginModal: () => setIsLoginOpen(false),
      confirmTarget,
      editTarget,
      loginValue,
      openActionModal: setActiveTarget,
      openAddModal: (sectionId, label) => setEditTarget({ action: 'add', label, sectionId }),
      openDeleteConfirmation: (target) => {
        setActiveTarget(undefined)
        setConfirmTarget({ ...target, action: 'delete' })
      },
      openEditModal: (target) => {
        setActiveTarget(undefined)
        setEditTarget({ ...target, action: target.action === 'add' ? 'add' : 'edit' })
      },
      openLoginModal: () => setIsLoginOpen(true),
      runConfirmedDelete: () => {
        try {
          if (confirmTarget) {
            const authValidation = validateMasterKey(loginValue)

            if (!authValidation.ok) {
              showToast('error', authValidation.message)
              return
            }

            const validation = validateDeleteTarget(collections, confirmTarget)

            if (!validation.ok) {
              showToast('error', validation.message)
              return
            }

            updateCollections((draft) => deleteTarget(draft, confirmTarget))
          }
          setConfirmTarget(undefined)
          showToast('success', 'Deleted successfully.')
        } catch {
          showToast('error', 'Delete action failed.')
        }
      },
      runEditSave: (nextValue) => {
        try {
          if (editTarget) {
            const authValidation = validateMasterKey(loginValue)

            if (!authValidation.ok) {
              showToast('error', authValidation.message)
              return
            }

            const validation = validateSaveTarget(collections, editTarget, nextValue)

            if (!validation.ok) {
              showToast('error', validation.message)
              return
            }

            updateCollections((draft) => saveTarget(draft, editTarget, nextValue))
          }
          setEditTarget(undefined)
          showToast('success', 'Saved successfully.')
        } catch {
          showToast('error', 'Save action failed.')
        }
      },
      saveLogin: (nextLoginValue) => {
        try {
          writeStoredLogin(nextLoginValue)
          setLoginValue(nextLoginValue)
          setIsLoginOpen(false)
          showToast('success', 'Login saved in this browser session.')
        } catch {
          showToast('error', 'Login could not be saved.')
        }
      },
      sections,
      toast,
    }),
    [activeTarget, collections, confirmTarget, editTarget, loginValue, sections, toast],
  )

  function updateCollections(applyChange: (draft: EditableCollections) => void) {
    setCollections((currentCollections) => {
      const nextCollections = cloneCollections(currentCollections)
      applyChange(nextCollections)
      writeEditableCollections(nextCollections)
      return nextCollections
    })
  }

  return (
    <EditActionsContext.Provider value={value}>
      {children}
      <EditActionModals isLoginOpen={isLoginOpen} />
      <EditToastMessage toast={toast} />
    </EditActionsContext.Provider>
  )
}

function EditActionModals({ isLoginOpen }: { isLoginOpen: boolean }) {
  const actions = useEditActions()

  return (
    <>
      {actions.activeTarget ? <ItemActionModal /> : null}
      {actions.editTarget ? <EditValueModal /> : null}
      {actions.confirmTarget ? <ConfirmDeleteModal /> : null}
      {isLoginOpen ? <LoginModal /> : null}
    </>
  )
}

function ItemActionModal() {
  const { activeTarget, closeActionModal, openDeleteConfirmation, openEditModal } = useEditActions()

  if (!activeTarget) {
    return null
  }

  return (
    <EditModal onClose={closeActionModal} title={activeTarget.label}>
      <div className="grid gap-2 sm:grid-cols-3">
        {activeTarget.viewTo ? (
          <Link className="edit-modal-button" onClick={closeActionModal} to={activeTarget.viewTo}>
            View details
          </Link>
        ) : null}
        <button
          className="edit-modal-button"
          onClick={() => openEditModal(activeTarget)}
          type="button"
        >
          Edit
        </button>
        <button
          className="edit-modal-button edit-modal-button-danger"
          onClick={() => openDeleteConfirmation(activeTarget)}
          type="button"
        >
          Delete
        </button>
      </div>
    </EditModal>
  )
}

function EditValueModal() {
  const { closeEditModal, editTarget, runEditSave } = useEditActions()
  const initialValue = useMemo(() => buildEditableValue(editTarget), [editTarget])
  const formRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState<JsonValue>(() => initialValue)

  if (!editTarget) {
    return null
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Enter') {
      return
    }

    const targetElement = event.target as HTMLElement
    const fieldElement = targetElement.closest('input, select, textarea') as HTMLElement | null

    if (!fieldElement) {
      return
    }

    if (fieldElement.tagName === 'TEXTAREA' && !event.metaKey && !event.ctrlKey) {
      return
    }

    event.preventDefault()

    if (fieldElement.tagName === 'TEXTAREA') {
      runEditSave(value)
      return
    }

    const fields = Array.from(
      formRef.current?.querySelectorAll<HTMLElement>(
        'input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
      ) ?? [],
    ).filter((element) => element.tabIndex !== -1)
    const currentIndex = fields.indexOf(fieldElement)
    const nextField = currentIndex >= 0 ? fields[currentIndex + 1] : undefined

    if (nextField) {
      nextField.focus()
      return
    }

    runEditSave(value)
  }

  return (
    <EditModal
      onClose={closeEditModal}
      title={editTarget.action === 'add' ? editTarget.label : `Edit ${editTarget.label}`}
    >
      <div onKeyDown={handleKeyDown} ref={formRef}>
        <FieldEditor target={editTarget} value={value} onChange={setValue} />
        <div className="mt-4 flex justify-end">
          <button
            className="edit-modal-button edit-modal-button-primary"
            onClick={() => runEditSave(value)}
            type="button"
          >
            Save
          </button>
        </div>
      </div>
    </EditModal>
  )
}

function ConfirmDeleteModal() {
  const { closeConfirmModal, confirmTarget, runConfirmedDelete } = useEditActions()

  if (!confirmTarget) {
    return null
  }

  return (
    <EditModal onClose={closeConfirmModal} title="Confirm delete">
      <p className="text-sm leading-6 text-slate-700">
        This will delete <strong>{confirmTarget.label}</strong>.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button className="edit-modal-button" onClick={closeConfirmModal} type="button">
          Cancel
        </button>
        <button
          className="edit-modal-button edit-modal-button-danger"
          onClick={runConfirmedDelete}
          type="button"
        >
          Delete
        </button>
      </div>
    </EditModal>
  )
}

function FieldEditor({
  onChange,
  target,
  value,
}: {
  onChange: (value: JsonValue) => void
  target: EditActionTarget
  value: JsonValue
}) {
  const { sections } = useEditActions()
  const fieldKey = target.fieldKey

  if (fieldKey === 'language') {
    return (
      <FieldLabel label="Language">
        <select
          className="edit-input"
          onChange={(event) => onChange(event.target.value)}
          value={String(value ?? '')}
        >
          {languageOptions.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </FieldLabel>
    )
  }

  if (fieldKey === 'startDate' || fieldKey === 'endDate') {
    return (
      <MonthYearPicker
        allowPresent={fieldKey === 'endDate'}
        label={formatKey(fieldKey)}
        onChange={onChange}
        value={typeof value === 'string' ? value : ''}
      />
    )
  }

  if (target.sectionId === 'resumes' && fieldKey === 'profileId') {
    const profiles = sections.find((section) => section.id === 'profiles')?.documents ?? []

    return (
      <FieldLabel label="Profile">
        <select
          className="edit-input"
          onChange={(event) => onChange(event.target.value)}
          value={String(value ?? '')}
        >
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {String(profile.name ?? profile.id)}
            </option>
          ))}
        </select>
      </FieldLabel>
    )
  }

  if (target.sectionId === 'resumes' && fieldKey === 'whyText') {
    return (
      <FieldLabel label="Why text">
        <textarea
          className="edit-textarea"
          onChange={(event) => onChange(event.target.value)}
          value={Array.isArray(value) ? value.join('\n\n') : String(value ?? '')}
        />
      </FieldLabel>
    )
  }

  if (target.sectionId === 'resumes' && fieldKey === 'details') {
    const details = value && typeof value === 'object' && !Array.isArray(value) ? value : {}

    return (
      <div className="grid gap-3">
        {['company', 'position'].map((detailKey) => (
          <FieldLabel key={detailKey} label={formatKey(detailKey)}>
            <input
              className="edit-input"
              onChange={(event) =>
                onChange({
                  ...(details as JsonObject),
                  [detailKey]: event.target.value,
                })
              }
              type="text"
              value={String((details as JsonObject)[detailKey] ?? '')}
            />
          </FieldLabel>
        ))}
      </div>
    )
  }

  if (fieldKey === 'highlights') {
    const highlight =
      value && typeof value === 'object' && !Array.isArray(value)
        ? value
        : { category: 'general', value: typeof value === 'string' ? value : '' }

    return (
      <div className="grid gap-3">
        <FieldLabel label="Category">
          <select
            className="edit-input"
            onChange={(event) =>
              onChange({
                ...(highlight as JsonObject),
                category: event.target.value,
              })
            }
            value={String((highlight as JsonObject).category ?? 'general')}
          >
            {highlightCategoryOptions.map((category) => (
              <option key={category} value={category}>
                {formatKey(category)}
              </option>
            ))}
          </select>
        </FieldLabel>
        <FieldLabel label="Description">
          <textarea
            className="edit-textarea"
            onChange={(event) =>
              onChange({
                ...(highlight as JsonObject),
                value: event.target.value,
              })
            }
            value={String((highlight as JsonObject).value ?? '')}
          />
        </FieldLabel>
      </div>
    )
  }

  if (fieldKey === 'skillIds') {
    return <SkillIdsEditor target={target} value={value} onChange={onChange} />
  }

  if (fieldKey === 'type') {
    return (
      <FieldLabel label="Type">
        <SkillTypeSelect onChange={onChange} value={String(value ?? 'skill')} />
      </FieldLabel>
    )
  }

  if (target.sectionId === 'skills' && !fieldKey) {
    const skill = value && typeof value === 'object' && !Array.isArray(value) ? value : {}

    return (
      <div className="grid gap-3">
        <FieldLabel label="Type">
          <SkillTypeSelect
            onChange={(type) => onChange({ ...(skill as JsonObject), type })}
            value={String((skill as JsonObject).type ?? 'skill')}
          />
        </FieldLabel>
        <FieldLabel label="Name">
          <input
            className="edit-input"
            onChange={(event) => onChange({ ...(skill as JsonObject), name: event.target.value })}
            type="text"
            value={String((skill as JsonObject).name ?? '')}
          />
        </FieldLabel>
      </div>
    )
  }

  if (typeof value === 'boolean') {
    return (
      <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
        <input
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
          type="checkbox"
        />
        {target.label}
      </label>
    )
  }

  return (
    <FieldLabel label="Value">
      <textarea
        className="edit-textarea"
        onChange={(event) => onChange(event.target.value)}
        value={formatEditableValue(value)}
      />
    </FieldLabel>
  )
}

function SkillIdsEditor({
  onChange,
  target,
  value,
}: {
  onChange: (value: JsonValue) => void
  target: EditActionTarget
  value: JsonValue
}) {
  const { sections } = useEditActions()
  const skills = sections.find((section) => section.id === 'skills')?.documents ?? []
  const newSkill = value && typeof value === 'object' && !Array.isArray(value) ? value : undefined
  const mode = String(newSkill?.mode ?? 'existing')
  const selectedIds = Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : Array.isArray(newSkill?.ids)
      ? newSkill.ids.filter((item): item is string => typeof item === 'string')
      : []
  const availableSkills = skills.filter((skill) => !selectedIds.includes(skill.id))

  if (target.action === 'add') {
    return (
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
          {[
            ['existing', 'Choose'],
            ['new', 'Create'],
          ].map(([modeValue, label]) => (
            <button
              className={
                mode === modeValue
                  ? 'rounded-md bg-white px-3 py-2 text-sm font-bold text-blue-800 shadow-sm'
                  : 'rounded-md px-3 py-2 text-sm font-bold text-slate-600 hover:bg-white/70'
              }
              key={modeValue}
              onClick={() =>
                onChange({
                  ids: selectedIds,
                  mode: modeValue,
                  newSkillName: '',
                  newSkillType: String(newSkill?.newSkillType ?? 'skill'),
                  skillId: '',
                })
              }
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        {mode === 'existing' ? (
          <FieldLabel label="Existing skill">
            <select
              className="edit-input"
              onChange={(event) =>
                onChange({
                  ids: selectedIds,
                  mode,
                  skillId: event.target.value,
                })
              }
              value={String(newSkill?.skillId ?? '')}
            >
              <option value="">Choose a skill</option>
              {availableSkills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {String(skill.name ?? skill.id)} ({String(skill.type ?? 'skill')})
                </option>
              ))}
            </select>
          </FieldLabel>
        ) : (
          <div className="grid gap-3 rounded-lg border border-slate-200 p-3">
            <FieldLabel label="Type">
              <SkillTypeSelect
                onChange={(type) =>
                  onChange({
                    ids: selectedIds,
                    mode,
                    newSkillName: String(newSkill?.newSkillName ?? ''),
                    newSkillType: type,
                  })
                }
                value={String(newSkill?.newSkillType ?? 'skill')}
              />
            </FieldLabel>
            <FieldLabel label="Name">
              <input
                className="edit-input"
                onChange={(event) =>
                  onChange({
                    ids: selectedIds,
                    mode,
                    newSkillName: event.target.value,
                    newSkillType: String(newSkill?.newSkillType ?? 'skill'),
                  })
                }
                type="text"
                value={String(newSkill?.newSkillName ?? '')}
              />
            </FieldLabel>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      <div className="max-h-64 space-y-2 overflow-auto rounded-lg border border-slate-200 p-3">
        {skills.map((skill) => (
          <p className="flex items-center gap-2 text-sm text-slate-700" key={skill.id}>
            <span className="font-bold">{String(skill.name ?? skill.id)}</span>
            <span className="text-xs text-slate-500">{String(skill.type ?? 'skill')}</span>
          </p>
        ))}
      </div>
    </div>
  )
}

function MonthYearPicker({
  allowPresent,
  label,
  onChange,
  value,
}: {
  allowPresent: boolean
  label: string
  onChange: (value: string) => void
  value: string
}) {
  const isPresent = value === 'Present'
  const parsedMonthValue = isPresent ? '' : value
  const [year = '', month = ''] = parsedMonthValue.split('-')
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 45 }, (_, index) => String(currentYear + 2 - index))
  const months = [
    ['01', 'Jan'],
    ['02', 'Feb'],
    ['03', 'Mar'],
    ['04', 'Apr'],
    ['05', 'May'],
    ['06', 'Jun'],
    ['07', 'Jul'],
    ['08', 'Aug'],
    ['09', 'Sep'],
    ['10', 'Oct'],
    ['11', 'Nov'],
    ['12', 'Dec'],
  ]

  function updateDate(nextYear: string, nextMonth: string) {
    onChange(nextYear && nextMonth ? `${nextYear}-${nextMonth}` : '')
  }

  return (
    <div className="edit-date-picker">
      <p className="flex items-center gap-2 text-sm font-bold text-slate-700">
        <span aria-hidden="true" className="fa-solid fa-calendar-days text-blue-700" />
        {label}
      </p>
      <div className="grid grid-cols-[1fr_1.15fr] gap-2">
        <select
          className="edit-input"
          disabled={isPresent}
          onChange={(event) => updateDate(year, event.target.value)}
          value={month}
        >
          <option value="">Month</option>
          {months.map(([monthValue, monthLabel]) => (
            <option key={monthValue} value={monthValue}>
              {monthLabel}
            </option>
          ))}
        </select>
        <select
          className="edit-input"
          disabled={isPresent}
          onChange={(event) => updateDate(event.target.value, month)}
          value={year}
        >
          <option value="">Year</option>
          {years.map((yearValue) => (
            <option key={yearValue} value={yearValue}>
              {yearValue}
            </option>
          ))}
        </select>
      </div>
      {allowPresent ? (
        <label className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
          <input
            checked={isPresent}
            onChange={(event) => onChange(event.target.checked ? 'Present' : '')}
            type="checkbox"
          />
          Present
        </label>
      ) : null}
    </div>
  )
}

function SkillTypeSelect({
  onChange,
  value,
}: {
  onChange: (value: string) => void
  value: string
}) {
  return (
    <select className="edit-input" onChange={(event) => onChange(event.target.value)} value={value}>
      {fixedSkillTypes.map((skillType) => (
        <option key={skillType.id} value={skillType.id}>
          {skillType.title}
        </option>
      ))}
    </select>
  )
}

function FieldLabel({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700">
      {label}
      {children}
    </label>
  )
}

function LoginModal() {
  const { closeLoginModal, loginValue, saveLogin } = useEditActions()
  const [value, setValue] = useState(loginValue)

  return (
    <EditModal onClose={closeLoginModal} title="Login">
      <label className="grid gap-2 text-sm font-bold text-slate-700">
        <span className="sr-only">Login token</span>
        <input
          className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-normal text-slate-900 shadow-sm outline-none focus:border-blue-300"
          onChange={(event) => setValue(event.target.value)}
          placeholder="Login"
          type="text"
          value={value}
        />
      </label>
      <div className="mt-4 flex justify-end">
        <button
          className="edit-modal-button edit-modal-button-primary"
          onClick={() => saveLogin(value)}
          type="button"
        >
          Login
        </button>
      </div>
    </EditModal>
  )
}

function EditModal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode
  onClose: () => void
  title: string
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-3">
      <div className="w-full max-w-lg rounded-xl bg-white p-4 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="break-anywhere text-lg font-bold text-slate-950">{title}</h2>
          <button
            aria-label="Close modal"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            onClick={onClose}
            type="button"
          >
            <span aria-hidden="true" className="fa-solid fa-xmark" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function EditToastMessage({ toast }: { toast?: EditToast }) {
  if (!toast) {
    return null
  }

  return (
    <div className="fixed right-3 bottom-3 z-[60] max-w-sm rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-xl">
      <span
        aria-hidden="true"
        className={
          toast.type === 'success'
            ? 'fa-solid fa-circle-check mr-2 text-green-700'
            : 'fa-solid fa-circle-exclamation mr-2 text-red-700'
        }
      />
      {toast.message}
    </div>
  )
}

function buildEditableValue(target: EditActionTarget | undefined): JsonValue {
  if (!target) {
    return ''
  }

  if (target.action === 'add' && target.fieldKey === 'highlights') {
    return {
      category: 'general',
      id: `${target.documentId}-highlight-${Date.now()}`,
      value: '',
    }
  }

  if (target.action === 'add' && target.fieldKey === 'skillIds') {
    return {
      ids: Array.isArray(target.value) ? target.value : [],
      mode: 'existing',
      newSkillName: '',
      skillId: '',
      newSkillType: 'skill',
    }
  }

  if (target.action === 'add' && target.sectionId === 'skills') {
    return { name: '', type: 'skill' }
  }

  return target.value ?? ''
}

function formatEditableValue(value: JsonValue | undefined) {
  if (value === undefined || value === null) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  return JSON.stringify(value, null, 2)
}

type ValidationResult = { ok: true; message: string } | { ok: false; message: string }

function validateMasterKey(loginValue: string): ValidationResult {
  const masterKey = String(import.meta.env.VITE_MASTER_KEY ?? '')

  if (!masterKey) {
    return invalid('Invalid access.')
  }

  if (loginValue !== masterKey) {
    return invalid('Invalid access.')
  }

  return valid('Master key accepted.')
}

function validateSaveTarget(
  collections: EditableCollections,
  target: EditActionTarget,
  rawValue: JsonValue,
): ValidationResult {
  const documents = getEditableDocuments(collections, target.sectionId)

  if (!documents) {
    return invalid(`Collection "${target.sectionId}" is not editable.`)
  }

  if (target.sectionId === 'skills' && !target.fieldKey) {
    return validateSkillRecord(rawValue)
  }

  const document = getTargetDocument(documents, target)

  if (!document && target.documentId) {
    return invalid(`Document "${target.documentId}" was not found.`)
  }

  if (!document) {
    const record = normalizeRecordValue(rawValue)

    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      return invalid('New records must be structured objects.')
    }

    return valid('New record is compatible.')
  }

  if (!target.fieldKey) {
    const record = normalizeRecordValue(rawValue)

    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      return invalid('The record edit must be a structured object.')
    }

    return valid('Record shape is compatible.')
  }

  const currentValue = document[target.fieldKey]

  if (target.action === 'add' && !Array.isArray(currentValue)) {
    return invalid(`${formatKey(target.fieldKey)} is not a list.`)
  }

  if (target.itemIndex !== undefined) {
    if (!Array.isArray(currentValue)) {
      return invalid(`${formatKey(target.fieldKey)} is not a list.`)
    }

    if (target.itemIndex < 0 || target.itemIndex >= currentValue.length) {
      return invalid(`${formatKey(target.fieldKey)} item was not found.`)
    }
  }

  return validateFieldValue(collections, target, rawValue, currentValue)
}

function validateDeleteTarget(
  collections: EditableCollections,
  target: EditActionTarget,
): ValidationResult {
  const documents = getEditableDocuments(collections, target.sectionId)

  if (!documents) {
    return invalid(`Collection "${target.sectionId}" is not editable.`)
  }

  const document = getTargetDocument(documents, target)

  if (!document) {
    return invalid(`Document "${target.documentId ?? target.label}" was not found.`)
  }

  if (!target.fieldKey) {
    return valid('Document can be cleared or removed.')
  }

  const currentValue = document[target.fieldKey]

  if (currentValue === undefined) {
    return invalid(`${formatKey(target.fieldKey)} was not found.`)
  }

  if (target.itemIndex !== undefined) {
    if (!Array.isArray(currentValue)) {
      return invalid(`${formatKey(target.fieldKey)} is not a list.`)
    }

    if (target.itemIndex < 0 || target.itemIndex >= currentValue.length) {
      return invalid(`${formatKey(target.fieldKey)} item was not found.`)
    }
  }

  return valid('Delete target is compatible.')
}

function validateFieldValue(
  collections: EditableCollections,
  target: EditActionTarget,
  rawValue: JsonValue,
  currentValue: JsonValue | undefined,
): ValidationResult {
  switch (target.fieldKey) {
    case 'language':
      return languageOptions.includes(String(rawValue))
        ? valid('Language is compatible.')
        : invalid('Language must be selected from the supported list.')
    case 'startDate':
      return validateMonthValue(rawValue, false)
    case 'endDate':
      return validateMonthValue(rawValue, true)
    case 'profileId':
      return collections.profiles.some((profile) => profile.id === rawValue)
        ? valid('Profile reference is compatible.')
        : invalid('Selected profile does not exist.')
    case 'type':
      return isValidSkillType(rawValue)
        ? valid('Skill type is compatible.')
        : invalid('Skill type must be selected from the supported list.')
    case 'skillIds':
      return validateSkillReference(collections, rawValue, currentValue)
    case 'highlights':
      return validateHighlight(rawValue)
    case 'details':
      return validateResumeDetails(rawValue)
    case 'whyText':
      return typeof rawValue === 'string' || Array.isArray(rawValue)
        ? valid('Why text is compatible.')
        : invalid('Why text must be text.')
    default:
      return validateGenericCompatibility(currentValue, rawValue)
  }
}

function validateMonthValue(value: JsonValue, allowPresent: boolean): ValidationResult {
  if (value === '' || value === undefined) {
    return valid('Date can be empty.')
  }

  if (allowPresent && value === 'Present') {
    return valid('Date is compatible.')
  }

  return typeof value === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(value)
    ? valid('Date is compatible.')
    : invalid('Date must use a valid month and year.')
}

function validateSkillReference(
  collections: EditableCollections,
  rawValue: JsonValue,
  currentValue: JsonValue | undefined,
): ValidationResult {
  if (Array.isArray(rawValue)) {
    const missingSkillId = rawValue.find(
      (skillId) =>
        typeof skillId !== 'string' || !collections.skills.some((skill) => skill.id === skillId),
    )

    return missingSkillId
      ? invalid(`Skill reference "${String(missingSkillId)}" does not exist.`)
      : valid('Skill references are compatible.')
  }

  if (!rawValue || typeof rawValue !== 'object') {
    return invalid('Skill changes must choose an existing skill or create a new one.')
  }

  const selectedIds = Array.isArray(currentValue)
    ? currentValue.filter((item): item is string => typeof item === 'string')
    : []
  const mode = typeof rawValue.mode === 'string' ? rawValue.mode : 'existing'

  if (mode === 'existing') {
    if (typeof rawValue.skillId !== 'string' || !rawValue.skillId) {
      return invalid('Choose an existing skill before saving.')
    }

    if (!collections.skills.some((skill) => skill.id === rawValue.skillId)) {
      return invalid('Selected skill does not exist.')
    }

    if (selectedIds.includes(rawValue.skillId)) {
      return invalid('This skill is already linked here.')
    }

    return valid('Skill reference is compatible.')
  }

  if (mode === 'new') {
    if (typeof rawValue.newSkillName !== 'string' || !rawValue.newSkillName.trim()) {
      return invalid('New skill needs a name.')
    }

    if (!isValidSkillType(rawValue.newSkillType)) {
      return invalid('New skill type must be selected from the supported list.')
    }

    return valid('New skill is compatible.')
  }

  return invalid('Choose whether to link an existing skill or create a new one.')
}

function validateSkillRecord(value: JsonValue): ValidationResult {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return invalid('Skill must be a structured object.')
  }

  if (typeof value.name !== 'string' || !value.name.trim()) {
    return invalid('Skill needs a name.')
  }

  if (!isValidSkillType(value.type)) {
    return invalid('Skill type must be selected from the supported list.')
  }

  return valid('Skill record is compatible.')
}

function validateHighlight(value: JsonValue): ValidationResult {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return invalid('Highlight must have category and description.')
  }

  if (!highlightCategoryOptions.includes(String(value.category ?? ''))) {
    return invalid('Highlight category must be selected from the supported list.')
  }

  if (typeof value.value !== 'string') {
    return invalid('Highlight description must be text.')
  }

  return valid('Highlight is compatible.')
}

function validateResumeDetails(value: JsonValue): ValidationResult {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return invalid('Details must include company and position fields.')
  }

  if (
    (value.company !== undefined && typeof value.company !== 'string') ||
    (value.position !== undefined && typeof value.position !== 'string')
  ) {
    return invalid('Company and position must be text.')
  }

  return valid('Resume details are compatible.')
}

function validateGenericCompatibility(
  currentValue: JsonValue | undefined,
  rawValue: JsonValue,
): ValidationResult {
  if (currentValue === undefined || currentValue === null) {
    return valid('Value is compatible.')
  }

  const normalizedValue = normalizeFieldValue(rawValue)

  if (Array.isArray(currentValue)) {
    return Array.isArray(normalizedValue)
      ? valid('List value is compatible.')
      : invalid('This field expects a list.')
  }

  if (typeof currentValue === 'object') {
    return normalizedValue && typeof normalizedValue === 'object' && !Array.isArray(normalizedValue)
      ? valid('Object value is compatible.')
      : invalid('This field expects an object.')
  }

  return typeof normalizedValue === typeof currentValue
    ? valid('Value type is compatible.')
    : invalid(`${formatKey('value')} must stay compatible with the current field type.`)
}

function getEditableDocuments(collections: EditableCollections, sectionId: string) {
  return collections[sectionId as CollectionKey] as unknown as JsonObject[] | undefined
}

function getTargetDocument(documents: JsonObject[], target: EditActionTarget) {
  return target.documentId
    ? documents.find((document) => document.id === target.documentId)
    : undefined
}

function isValidSkillType(value: JsonValue | undefined) {
  return fixedSkillTypes.some((skillType) => skillType.id === value)
}

function valid(message: string): ValidationResult {
  return { message, ok: true }
}

function invalid(message: string): ValidationResult {
  return { message, ok: false }
}

function saveTarget(
  collections: EditableCollections,
  target: EditActionTarget,
  rawValue: JsonValue,
) {
  const sectionKey = target.sectionId as CollectionKey
  const documents = collections[sectionKey]

  if (!documents) {
    return
  }

  if (
    target.sectionId === 'skills' &&
    target.value &&
    typeof target.value === 'object' &&
    !Array.isArray(target.value)
  ) {
    const skillValue = normalizeRecordValue(rawValue) as JsonObject
    const skillId =
      target.documentId ??
      String(
        (target.value as JsonObject).id ?? createId('skill', String(skillValue.name ?? 'skill')),
      )
    const skill = {
      ...(target.value as JsonObject),
      ...skillValue,
      id: skillId,
      updatedAt: new Date().toISOString(),
    }
    upsertDocument(collections.skills as unknown as JsonObject[], skill)
    return
  }

  const document = target.documentId
    ? (documents as unknown as JsonObject[]).find((item) => item.id === target.documentId)
    : undefined

  if (!document) {
    const record = normalizeRecordValue(rawValue)
    const recordName =
      record &&
      typeof record === 'object' &&
      !Array.isArray(record) &&
      typeof record.name === 'string'
        ? record.name
        : String(target.label)
    upsertDocument(documents as unknown as JsonObject[], {
      ...(record && typeof record === 'object' && !Array.isArray(record) ? record : {}),
      id: createId(target.sectionId === 'skills' ? 'skill' : target.sectionId, recordName),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    })
    return
  }

  const fieldKey = target.fieldKey

  if (!fieldKey) {
    Object.assign(document, normalizeRecordValue(rawValue), { updatedAt: new Date().toISOString() })
    return
  }

  if (fieldKey === 'skillIds') {
    document[fieldKey] = normalizeSkillIds(collections, rawValue)
  } else if (fieldKey === 'highlights') {
    const normalizedHighlight = normalizeHighlightValue(rawValue, target, document[fieldKey])

    if (target.itemIndex !== undefined && Array.isArray(document[fieldKey])) {
      document[fieldKey][target.itemIndex] = normalizedHighlight
    } else if (target.action === 'add' && Array.isArray(document[fieldKey])) {
      document[fieldKey].push(normalizedHighlight)
    } else {
      document[fieldKey] = normalizedHighlight
    }
  } else if (fieldKey === 'whyText' && typeof rawValue === 'string') {
    document[fieldKey] = rawValue
  } else if (target.itemIndex !== undefined && Array.isArray(document[fieldKey])) {
    document[fieldKey][target.itemIndex] = normalizeFieldValue(rawValue)
  } else if (target.action === 'add' && Array.isArray(document[fieldKey])) {
    document[fieldKey].push(normalizeFieldValue(rawValue))
  } else {
    document[fieldKey] = normalizeFieldValue(rawValue)
  }

  document.updatedAt = new Date().toISOString()
}

function deleteTarget(collections: EditableCollections, target: EditActionTarget) {
  const documents = collections[target.sectionId as CollectionKey] as unknown as
    JsonObject[] | undefined

  if (!documents) {
    return
  }

  const documentIndex = target.documentId
    ? documents.findIndex((document) => document.id === target.documentId)
    : -1

  if (target.fieldKey && target.itemIndex !== undefined && documentIndex >= 0) {
    const document = documents[documentIndex]
    const fieldValue = document[target.fieldKey]

    if (Array.isArray(fieldValue)) {
      const removedItem = fieldValue[target.itemIndex]

      if (shouldRemoveArrayItem(target.sectionId, target.fieldKey)) {
        fieldValue.splice(target.itemIndex, 1)
        removeDeletedReferences(collections, target, removedItem)
      } else {
        fieldValue[target.itemIndex] = getEmptyValue(removedItem, target.fieldKey)
      }

      document.updatedAt = new Date().toISOString()
    }

    return
  }

  if (target.fieldKey && documentIndex >= 0) {
    const document = documents[documentIndex]

    document[target.fieldKey] = getEmptyValue(document[target.fieldKey], target.fieldKey)
    document.updatedAt = new Date().toISOString()
    return
  }

  if (documentIndex >= 0) {
    if (target.sectionId === 'languages') {
      documents.splice(documentIndex, 1)
      return
    }

    clearDocument(documents[documentIndex])
  }
}

function shouldRemoveArrayItem(sectionId: string, fieldKey: string) {
  return (
    fieldKey === 'skillIds' ||
    fieldKey === 'highlights' ||
    (sectionId === 'education' && fieldKey === 'highlights')
  )
}

function removeDeletedReferences(
  collections: EditableCollections,
  target: EditActionTarget,
  removedItem: JsonValue | undefined,
) {
  if (
    target.sectionId !== 'experience' ||
    target.fieldKey !== 'highlights' ||
    !removedItem ||
    typeof removedItem !== 'object' ||
    Array.isArray(removedItem) ||
    typeof removedItem.id !== 'string'
  ) {
    return
  }

  for (const profile of collections.profiles) {
    for (const profileExperience of profile.experiences) {
      if (profileExperience.experienceId !== target.documentId) {
        continue
      }

      profileExperience.highlightIds = profileExperience.highlightIds.filter(
        (highlightId) => highlightId !== removedItem.id,
      )
      profileExperience.downloadHighlightIds = profileExperience.downloadHighlightIds?.filter(
        (highlightId) => highlightId !== removedItem.id,
      )
    }
  }
}

function clearDocument(document: JsonObject) {
  for (const key of Object.keys(document)) {
    if (['createdAt', 'id', 'updatedAt', 'version'].includes(key)) {
      continue
    }

    document[key] = getEmptyValue(document[key], key)
  }

  document.updatedAt = new Date().toISOString()
}

function getEmptyValue(value: JsonValue | undefined, fieldKey?: string): JsonValue {
  if (fieldKey === 'highlights' && value && typeof value === 'object' && !Array.isArray(value)) {
    return {
      ...value,
      category: typeof value.category === 'string' ? value.category : 'general',
      value: '',
    }
  }

  if (fieldKey === 'details') {
    return {
      company: '',
      position: '',
    }
  }

  if (fieldKey === 'whyText') {
    return ''
  }

  if (Array.isArray(value)) {
    return []
  }

  if (typeof value === 'boolean') {
    return false
  }

  if (typeof value === 'number') {
    return 0
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        key === 'id' ? nestedValue : getEmptyValue(nestedValue, key),
      ]),
    )
  }

  return ''
}

function normalizeSkillIds(collections: EditableCollections, value: JsonValue) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }

  if (!value || typeof value !== 'object') {
    return []
  }

  const ids = Array.isArray(value.ids)
    ? value.ids.filter((item): item is string => typeof item === 'string')
    : []
  const mode = typeof value.mode === 'string' ? value.mode : 'existing'
  const selectedSkillId = typeof value.skillId === 'string' ? value.skillId : ''
  const newSkillName = typeof value.newSkillName === 'string' ? value.newSkillName.trim() : ''

  if (mode === 'existing' && selectedSkillId) {
    return ids.includes(selectedSkillId) ? ids : [...ids, selectedSkillId]
  }

  if (mode !== 'new' || !newSkillName) {
    return ids
  }

  const existingSkill = collections.skills.find(
    (skill) => skill.name.toLowerCase() === newSkillName.toLowerCase(),
  )

  if (existingSkill) {
    return ids.includes(existingSkill.id) ? ids : [...ids, existingSkill.id]
  }

  const newSkill = {
    id: createId('skill', newSkillName),
    name: newSkillName,
    type: typeof value.newSkillType === 'string' ? value.newSkillType : 'skill',
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  collections.skills.push(newSkill)
  return [...ids, newSkill.id]
}

function normalizeHighlightValue(
  value: JsonValue,
  target: EditActionTarget,
  currentValue: JsonValue | undefined,
) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return {
      category: typeof value.category === 'string' ? value.category : 'general',
      id: typeof value.id === 'string' ? value.id : createHighlightId(target, currentValue),
      value: typeof value.value === 'string' ? value.value : '',
    }
  }

  return {
    category: 'general',
    id: createHighlightId(target, currentValue),
    value: typeof value === 'string' ? value : '',
  }
}

function createHighlightId(target: EditActionTarget, currentValue: JsonValue | undefined) {
  const currentCount = Array.isArray(currentValue) ? currentValue.length : 0
  const sequence = target.itemIndex !== undefined ? target.itemIndex + 1 : currentCount + 1

  return `${target.documentId ?? target.sectionId}-highlight-${String(sequence).padStart(2, '0')}`
}

function normalizeRecordValue(value: JsonValue) {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as JsonValue
    } catch {
      return { value }
    }
  }

  return value
}

function normalizeFieldValue(value: JsonValue) {
  if (typeof value !== 'string') {
    return value
  }

  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return ''
  }

  try {
    return JSON.parse(trimmedValue) as JsonValue
  } catch {
    return value
  }
}

function upsertDocument(documents: JsonObject[], document: JsonObject) {
  const existingIndex = documents.findIndex((item) => item.id === document.id)

  if (existingIndex >= 0) {
    documents[existingIndex] = document
    return
  }

  documents.push(document)
}

function createId(prefix: string, value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return `${prefix}-${slug || Date.now()}`
}

function readStoredLogin() {
  try {
    return sessionStorage.getItem(loginStorageKey) ?? ''
  } catch {
    return ''
  }
}

function writeStoredLogin(value: string) {
  sessionStorage.setItem(loginStorageKey, value)
}

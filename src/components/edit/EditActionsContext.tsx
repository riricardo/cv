import type React from 'react'
import { Children, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { editSectionDefinitions } from '../../data/edit/sections.ts'
import {
  cloneCollections,
  createEmptyEditableCollections,
  getSectionDocuments,
  type CollectionKey,
  type EditableCollections,
} from '../../data/edit/collectionStore.ts'
import { fetchEditableCollections, syncEditableCollections } from '../../services/api.ts'
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
const toastDurationMs = 6_000
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
  const [collections, setCollections] = useState(createEmptyEditableCollections)
  const [editTarget, setEditTarget] = useState<EditActionTarget>()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const [loadError, setLoadError] = useState<string>()
  const [loadAttempt, setLoadAttempt] = useState(0)
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

  useEffect(() => {
    if (!toast) {
      return
    }

    const timeoutId = window.setTimeout(() => setToast(undefined), toastDurationMs)
    return () => window.clearTimeout(timeoutId)
  }, [toast])

  useEffect(() => {
    const controller = new AbortController()

    setIsLoading(true)
    setLoadError(undefined)

    fetchEditableCollections(controller.signal)
      .then(setCollections)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoadError(getErrorMessage(error, 'Could not load editor data.'))
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [loadAttempt])

  const value = useMemo<EditActionsContextValue>(
    () => ({
      activeTarget,
      closeActionModal: () => setActiveTarget(undefined),
      closeConfirmModal: () => setConfirmTarget(undefined),
      closeEditModal: () => setEditTarget(undefined),
      closeLoginModal: () => setIsLoginOpen(false),
      confirmTarget,
      editTarget,
      isLoading,
      isMutating,
      loadError,
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
      runConfirmedDelete: async () => {
        setIsMutating(true)
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

            const nextCollections = cloneCollections(collections)
            deleteTarget(nextCollections, confirmTarget)
            await syncEditableCollections(collections, nextCollections, loginValue)
            setCollections(await fetchEditableCollections())
          }
          setConfirmTarget(undefined)
          showToast('success', 'Deleted successfully.')
        } catch (error: unknown) {
          showToast('error', getErrorMessage(error, 'Delete action failed.'))
        } finally {
          setIsMutating(false)
        }
      },
      runEditSave: async (nextValue) => {
        setIsMutating(true)
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

            const nextCollections = cloneCollections(collections)
            saveTarget(nextCollections, editTarget, nextValue)
            await syncEditableCollections(collections, nextCollections, loginValue)
            setCollections(await fetchEditableCollections())
          }
          setEditTarget(undefined)
          showToast('success', 'Saved successfully.')
        } catch (error: unknown) {
          showToast('error', getErrorMessage(error, 'Save action failed.'))
        } finally {
          setIsMutating(false)
        }
      },
      retryLoad: () => setLoadAttempt((value) => value + 1),
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
    [
      activeTarget,
      collections,
      confirmTarget,
      editTarget,
      isLoading,
      isMutating,
      loadError,
      loginValue,
      sections,
      toast,
    ],
  )

  return (
    <EditActionsContext.Provider value={value}>
      {children}
      <EditActionModals isLoginOpen={isLoginOpen} />
      <EditToastMessage onDismiss={() => setToast(undefined)} toast={toast} />
      {isMutating ? <EditLoadingOverlay label="Applying changes..." /> : null}
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
        {activeTarget.sectionId !== 'profiles' ? (
          <button
            className="edit-modal-button"
            onClick={() => openEditModal(activeTarget)}
            type="button"
          >
            Edit
          </button>
        ) : null}
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
  const { closeEditModal, editTarget, isMutating, runEditSave } = useEditActions()
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
            disabled={isMutating}
            onClick={() => runEditSave(value)}
            type="button"
          >
            {isMutating ? (
              <span aria-hidden="true" className="fa-solid fa-spinner fa-spin" />
            ) : null}
            {isMutating ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </EditModal>
  )
}

function ConfirmDeleteModal() {
  const { closeConfirmModal, confirmTarget, isMutating, runConfirmedDelete } = useEditActions()

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
          disabled={isMutating}
          onClick={runConfirmedDelete}
          type="button"
        >
          {isMutating ? <span aria-hidden="true" className="fa-solid fa-spinner fa-spin" /> : null}
          {isMutating ? 'Deleting...' : 'Delete'}
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
  const currentProfile =
    target.sectionId === 'profiles'
      ? sections
          .find((section) => section.id === 'profiles')
          ?.documents.find((document) => document.id === target.documentId)
      : undefined
  const profileLanguage = String(currentProfile?.language ?? 'en')

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

  if (target.sectionId === 'profiles' && fieldKey === 'personalInfoId') {
    const personalDetails =
      sections
        .find((section) => section.id === 'details')
        ?.documents.filter((document) => document.language === profileLanguage) ?? []

    return (
      <FieldLabel label="Personal details">
        <select
          className="edit-input"
          onChange={(event) => onChange(event.target.value)}
          value={String(value ?? '')}
        >
          <option value="">Choose personal details</option>
          {personalDetails.map((details) => (
            <option key={details.id} value={details.id}>
              {String(details.name ?? details.fullName ?? details.id)}
            </option>
          ))}
        </select>
      </FieldLabel>
    )
  }

  if (
    target.sectionId === 'profiles' &&
    ['educationIds', 'projectIds', 'skillIds', 'spokenLanguageIds'].includes(fieldKey ?? '')
  ) {
    const sectionByField: Record<string, string> = {
      educationIds: 'education',
      projectIds: 'projects',
      skillIds: 'skills',
      spokenLanguageIds: 'languages',
    }
    const sourceSectionId = sectionByField[fieldKey ?? '']
    const skillCategories =
      sections.find((section) => section.id === 'skillCategories')?.documents ?? []
    const sourceDocuments =
      sections.find((section) => section.id === sourceSectionId)?.documents ?? []
    const documents =
      sourceSectionId === 'skills'
        ? getSkillsForProfileLanguage(sourceDocuments, skillCategories, profileLanguage)
        : sourceDocuments.filter((document) => document.language === profileLanguage)

    return (
      <ProfileCheckboxGroup
        documents={documents}
        onChange={onChange}
        selectedIds={getStringArray(value)}
        title={formatKey(fieldKey ?? '')}
      />
    )
  }

  if (target.sectionId === 'profiles' && fieldKey === 'experiences' && Array.isArray(value)) {
    const experiences =
      sections
        .find((section) => section.id === 'experience')
        ?.documents.filter((document) => document.language === profileLanguage) ?? []

    return <ProfileExperiencesEditor experiences={experiences} onChange={onChange} value={value} />
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

  if (target.sectionId === 'profiles' && fieldKey === 'experiences' && !Array.isArray(value)) {
    const profileExperience =
      value && typeof value === 'object' && !Array.isArray(value) ? value : {}
    const experiences = sections.find((section) => section.id === 'experience')?.documents ?? []
    const experience = experiences.find(
      (candidate) => candidate.id === String(profileExperience.experienceId ?? ''),
    )

    return experience ? (
      <div className="grid gap-3">
        <p className="text-sm font-bold text-slate-900">{getRecordLabel(experience)}</p>
        <ProfileExperienceEditor
          experience={experience}
          onChange={onChange}
          value={profileExperience}
        />
      </div>
    ) : (
      <p className="text-sm text-red-700">The selected experience could not be found.</p>
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

  if (fieldKey === 'categoryId') {
    return (
      <FieldLabel label="Category">
        <SkillCategorySelect onChange={onChange} value={String(value ?? '')} />
      </FieldLabel>
    )
  }

  if (target.sectionId === 'skills' && !fieldKey) {
    const skill = value && typeof value === 'object' && !Array.isArray(value) ? value : {}

    return (
      <div className="grid gap-3">
        <FieldLabel label="Category">
          <SkillCategorySelect
            onChange={(categoryId) => onChange({ ...(skill as JsonObject), categoryId })}
            value={String((skill as JsonObject).categoryId ?? '')}
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

  if (target.sectionId === 'profiles' && !fieldKey && value && typeof value === 'object') {
    return (
      <ProfileRecordEditor
        isNew={target.action === 'add'}
        onChange={onChange}
        value={value as JsonObject}
      />
    )
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return <RecordFieldsEditor target={target} value={value} onChange={onChange} />
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

  const useMultilineInput =
    fieldKey === 'description' ||
    fieldKey === 'professionalDescription' ||
    fieldKey === 'professionalSummary'

  return (
    <FieldLabel label={formatKey(fieldKey ?? 'value')}>
      {useMultilineInput ? (
        <textarea
          className="edit-textarea"
          onChange={(event) => onChange(event.target.value)}
          value={formatEditableValue(value)}
        />
      ) : (
        <input
          className="edit-input"
          onChange={(event) => onChange(event.target.value)}
          type="text"
          value={formatEditableValue(value)}
        />
      )}
    </FieldLabel>
  )
}

function ProfileRecordEditor({
  isNew,
  onChange,
  value,
}: {
  isNew: boolean
  onChange: (value: JsonValue) => void
  value: JsonObject
}) {
  const { sections } = useEditActions()
  const profileLanguage = String(value.language ?? 'en')
  const matchesProfileLanguage = (document: EditableRecord) => document.language === profileLanguage
  const details =
    sections
      .find((section) => section.id === 'details')
      ?.documents.filter(matchesProfileLanguage) ?? []
  const experiences =
    sections
      .find((section) => section.id === 'experience')
      ?.documents.filter(matchesProfileLanguage) ?? []
  const education =
    sections
      .find((section) => section.id === 'education')
      ?.documents.filter(matchesProfileLanguage) ?? []
  const projects =
    sections
      .find((section) => section.id === 'projects')
      ?.documents.filter(matchesProfileLanguage) ?? []
  const languages =
    sections
      .find((section) => section.id === 'languages')
      ?.documents.filter(matchesProfileLanguage) ?? []
  const skillCategories =
    sections.find((section) => section.id === 'skillCategories')?.documents ?? []
  const allSkills = sections.find((section) => section.id === 'skills')?.documents ?? []
  const skills = getSkillsForProfileLanguage(allSkills, skillCategories, profileLanguage)
  const profileExperiences = Array.isArray(value.experiences)
    ? value.experiences.filter(
        (entry): entry is JsonObject =>
          Boolean(entry) && typeof entry === 'object' && !Array.isArray(entry),
      )
    : []
  const experiencesById = new Map(experiences.map((experience) => [experience.id, experience]))
  const orderedExperiences = [
    ...profileExperiences.flatMap((entry) => {
      const experience = experiencesById.get(String(entry.experienceId ?? ''))
      return experience ? [experience] : []
    }),
    ...experiences.filter(
      (experience) => !profileExperiences.some((entry) => entry.experienceId === experience.id),
    ),
  ]

  function updateField(key: string, nextValue: JsonValue) {
    onChange({ ...value, [key]: nextValue })
  }

  function updateProfileLanguage(language: string) {
    onChange({
      ...value,
      language,
      personalInfoId: '',
      experiences: [],
      educationIds: [],
      projectIds: [],
      skillIds: [],
      spokenLanguageIds: [],
    })
  }

  const onlyPersonalInfoId = details.length === 1 ? details[0].id : undefined

  useEffect(() => {
    if (isNew && !value.personalInfoId && onlyPersonalInfoId) {
      onChange({ ...value, personalInfoId: onlyPersonalInfoId })
    }
  }, [isNew, onChange, onlyPersonalInfoId, value])

  function toggleExperience(experience: EditableRecord, checked: boolean) {
    if (!checked) {
      updateField(
        'experiences',
        profileExperiences.filter((entry) => entry.experienceId !== experience.id),
      )
      return
    }

    const highlightIds = Array.isArray(experience.highlights)
      ? experience.highlights.flatMap((highlight) =>
          highlight &&
          typeof highlight === 'object' &&
          !Array.isArray(highlight) &&
          typeof highlight.id === 'string'
            ? [highlight.id]
            : [],
        )
      : []

    updateField('experiences', [
      ...profileExperiences,
      {
        experienceId: experience.id,
        print: true,
        highlightIds,
        downloadHighlightIds: highlightIds,
      },
    ])
  }

  function updateProfileExperience(experienceId: string, nextEntry: JsonObject) {
    updateField(
      'experiences',
      profileExperiences.map((entry) => (entry.experienceId === experienceId ? nextEntry : entry)),
    )
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <FieldLabel label="Name">
          <input
            className="edit-input"
            onChange={(event) => updateField('name', event.target.value)}
            type="text"
            value={String(value.name ?? '')}
          />
        </FieldLabel>
        <FieldLabel label="Language">
          <select
            className="edit-input"
            onChange={(event) => updateProfileLanguage(event.target.value)}
            value={String(value.language ?? 'en')}
          >
            {languageOptions.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </FieldLabel>
        <div className="sm:col-span-2">
          <FieldLabel label="Personal details">
            <select
              className="edit-input"
              onChange={(event) => updateField('personalInfoId', event.target.value)}
              value={String(value.personalInfoId ?? '')}
            >
              <option value="">Choose personal details</option>
              {details.map((document) => (
                <option key={document.id} value={document.id}>
                  {getRecordLabel(document)}
                </option>
              ))}
            </select>
          </FieldLabel>
        </div>
        <div className="sm:col-span-2">
          <FieldLabel label="Professional summary">
            <textarea
              className="edit-textarea"
              onChange={(event) => updateField('professionalSummary', event.target.value)}
              value={String(value.professionalSummary ?? '')}
            />
          </FieldLabel>
        </div>
      </div>

      {!isNew ? (
        <>
          <ProfileCheckboxGroup
            documents={education}
            onChange={(ids) => updateField('educationIds', ids)}
            selectedIds={getStringArray(value.educationIds)}
            title="Education"
          />
          <ProfileCheckboxGroup
            documents={projects}
            onChange={(ids) => updateField('projectIds', ids)}
            selectedIds={getStringArray(value.projectIds)}
            title="Projects"
          />
          <ProfileCheckboxGroup
            documents={skills}
            onChange={(ids) => updateField('skillIds', ids)}
            selectedIds={getStringArray(value.skillIds)}
            title="Skills"
          />
          <ProfileCheckboxGroup
            documents={languages}
            onChange={(ids) => updateField('spokenLanguageIds', ids)}
            selectedIds={getStringArray(value.spokenLanguageIds)}
            title="Spoken languages"
          />

          <fieldset className="grid gap-2 rounded-lg border border-slate-200 p-3">
            <legend className="px-1 text-sm font-bold text-slate-800">Experiences</legend>
            {orderedExperiences.map((experience) => {
              const profileExperience = profileExperiences.find(
                (entry) => entry.experienceId === experience.id,
              )
              const selectedIndex = profileExperiences.findIndex(
                (entry) => entry.experienceId === experience.id,
              )

              return (
                <div className="rounded-md bg-slate-50 p-3" key={experience.id}>
                  <div className="flex items-start gap-2">
                    <label className="flex min-w-0 flex-1 items-start gap-2 text-sm font-semibold text-slate-800">
                      <input
                        checked={Boolean(profileExperience)}
                        className="mt-1"
                        onChange={(event) => toggleExperience(experience, event.target.checked)}
                        type="checkbox"
                      />
                      <span>{getRecordLabel(experience)}</span>
                    </label>
                    {profileExperience ? (
                      <OrderButtons
                        canMoveDown={selectedIndex < profileExperiences.length - 1}
                        canMoveUp={selectedIndex > 0}
                        label={getRecordLabel(experience)}
                        onMoveDown={() =>
                          updateField('experiences', moveItem(profileExperiences, selectedIndex, 1))
                        }
                        onMoveUp={() =>
                          updateField(
                            'experiences',
                            moveItem(profileExperiences, selectedIndex, -1),
                          )
                        }
                      />
                    ) : null}
                  </div>
                  {profileExperience ? (
                    <ProfileExperienceEditor
                      experience={experience}
                      onChange={(nextEntry) => updateProfileExperience(experience.id, nextEntry)}
                      value={profileExperience}
                    />
                  ) : null}
                </div>
              )
            })}
          </fieldset>
        </>
      ) : null}
    </div>
  )
}

function ProfileCheckboxGroup({
  documents,
  onChange,
  selectedIds,
  title,
}: {
  documents: EditableRecord[]
  onChange: (ids: string[]) => void
  selectedIds: string[]
  title: string
}) {
  const [draggedId, setDraggedId] = useState<string>()
  const documentsById = new Map(documents.map((document) => [document.id, document]))
  const selectedDocuments = selectedIds.flatMap((id) => {
    const document = documentsById.get(id)
    return document ? [document] : []
  })
  const availableDocuments = documents
    .filter((document) => !selectedIds.includes(document.id))
    .sort(compareRecordsByLabel)

  function moveDraggedBefore(targetId?: string) {
    if (!draggedId) return

    const sourceIndex = selectedIds.indexOf(draggedId)
    const targetIndex = targetId ? selectedIds.indexOf(targetId) : selectedIds.length - 1
    if (sourceIndex < 0 || sourceIndex === targetIndex) return

    const nextIds = [...selectedIds]
    const [draggedItem] = nextIds.splice(sourceIndex, 1)
    nextIds.splice(targetIndex, 0, draggedItem)

    if (nextIds.some((id, index) => id !== selectedIds[index])) {
      onChange(nextIds)
    }
  }

  return (
    <fieldset className="grid gap-3">
      <legend className="px-1 text-sm font-bold text-slate-800">{title}</legend>
      <SelectionPanel
        emptyMessage="No selected items"
        onDragOver={(event) => {
          event.preventDefault()
          if (event.target === event.currentTarget) moveDraggedBefore()
        }}
        onDrop={() => setDraggedId(undefined)}
        title="Selected"
      >
        {selectedDocuments.map((document) => (
          <div
            className={`flex items-start gap-2 rounded-md border border-slate-200/80 bg-white/80 p-2 text-sm text-slate-700 ${draggedId === document.id ? 'opacity-50' : ''}`}
            key={document.id}
            onDragEnter={() => moveDraggedBefore(document.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              event.stopPropagation()
              setDraggedId(undefined)
            }}
          >
            <DragHandle
              label={getRecordLabel(document)}
              onDragEnd={() => setDraggedId(undefined)}
              onDragStart={() => setDraggedId(document.id)}
            />
            <label className="flex min-w-0 flex-1 items-start gap-2">
              <input
                checked
                className="mt-1"
                onChange={() => onChange(selectedIds.filter((id) => id !== document.id))}
                type="checkbox"
              />
              <span className="break-anywhere">{getRecordLabel(document)}</span>
            </label>
          </div>
        ))}
      </SelectionPanel>
      <SelectionPanel emptyMessage="No available items" title="Not selected">
        {availableDocuments.map((document) => (
          <label
            className="flex items-start gap-2 rounded-md border border-slate-200/80 bg-white/80 p-2 text-sm text-slate-700"
            key={document.id}
          >
            <input
              className="mt-1"
              onChange={() => onChange([...selectedIds, document.id])}
              type="checkbox"
            />
            <span className="break-anywhere">{getRecordLabel(document)}</span>
          </label>
        ))}
      </SelectionPanel>
    </fieldset>
  )
}

function SelectionPanel({
  children,
  emptyMessage,
  onDragOver,
  onDrop,
  title,
}: {
  children: React.ReactNode
  emptyMessage: string
  onDragOver?: React.DragEventHandler<HTMLDivElement>
  onDrop?: React.DragEventHandler<HTMLDivElement>
  title: string
}) {
  const hasChildren = Children.count(children) > 0

  return (
    <section className="rounded-md border border-slate-200/80 bg-slate-50/45 p-2.5">
      <h3 className="mb-2 text-xs font-semibold text-slate-500">{title}</h3>
      <div
        className="grid max-h-72 min-h-12 gap-2 overflow-y-auto"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        {hasChildren ? children : <p className="py-2 text-sm text-slate-500">{emptyMessage}</p>}
      </div>
    </section>
  )
}

function DragHandle({
  label,
  onDragEnd,
  onDragStart,
}: {
  label: string
  onDragEnd: () => void
  onDragStart: () => void
}) {
  return (
    <button
      aria-label={`Drag to reorder ${label}`}
      className="edit-icon-button h-7 w-7 shrink-0 cursor-grab active:cursor-grabbing"
      draggable
      onDragEnd={onDragEnd}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', label)
        onDragStart()
      }}
      title="Drag to reorder"
      type="button"
    >
      <span aria-hidden="true" className="fa-solid fa-grip-vertical" />
    </button>
  )
}

function OrderButtons({
  canMoveDown,
  canMoveUp,
  label,
  onMoveDown,
  onMoveUp,
}: {
  canMoveDown: boolean
  canMoveUp: boolean
  label: string
  onMoveDown: () => void
  onMoveUp: () => void
}) {
  return (
    <span className="flex shrink-0 gap-1">
      <button
        aria-label={`Move ${label} up`}
        className="edit-icon-button h-7 w-7"
        disabled={!canMoveUp}
        onClick={onMoveUp}
        type="button"
      >
        <span aria-hidden="true" className="fa-solid fa-arrow-up" />
      </button>
      <button
        aria-label={`Move ${label} down`}
        className="edit-icon-button h-7 w-7"
        disabled={!canMoveDown}
        onClick={onMoveDown}
        type="button"
      >
        <span aria-hidden="true" className="fa-solid fa-arrow-down" />
      </button>
    </span>
  )
}

function ProfileExperiencesEditor({
  experiences,
  onChange,
  value,
}: {
  experiences: EditableRecord[]
  onChange: (value: JsonValue) => void
  value: JsonValue[]
}) {
  const [draggedId, setDraggedId] = useState<string>()
  const profileExperiences = value.filter(
    (entry): entry is JsonObject =>
      Boolean(entry) && typeof entry === 'object' && !Array.isArray(entry),
  )
  const experiencesById = new Map(experiences.map((experience) => [experience.id, experience]))
  const selectedExperiences = profileExperiences.flatMap((entry) => {
    const experience = experiencesById.get(String(entry.experienceId ?? ''))
    return experience ? [{ experience, profileExperience: entry }] : []
  })
  const availableExperiences = experiences
    .filter(
      (experience) => !profileExperiences.some((entry) => entry.experienceId === experience.id),
    )
    .sort(compareRecordsByLabel)

  function toggleExperience(experience: EditableRecord, checked: boolean) {
    if (!checked) {
      onChange(profileExperiences.filter((entry) => entry.experienceId !== experience.id))
      return
    }

    const highlightIds = Array.isArray(experience.highlights)
      ? experience.highlights.flatMap((highlight) =>
          highlight &&
          typeof highlight === 'object' &&
          !Array.isArray(highlight) &&
          typeof highlight.id === 'string'
            ? [highlight.id]
            : [],
        )
      : []

    onChange([
      ...profileExperiences,
      {
        experienceId: experience.id,
        print: true,
        highlightIds,
        downloadHighlightIds: highlightIds,
      },
    ])
  }

  function moveDraggedBefore(targetId?: string) {
    if (!draggedId) return

    const sourceIndex = profileExperiences.findIndex((entry) => entry.experienceId === draggedId)
    const targetIndex = targetId
      ? profileExperiences.findIndex((entry) => entry.experienceId === targetId)
      : profileExperiences.length - 1
    if (sourceIndex < 0 || sourceIndex === targetIndex) return

    const nextEntries = [...profileExperiences]
    const [draggedEntry] = nextEntries.splice(sourceIndex, 1)
    nextEntries.splice(targetIndex, 0, draggedEntry)

    if (
      nextEntries.some(
        (entry, index) => entry.experienceId !== profileExperiences[index]?.experienceId,
      )
    ) {
      onChange(nextEntries)
    }
  }

  return (
    <div className="grid gap-3">
      <SelectionPanel
        emptyMessage="No selected experiences"
        onDragOver={(event) => {
          event.preventDefault()
          if (event.target === event.currentTarget) moveDraggedBefore()
        }}
        onDrop={() => setDraggedId(undefined)}
        title="Selected"
      >
        {selectedExperiences.map(({ experience }) => (
          <div
            className={`rounded-md border border-slate-200/80 bg-white/80 p-2.5 ${draggedId === experience.id ? 'opacity-50' : ''}`}
            key={experience.id}
            onDragEnter={() => moveDraggedBefore(experience.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              event.stopPropagation()
              setDraggedId(undefined)
            }}
          >
            <div className="flex items-start gap-2">
              <DragHandle
                label={getRecordLabel(experience)}
                onDragEnd={() => setDraggedId(undefined)}
                onDragStart={() => setDraggedId(experience.id)}
              />
              <label className="flex min-w-0 flex-1 items-start gap-2 text-sm font-semibold text-slate-800">
                <input
                  checked
                  className="mt-1"
                  onChange={() => toggleExperience(experience, false)}
                  type="checkbox"
                />
                <span>{getRecordLabel(experience)}</span>
              </label>
            </div>
          </div>
        ))}
      </SelectionPanel>
      <SelectionPanel emptyMessage="No available experiences" title="Not selected">
        {availableExperiences.map((experience) => (
          <label
            className="flex items-start gap-2 rounded-md border border-slate-200/80 bg-white/80 p-2 text-sm font-medium text-slate-700"
            key={experience.id}
          >
            <input
              className="mt-1"
              onChange={() => toggleExperience(experience, true)}
              type="checkbox"
            />
            <span>{getRecordLabel(experience)}</span>
          </label>
        ))}
      </SelectionPanel>
    </div>
  )
}

function ProfileExperienceEditor({
  experience,
  onChange,
  value,
}: {
  experience: EditableRecord
  onChange: (value: JsonObject) => void
  value: JsonObject
}) {
  const highlightIds = getStringArray(value.highlightIds)
  const downloadHighlightIds = getStringArray(value.downloadHighlightIds)
  const highlights = Array.isArray(experience.highlights)
    ? experience.highlights.filter(
        (highlight): highlight is JsonObject =>
          Boolean(highlight) && typeof highlight === 'object' && !Array.isArray(highlight),
      )
    : []
  const highlightsById = new Map(
    highlights.map((highlight) => [String(highlight.id ?? ''), highlight]),
  )
  const orderedHighlights = [
    ...highlightIds.flatMap((id) => {
      const highlight = highlightsById.get(id)
      return highlight ? [highlight] : []
    }),
    ...highlights.filter((highlight) => !highlightIds.includes(String(highlight.id ?? ''))),
  ]

  function toggleHighlight(id: string, checked: boolean) {
    onChange({
      ...value,
      highlightIds: checked
        ? [...highlightIds, id]
        : highlightIds.filter((highlightId) => highlightId !== id),
      downloadHighlightIds: checked
        ? downloadHighlightIds
        : downloadHighlightIds.filter((highlightId) => highlightId !== id),
    })
  }

  function toggleDownloadHighlight(id: string, checked: boolean) {
    onChange({
      ...value,
      downloadHighlightIds: checked
        ? [...downloadHighlightIds, id]
        : downloadHighlightIds.filter((highlightId) => highlightId !== id),
    })
  }

  function moveHighlight(index: number, direction: -1 | 1) {
    const nextHighlightIds = moveItem(highlightIds, index, direction)

    onChange({
      ...value,
      highlightIds: nextHighlightIds,
      downloadHighlightIds: nextHighlightIds.filter((id) => downloadHighlightIds.includes(id)),
    })
  }

  return (
    <div className="mt-3 grid gap-3 border-t border-slate-200 pt-3">
      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
        <input
          checked={value.print !== false}
          onChange={(event) => onChange({ ...value, print: event.target.checked })}
          type="checkbox"
        />
        Include when printing
      </label>
      {highlights.length > 0 ? (
        <div className="grid gap-2">
          <div className="grid grid-cols-[1fr_3.5rem_4.5rem_4rem] gap-2 text-xs font-bold text-slate-500">
            <span>Highlight</span>
            <span>Show</span>
            <span>Download</span>
            <span>Order</span>
          </div>
          {orderedHighlights.map((highlight) => {
            const id = String(highlight.id ?? '')
            const isIncluded = highlightIds.includes(id)
            const selectedIndex = highlightIds.indexOf(id)

            return (
              <div
                className="grid grid-cols-[1fr_3.5rem_4.5rem_4rem] items-start gap-2 text-xs text-slate-700"
                key={id}
              >
                <span className="break-anywhere">{String(highlight.value ?? id)}</span>
                <input
                  aria-label={`Show ${String(highlight.value ?? id)}`}
                  checked={isIncluded}
                  onChange={(event) => toggleHighlight(id, event.target.checked)}
                  type="checkbox"
                />
                <input
                  aria-label={`Download ${String(highlight.value ?? id)}`}
                  checked={downloadHighlightIds.includes(id)}
                  disabled={!isIncluded}
                  onChange={(event) => toggleDownloadHighlight(id, event.target.checked)}
                  type="checkbox"
                />
                {isIncluded ? (
                  <OrderButtons
                    canMoveDown={selectedIndex < highlightIds.length - 1}
                    canMoveUp={selectedIndex > 0}
                    label={String(highlight.value ?? id)}
                    onMoveDown={() => moveHighlight(selectedIndex, 1)}
                    onMoveUp={() => moveHighlight(selectedIndex, -1)}
                  />
                ) : (
                  <span />
                )}
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

function getStringArray(value: JsonValue | undefined) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction

  if (index < 0 || nextIndex < 0 || nextIndex >= items.length) {
    return items
  }

  const nextItems = [...items]
  const [item] = nextItems.splice(index, 1)
  nextItems.splice(nextIndex, 0, item)
  return nextItems
}

function getRecordLabel(document: EditableRecord) {
  if (document.role || document.company) {
    return [document.role, document.company].filter(Boolean).join(' at ')
  }

  if (document.degree || document.institution) {
    return [document.degree, document.institution].filter(Boolean).join(' at ')
  }

  return String(document.name ?? document.professionalDescription ?? document.id)
}

function compareRecordsByLabel(left: EditableRecord, right: EditableRecord) {
  return getRecordLabel(left).localeCompare(getRecordLabel(right), undefined, {
    sensitivity: 'base',
  })
}

function getSkillsForProfileLanguage(
  skills: EditableRecord[],
  categories: EditableRecord[],
  profileLanguage: string,
) {
  const normalizedProfileLanguage = profileLanguage.toLowerCase()

  return skills.filter((skill) => {
    const directCategory = categories.find((category) => category.id === skill.categoryId)
    const owningCategories = categories.filter(
      (category) => Array.isArray(category.skillIds) && category.skillIds.includes(skill.id),
    )
    const relatedCategories = directCategory ? [directCategory] : owningCategories

    if (!relatedCategories.length) return true

    return relatedCategories.some((category) => {
      const categoryLanguage =
        typeof category.language === 'string' ? category.language.trim().toLowerCase() : ''
      return !categoryLanguage || categoryLanguage === normalizedProfileLanguage
    })
  })
}

function RecordFieldsEditor({
  onChange,
  target,
  value,
}: {
  onChange: (value: JsonValue) => void
  target: EditActionTarget
  value: JsonObject
}) {
  const editableEntries = Object.entries(value).filter(
    ([key, fieldValue]) =>
      !['createdAt', 'id', 'updatedAt', 'version'].includes(key) && !Array.isArray(fieldValue),
  )

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {editableEntries.map(([key, fieldValue]) => {
        const isWideField =
          key === 'description' ||
          key === 'professionalDescription' ||
          key === 'professionalSummary' ||
          key === 'details'

        return (
          <div className={isWideField ? 'sm:col-span-2' : undefined} key={key}>
            <FieldEditor
              onChange={(nextFieldValue) => onChange({ ...value, [key]: nextFieldValue })}
              target={{ ...target, action: 'edit', fieldKey: key }}
              value={fieldValue ?? ''}
            />
          </div>
        )
      })}
    </div>
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
                  newSkillCategoryId: String(newSkill?.newSkillCategoryId ?? ''),
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
                  {String(skill.name ?? skill.id)}
                </option>
              ))}
            </select>
          </FieldLabel>
        ) : (
          <div className="grid gap-3 rounded-lg border border-slate-200 p-3">
            <FieldLabel label="Category">
              <SkillCategorySelect
                onChange={(categoryId) =>
                  onChange({
                    ids: selectedIds,
                    mode,
                    newSkillCategoryId: categoryId,
                    newSkillName: String(newSkill?.newSkillName ?? ''),
                  })
                }
                value={String(newSkill?.newSkillCategoryId ?? '')}
              />
            </FieldLabel>
            <FieldLabel label="Name">
              <input
                className="edit-input"
                onChange={(event) =>
                  onChange({
                    ids: selectedIds,
                    mode,
                    newSkillCategoryId: String(newSkill?.newSkillCategoryId ?? ''),
                    newSkillName: event.target.value,
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
            <span className="text-xs text-slate-500">{String(skill.categoryId ?? '')}</span>
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

function SkillCategorySelect({
  onChange,
  value,
}: {
  onChange: (value: string) => void
  value: string
}) {
  const { sections } = useEditActions()
  const categories = sections.find((section) => section.id === 'skillCategories')?.documents ?? []

  return (
    <select className="edit-input" onChange={(event) => onChange(event.target.value)} value={value}>
      <option value="">Choose a category</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {String(category.name ?? category.id)}
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
        <span className="sr-only">Master key</span>
        <input
          className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-normal text-slate-900 shadow-sm outline-none focus:border-blue-300"
          onChange={(event) => setValue(event.target.value)}
          placeholder="Master key"
          type="password"
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
      <div className="max-h-[calc(100vh-1.5rem)] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-4 shadow-2xl">
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

function EditLoadingOverlay({ label }: { label: string }) {
  return (
    <div
      aria-live="polite"
      className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/30 p-4 backdrop-blur-[2px]"
      role="status"
    >
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-800 shadow-2xl">
        <span aria-hidden="true" className="fa-solid fa-spinner fa-spin text-lg text-blue-700" />
        <span>{label}</span>
      </div>
    </div>
  )
}

function EditToastMessage({ onDismiss, toast }: { onDismiss: () => void; toast?: EditToast }) {
  const [errorDetails, setErrorDetails] = useState<string>()

  function openErrorDetails() {
    if (!toast) {
      return
    }

    setErrorDetails(toast.message)
    onDismiss()
  }

  return (
    <>
      {toast ? (
        <div
          className="fixed right-3 bottom-3 z-[60] flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-lg"
          role={toast.type === 'error' ? 'alert' : 'status'}
        >
          <span
            aria-hidden="true"
            className={
              toast.type === 'error'
                ? 'fa-solid fa-circle-exclamation text-red-700'
                : 'fa-solid fa-circle-check text-green-700'
            }
          />
          <span className="font-bold">
            {toast.type === 'error' ? 'Action failed.' : toast.message}
          </span>
          {toast.type === 'error' ? (
            <button
              className="btn btn-ghost btn-xs h-6 min-h-6 px-1.5"
              onClick={openErrorDetails}
              type="button"
            >
              Details
            </button>
          ) : null}
        </div>
      ) : null}
      {errorDetails ? (
        <EditModal onClose={() => setErrorDetails(undefined)} title="Error details">
          <p className="break-words text-sm leading-6 text-slate-700">{errorDetails}</p>
        </EditModal>
      ) : null}
    </>
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
      newSkillCategoryId: '',
      skillId: '',
    }
  }

  if (
    target.action === 'add' &&
    target.sectionId === 'profiles' &&
    target.fieldKey === 'experiences'
  ) {
    return {
      experienceId: '',
      print: true,
      highlightIds: [],
      downloadHighlightIds: [],
    }
  }

  if (target.action === 'add' && Array.isArray(target.value)) {
    return ''
  }

  if (target.action === 'add' && target.sectionId === 'skills') {
    return { categoryId: '', name: '' }
  }

  if (target.action === 'add' && !target.fieldKey) {
    return createNewRecordValue(target.sectionId)
  }

  return target.value ?? ''
}

function createNewRecordValue(sectionId: string): JsonObject {
  switch (sectionId) {
    case 'details':
      return {
        language: 'en',
        name: '',
        fullName: '',
        location: '',
        displayLocation: '',
        email: '',
        phone: '',
        nationality: '',
        professionalDescription: '',
        pageTitle: '',
        whyTitle: '',
        githubUrl: '',
        linkedInUrl: '',
        portfolioUrl: '',
      }
    case 'experience':
      return {
        language: 'en',
        company: '',
        role: '',
        location: '',
        description: '',
        startDate: '',
        endDate: '',
        highlights: [],
        skillIds: [],
      }
    case 'education':
      return {
        language: 'en',
        institution: '',
        degree: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        highlights: [],
        skillIds: [],
      }
    case 'profiles':
      return {
        language: 'en',
        name: '',
        personalInfoId: '',
        professionalSummary: '',
        experiences: [],
        educationIds: [],
        projectIds: [],
        skillIds: [],
        spokenLanguageIds: [],
      }
    case 'projects':
      return {
        language: 'en',
        name: '',
        description: '',
        skillIds: [],
        repositoryUrl: '',
        demoUrl: '',
      }
    case 'languages':
      return { language: 'en', name: '', proficiency: '' }
    case 'resumes':
      return {
        name: '',
        linkId: '',
        language: 'en',
        profileId: '',
        whyText: [],
        details: { company: '', position: '' },
      }
    case 'skillCategories':
      return { language: 'en', name: '', icon: '' }
    default:
      return {}
  }
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
  if (!loginValue.trim()) {
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
    return validateSkillRecord(collections, rawValue)
  }

  if (target.sectionId === 'profiles' && !target.fieldKey) {
    return validateProfileRecord(collections, rawValue)
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

    return validateNewRecord(target.sectionId, record)
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
    return valid('Document can be removed.')
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

function validateNewRecord(sectionId: string, record: JsonObject): ValidationResult {
  const requiredFields: Record<string, string[]> = {
    details: [
      'name',
      'fullName',
      'location',
      'displayLocation',
      'email',
      'phone',
      'nationality',
      'professionalDescription',
      'pageTitle',
      'whyTitle',
      'githubUrl',
      'linkedInUrl',
      'portfolioUrl',
    ],
    education: ['institution', 'degree', 'location', 'startDate', 'endDate', 'description'],
    experience: ['company', 'role', 'location', 'description', 'startDate', 'endDate'],
    languages: ['name', 'proficiency'],
    profiles: ['name', 'personalInfoId', 'professionalSummary'],
    projects: ['name', 'description'],
    resumes: ['name', 'linkId', 'profileId'],
    skillCategories: ['name', 'icon'],
  }
  const missingFields = (requiredFields[sectionId] ?? []).filter((field) => !(field in record))

  return missingFields.length > 0
    ? invalid(`Missing required fields: ${missingFields.join(', ')}.`)
    : valid('New record is compatible.')
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
    case 'educationIds':
      return validateDocumentReferences(collections.education, rawValue, 'education')
    case 'projectIds':
      return validateDocumentReferences(collections.projects, rawValue, 'project')
    case 'spokenLanguageIds':
      return validateDocumentReferences(collections.languages, rawValue, 'spoken language')
    case 'experiences':
      return Array.isArray(rawValue)
        ? rawValue.reduce<ValidationResult>(
            (result, entry) => (result.ok ? validateProfileExperience(collections, entry) : result),
            valid('Profile experiences are compatible.'),
          )
        : validateProfileExperience(collections, rawValue)
    case 'categoryId':
      return collections.skillCategories.some((category) => category.id === rawValue)
        ? valid('Skill category is compatible.')
        : invalid('Choose an existing skill category.')
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

function validateDocumentReferences(
  documents: { id: string }[],
  value: JsonValue,
  label: string,
): ValidationResult {
  const values = Array.isArray(value) ? value : [value]
  const hasInvalidReference = values.some(
    (id) => typeof id !== 'string' || !documents.some((document) => document.id === id),
  )

  return hasInvalidReference
    ? invalid(`A selected ${label} does not exist.`)
    : valid(`${formatKey(label)} references are compatible.`)
}

function validateProfileExperience(
  collections: EditableCollections,
  value: JsonValue,
): ValidationResult {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return invalid('Profile experience must be a structured object.')
  }

  if (
    typeof value.experienceId !== 'string' ||
    !collections.experience.some((experience) => experience.id === value.experienceId)
  ) {
    return invalid('Selected experience does not exist.')
  }

  if (value.print !== undefined && typeof value.print !== 'boolean') {
    return invalid('Print must be true or false.')
  }

  if (value.highlightIds !== undefined && !Array.isArray(value.highlightIds)) {
    return invalid('Highlight IDs must be a list.')
  }

  if (
    value.downloadHighlightIds !== undefined &&
    value.downloadHighlightIds !== null &&
    !Array.isArray(value.downloadHighlightIds)
  ) {
    return invalid('Download highlight IDs must be a list or null.')
  }

  return valid('Profile experience is compatible.')
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

    if (
      typeof rawValue.newSkillCategoryId !== 'string' ||
      !collections.skillCategories.some((category) => category.id === rawValue.newSkillCategoryId)
    ) {
      return invalid('Choose a category for the new skill.')
    }

    return valid('New skill is compatible.')
  }

  return invalid('Choose whether to link an existing skill or create a new one.')
}

function validateSkillRecord(collections: EditableCollections, value: JsonValue): ValidationResult {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return invalid('Skill must be a structured object.')
  }

  if (typeof value.name !== 'string' || !value.name.trim()) {
    return invalid('Skill needs a name.')
  }

  if (
    typeof value.categoryId !== 'string' ||
    !collections.skillCategories.some((category) => category.id === value.categoryId)
  ) {
    return invalid('Choose a category for the skill.')
  }

  return valid('Skill record is compatible.')
}

function validateProfileRecord(
  collections: EditableCollections,
  value: JsonValue,
): ValidationResult {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return invalid('Profile must be a structured object.')
  }

  if (typeof value.name !== 'string' || !value.name.trim()) {
    return invalid('Profile needs a name.')
  }

  if (typeof value.professionalSummary !== 'string') {
    return invalid('Professional summary must be text.')
  }

  const personalInfo = collections.details.find((details) => details.id === value.personalInfoId)

  if (!personalInfo) {
    return invalid('Choose personal details for the profile.')
  }

  if (personalInfo.language !== value.language) {
    return invalid('Personal details must use the same language as the profile.')
  }

  return valid('Profile is compatible.')
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

function valid(message: string): ValidationResult {
  return { message, ok: true }
}

function invalid(message: string): ValidationResult {
  return { message, ok: false }
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
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
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
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

      fieldValue.splice(target.itemIndex, 1)
      removeDeletedReferences(collections, target, removedItem)

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
    removeDocumentReferences(collections, target)
    documents.splice(documentIndex, 1)
  }
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

function removeDocumentReferences(collections: EditableCollections, target: EditActionTarget) {
  const documentId = target.documentId

  if (!documentId) {
    return
  }

  if (target.sectionId === 'experience') {
    for (const profile of collections.profiles) {
      profile.experiences = profile.experiences.filter(
        (experience) => experience.experienceId !== documentId,
      )
    }
  } else if (target.sectionId === 'education') {
    for (const profile of collections.profiles) {
      profile.educationIds = profile.educationIds.filter((id) => id !== documentId)
    }
  } else if (target.sectionId === 'projects') {
    for (const profile of collections.profiles) {
      profile.projectIds = profile.projectIds.filter((id) => id !== documentId)
    }
  } else if (target.sectionId === 'languages') {
    for (const profile of collections.profiles) {
      profile.spokenLanguageIds = profile.spokenLanguageIds.filter((id) => id !== documentId)
    }
  } else if (target.sectionId === 'skills') {
    removeSkillReferences(collections, documentId)
  }
}

function removeSkillReferences(collections: EditableCollections, skillId: string) {
  for (const document of [
    ...collections.education,
    ...collections.experience,
    ...collections.projects,
  ]) {
    document.skillIds = document.skillIds.filter((id) => id !== skillId)
  }

  for (const profile of collections.profiles) {
    const apiProfile = profile as unknown as { skillIds?: string[] }

    if (apiProfile.skillIds) {
      apiProfile.skillIds = apiProfile.skillIds.filter((id) => id !== skillId)
    }
  }
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
    categoryId: typeof value.newSkillCategoryId === 'string' ? value.newSkillCategoryId : '',
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

function createId(_prefix: string, _value: string) {
  return crypto.randomUUID()
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

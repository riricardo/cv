export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[]

export type JsonObject = { [key: string]: JsonValue | undefined }

export type EditableRecord = JsonObject & {
  id: string
  language?: string
  name?: string
  role?: string
  company?: string
  institution?: string
  degree?: string
  professionalDescription?: string
  description?: string
  professionalSummary?: string
  translationGroupId?: string
}

export type EditSection = {
  id: string
  title: string
  description: string
  documents: EditableRecord[]
}

import type React from 'react'
import { Link } from 'react-router-dom'
import type { JsonValue } from '../../types/edit.ts'
import {
  getReferencedRecord,
  getReferenceSubtitle,
  getReferenceTitle,
} from '../../data/edit/references.ts'
import { formatEditDate } from './dateFormatting.ts'
import { formatKey, isReferenceField, shouldDisplayField } from './documentHelpers.ts'

function JsonValueView({
  fieldKey,
  value,
}: {
  fieldKey?: string
  value: JsonValue | undefined
}): React.ReactNode {
  if (value === undefined || value === null) {
    return <span className="text-slate-400">-</span>
  }

  if (Array.isArray(value)) {
    if (!value.length) {
      return <span className="text-slate-400">[]</span>
    }

    return (
      <ul className="space-y-2">
        {value.map((item, index) => (
          <li className="break-anywhere rounded-md bg-slate-50 p-3" key={index}>
            <JsonValueView fieldKey={fieldKey} value={item} />
          </li>
        ))}
      </ul>
    )
  }

  if (typeof value === 'object') {
    return (
      <dl className="space-y-2">
        {Object.entries(value)
          .filter(([key]) => shouldDisplayField(key))
          .map(([key, nestedValue]) => (
            <div className="grid gap-1 sm:grid-cols-[10rem_1fr]" key={key}>
              <dt className="break-anywhere font-bold text-slate-600">{formatKey(key)}</dt>
              <dd className="min-w-0">
                <JsonValueView fieldKey={key} value={nestedValue} />
              </dd>
            </div>
          ))}
      </dl>
    )
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }

  if (typeof value === 'string') {
    if (fieldKey === 'publicLink') {
      return (
        <Link
          className="break-anywhere font-bold text-blue-800 hover:text-blue-950"
          to={`/${value}`}
        >
          /#/{value}
        </Link>
      )
    }

    const formattedDate = formatEditDate(fieldKey, value)

    if (formattedDate) {
      return <span className="break-anywhere">{formattedDate}</span>
    }
  }

  if (typeof value === 'string' && isReferenceField(fieldKey)) {
    const referencedRecord = getReferencedRecord(value)

    if (referencedRecord) {
      return <ReferenceCard record={referencedRecord} />
    }
  }

  return <span className="break-anywhere">{value}</span>
}

function ReferenceCard({ record }: { record: ReturnType<typeof getReferencedRecord> }) {
  if (!record) {
    return null
  }

  const subtitle = getReferenceSubtitle(record)

  return (
    <div className="rounded-md bg-slate-50 px-3 py-2">
      <p className="break-anywhere font-bold text-slate-900">{getReferenceTitle(record)}</p>
      {subtitle ? (
        <p className="break-anywhere mt-1 text-xs leading-5 text-slate-600">{subtitle}</p>
      ) : null}
    </div>
  )
}

export default JsonValueView

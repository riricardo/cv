const dateTimeFormatter = new Intl.DateTimeFormat('en-IE', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const monthFormatter = new Intl.DateTimeFormat('en-IE', {
  month: 'short',
  year: 'numeric',
})

const dateFormatter = new Intl.DateTimeFormat('en-IE', {
  dateStyle: 'medium',
})

export function formatEditDate(fieldKey: string | undefined, value: string) {
  if (!fieldKey || !/(At|Date)$/.test(fieldKey)) {
    return undefined
  }

  if (/^\d{4}-\d{2}$/.test(value)) {
    return monthFormatter.format(new Date(`${value}-01T00:00:00Z`))
  }

  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) {
    return undefined
  }

  return fieldKey.endsWith('At')
    ? dateTimeFormatter.format(parsedDate)
    : dateFormatter.format(parsedDate)
}

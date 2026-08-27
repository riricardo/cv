import type { Language } from '../../types/index.ts'

type PeriodTextProps = {
  endDate?: string
  language: Language
  presentText: string
  startDate: string
}

function formatMonthYear(value: string, language: Language, presentText: string) {
  const normalizedValue = value.toLowerCase()

  if (normalizedValue === 'present' || normalizedValue === presentText.toLowerCase()) {
    return presentText
  }

  const [year, month = '01'] = value.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(language.startsWith('pt') ? 'pt-BR' : 'en-US', {
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatPeriod(
  startDate: string,
  endDate: string | undefined,
  language: Language,
  presentText: string,
) {
  const start = formatMonthYear(startDate, language, presentText)
  const end = endDate ? formatMonthYear(endDate, language, presentText) : presentText

  return `${start} - ${end}`
}

function PeriodText({ endDate, language, presentText, startDate }: PeriodTextProps) {
  return (
    <p className="text-sm font-medium whitespace-nowrap text-slate-500 sm:ml-4 sm:min-w-36 sm:text-right">
      {formatPeriod(startDate, endDate, language, presentText)}
    </p>
  )
}

export default PeriodText

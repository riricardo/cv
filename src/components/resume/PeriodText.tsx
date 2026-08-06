import type { Language } from '../../types/index.ts'
import { resumeTranslations } from '../../data/resume-translations.ts'

type PeriodTextProps = {
  endDate?: string
  language: Language
  startDate: string
}

function formatMonthYear(value: string, language: Language) {
  const normalizedValue = value.toLowerCase()

  if (
    normalizedValue === 'present' ||
    normalizedValue === resumeTranslations[language].present.toLowerCase()
  ) {
    return resumeTranslations[language].present
  }

  const [year, month = '01'] = value.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(language === 'pt' ? 'pt-BR' : 'en-US', {
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatPeriod(startDate: string, endDate: string | undefined, language: Language) {
  const start = formatMonthYear(startDate, language)
  const end = endDate ? formatMonthYear(endDate, language) : resumeTranslations[language].present

  return `${start} - ${end}`
}

function PeriodText({ endDate, language, startDate }: PeriodTextProps) {
  return (
    <p className="text-sm font-medium whitespace-nowrap text-slate-500 sm:ml-4 sm:min-w-36 sm:text-right">
      {formatPeriod(startDate, endDate, language)}
    </p>
  )
}

export default PeriodText

import type { Language } from '../../types/index.ts'
import { resumeTranslations } from '../../data/resume-translations.ts'

type PeriodTextProps = {
  endDate?: string
  language: Language
  startDate: string
}

function formatMonthYear(value: string, language: Language) {
  if (value.toLowerCase() === 'present') {
    return resumeTranslations[language].present
  }

  const [year, month = '01'] = value.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)

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
    <p className="text-sm font-medium text-slate-500">
      {formatPeriod(startDate, endDate, language)}
    </p>
  )
}

export default PeriodText

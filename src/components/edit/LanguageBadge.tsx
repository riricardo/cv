function LanguageBadge({ language }: { language: string }) {
  return (
    <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-bold uppercase tracking-normal text-blue-800">
      {language}
    </span>
  )
}

export default LanguageBadge

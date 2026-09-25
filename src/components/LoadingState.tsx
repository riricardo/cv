function LoadingState({ label, fullScreen = false }: { label: string; fullScreen?: boolean }) {
  return (
    <div
      aria-live="polite"
      className={
        fullScreen
          ? 'grid min-h-screen place-items-center bg-slate-50 p-4 text-slate-800'
          : 'grid min-h-[18rem] place-items-center p-6 text-slate-800'
      }
      role="status"
    >
      <div className="flex flex-col items-center gap-3">
        <span
          aria-hidden="true"
          className="h-9 w-9 animate-spin rounded-full border-3 border-blue-100 border-t-blue-700"
        />
        <p className="text-sm font-semibold text-slate-600">{label}</p>
      </div>
    </div>
  )
}

export default LoadingState

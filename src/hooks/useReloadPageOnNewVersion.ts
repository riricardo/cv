import { useEffect } from 'react'

function useReloadPageOnNewVersion() {
  useEffect(() => {
    let isDisposed = false

    async function reloadIfPublishedVersionChanged() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}app-version.json?t=${Date.now()}`,
          {
            cache: 'no-store',
          },
        )

        if (!response.ok) {
          return
        }

        const payload = (await response.json()) as { version?: string }

        if (
          !isDisposed &&
          payload.version &&
          payload.version !== import.meta.env.VITE_APP_VERSION
        ) {
          window.location.reload()
        }
      } catch {
        // Version checks are best-effort; the app should still work offline or during deploys.
      }
    }

    reloadIfPublishedVersionChanged()

    return () => {
      isDisposed = true
    }
  }, [])
}

export default useReloadPageOnNewVersion

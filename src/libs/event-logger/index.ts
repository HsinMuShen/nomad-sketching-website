import { analytics, logEvent as logFireBaseEvent } from 'libs/firebase'

const logEvent = (event: string, data?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && !navigator.onLine) return
  if (!analytics) return

  try {
    logFireBaseEvent(analytics, event, data)
  } catch {
    // Ignore analytics failures to avoid breaking runtime behavior.
  }
}

export { logEvent }

import { analytics, logEvent as logFireBaseEvent } from 'libs/firebase'

const logEvent = (event: string, data?: Record<string, unknown>) => {
  logFireBaseEvent(analytics, event, data)
}

export { logEvent }

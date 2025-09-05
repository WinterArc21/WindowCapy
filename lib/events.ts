export type EventHook = (event: string, payload?: Record<string, any>) => Promise<void> | void
export const onNotify: EventHook = async (_event, _payload) => { /* push notifications Phase 2 */ }

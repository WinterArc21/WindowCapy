export const BLOCKED_WORDS = [
  'suicide',
  'kill yourself',
  'racial slur 1',
  'racial slur 2',
] as const

export function checkBlockedWords(text: string): string[] {
  const lower = text.toLowerCase()
  return BLOCKED_WORDS.filter((w) => lower.includes(w.toLowerCase())) as string[]
}

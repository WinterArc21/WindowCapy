import { describe, it, expect } from 'vitest'
import { checkBlockedWords } from '../lib/blocklist'

describe('blocklist', () => {
  it('flags blocked terms', () => {
    expect(checkBlockedWords('this includes suicide.')).toContain('suicide')
  })
  it('returns empty when clean', () => {
    expect(checkBlockedWords('hello world')).toEqual([])
  })
})

import { describe, it, expect } from 'vitest'
import { StorySchema } from '../lib/validation'

describe('validation', () => {
  it('accepts minimal valid story', () => {
    const res = StorySchema.safeParse({ content: 'hi', privacy: 'public' })
    expect(res.success).toBe(true)
  })
  it('rejects empty content', () => {
    const res = StorySchema.safeParse({ content: '', privacy: 'public' })
    expect(res.success).toBe(false)
  })
})

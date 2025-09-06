import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render } from '@testing-library/react'
import ReactionBar from '../components/story/ReactionBar'

describe('ReactionBar', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ counts: [], mine: [] }) }))
  })
  it('renders without crashing', async () => {
    render(<ReactionBar storyId='s1' />)
    expect(true).toBe(true)
  })
})

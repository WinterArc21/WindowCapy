import { z } from 'zod'

export const StorySchema = z.object({
  content: z.string().min(1).max(2000),
  privacy: z.enum(['public', 'followers']),
  is_anonymous: z.boolean().default(false),
  is_draft: z.boolean().default(false),
  sensitive: z.boolean().default(false),
  image_url: z.string().url().nullable().optional(),
  audio_url: z.string().nullable().optional(),
})

export type StoryInput = z.infer<typeof StorySchema>

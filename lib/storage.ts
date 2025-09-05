import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const client = url && anon ? createClient(url, anon) : null

export async function uploadImage(file: File) {
  if (!client) throw new Error('Supabase not configured')
  const path = `images/${Date.now()}-${file.name}`
  const { error } = await client.storage.from('images').upload(path, file, { upsert: false })
  if (error) throw error
  const { data } = client.storage.from('images').getPublicUrl(path)
  return data.publicUrl
}

export async function uploadAudio(file: File) {
  if (!client) throw new Error('Supabase not configured')
  const path = `audio/${Date.now()}-${file.name}`
  const { error } = await client.storage.from('audio').upload(path, file, { upsert: false })
  if (error) throw error
  return path
}

export async function getAudioSignedUrl(path: string, expiresIn = 60 * 60) {
  if (!client) throw new Error('Supabase not configured')
  const { data, error } = await client.storage.from('audio').createSignedUrl(path, expiresIn)
  if (error) throw error
  return data.signedUrl
}

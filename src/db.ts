import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jksvrggrjehcrogropes.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM2NjkyNTExLCJleHAiOjE5NTIyNjg1MTF9.KSFvjunAwUyNn-mP68pnO8bAo_KOMX3DdF_PjLpxeV4'

export const db = createClient(supabaseUrl, supabaseAnonKey)
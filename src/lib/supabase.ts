import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database tables
export interface Article {
  id: string
  title: string
  title_en?: string
  slug: string
  content: string
  excerpt?: string
  category: string
  image_url?: string
  is_published: boolean
  created_at: string
  updated_at?: string
}

export interface Test {
  id: string
  subject: string
  questions: Question[]
  duration_minutes: number
  is_active: boolean
}

export interface Question {
  id: string
  text: string
  text_en?: string
  options: string[]
  correct_answer: number
  explanation?: string
}

export interface Note {
  id: string
  title: string
  subject: string
  file_url: string
  file_size: string
  created_at: string
}

export interface Course {
  id: string
  title: string
  description: string
  features: string[]
  price?: number
  is_bestseller: boolean
  enrollment_url?: string
  image_url?: string
}

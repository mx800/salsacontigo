import { createClient } from '@supabase/supabase-js'

// These will be populated once Supabase project is created
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Contact form submission
export async function submitContactForm(data: {
  name: string
  email: string
  phone?: string
  message: string
}) {
  try {
    const { data: result, error } = await supabase.functions.invoke('contact-form', {
      body: data
    })

    if (error) throw error
    return { success: true, data: result }
  } catch (error) {
    console.error('Contact form error:', error)
    return { success: false, error }
  }
}

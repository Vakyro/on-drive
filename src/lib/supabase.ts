import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      persistSession: true, // Esto asegura que la sesión se almacene
      autoRefreshToken: true, // Refresca automáticamente los tokens expirados
      detectSessionInUrl: true, // Maneja las redirecciones de OAuth
    },
  }
)

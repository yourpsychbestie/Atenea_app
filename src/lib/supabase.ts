import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// La app funciona en "modo demo" cuando no hay credenciales reales de Supabase:
// los hooks de src/hooks/ detectan este flag y caen a datos mock + localStorage.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Si no hay credenciales, igual creamos un cliente con placeholders válidos
// (una URL bien formada) para que createClient no truene al importar el módulo.
export const supabase = createClient(
  supabaseUrl && supabaseUrl.length > 0 ? supabaseUrl : 'https://placeholder.supabase.co',
  supabaseAnonKey && supabaseAnonKey.length > 0 ? supabaseAnonKey : 'placeholder-anon-key',
)

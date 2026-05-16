import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lfmbhdtrxmtxjwyfzdcz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Ne1rajOeqAJETBoXcIvA6A_l0-NBH1f'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

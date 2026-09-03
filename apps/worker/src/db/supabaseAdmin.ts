import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Carrega .env da raiz ou local
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('your-project') || supabaseServiceKey.includes('your-service-role')) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

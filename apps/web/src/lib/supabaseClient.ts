import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://bufuiweuvofwqmgnzgfl.supabase.co';
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1ZnVpd2V1dm9md3FtZ256Z2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzOTc3MjIsImV4cCI6MjEwMzk3MzcyMn0.FgwQaY7P8IQ8I3SRGckAY68rkf1lrgu8xlFmBRy9XN0';

const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_URL : undefined) || 
  defaultUrl;

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_ANON_KEY : undefined) || 
  defaultAnonKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') && 
  !supabaseAnonKey.includes('your-anon-key')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

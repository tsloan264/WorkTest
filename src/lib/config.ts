// The Supabase URL and anon/publishable key are safe to expose in client code —
// Row Level Security on every table is what actually protects the data.
// These fallbacks let the app run even before NEXT_PUBLIC_* env vars are
// configured on the hosting platform.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://djtksokksgyavmqubboo.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdGtzb2trc2d5YXZtcXViYm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNzI5NTMsImV4cCI6MjA5OTc0ODk1M30.Y_fmS7eAiu19XTzgbrCZqHjOCaRyR7oWlMBrMsdoiG0';

export const ORDER_NOTIFICATION_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || 'tsloan264@gmail.com';

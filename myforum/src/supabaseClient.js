import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://byinnszewvkykhoxojgs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5aW5uc3pld3ZreWtob3hvamdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5NzE4NTQsImV4cCI6MjA0NzU0Nzg1NH0.IZDPgMWoJJtjcBtn00giXfgkOGsW-UwMGSTaD5CAC5o';
export const supabase = createClient(supabaseUrl, supabaseKey);

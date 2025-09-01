import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://cewmylpshuskuoomkzox.supabase.co';
const suparoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNld215bHBzaHVza3Vvb21rem94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5MjQ2NCwiZXhwIjoyMDY4NzY4NDY0fQ.9xHBk9qW-g_eK2jWrkBmAL-KSMbYxdxN8DwlXhef6kw';

if (!supabaseUrl || !suparoleKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseAdmin = createClient(supabaseUrl, suparoleKey);

export default supabaseAdmin;
import { createClient } from "@supabase/supabase-js";
const supabase_url='https://cewmylpshuskuoomkzox.supabase.co';
const supabase_api_key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNld215bHBzaHVza3Vvb21rem94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxOTI0NjQsImV4cCI6MjA2ODc2ODQ2NH0.hA-SvJV44VIDOV-H5iE95OOil2yo2XxcIaE5MKGH-Vw';
const supabase=createClient(supabase_url,supabase_api_key)

export default supabase;
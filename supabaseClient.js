const SUPABASE_URL = 'https://cpktnkjahurhvhabwnsf.supabase.co';
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwa3Rua2phaHVyaHZoYWJ3bnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTAxMjIsImV4cCI6MjA2MTAyNjEyMn0.YRYNYYTa4OGSG2a1tnNPGtp4KPf-tp9ooY4l0ZV3CDU";

window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

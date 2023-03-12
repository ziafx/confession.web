import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pxvysuzaadwinucamleq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4dnlzdXphYWR3aW51Y2FtbGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgxODcwMTgsImV4cCI6MTk5Mzc2MzAxOH0.WRVLgNQhUuuq91dyUn22ybJNZJcVD4fPgZy-ylXZy3s";
const supabase = createClient(supabaseUrl, supabaseKey);


export default supabase;

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://muecabrckvnyxnolovwb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11ZWNhYnJja3ZueXhub2xvdndiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4OTQ3NzgsImV4cCI6MjA1MDQ3MDc3OH0.dVyempXjcQPFgqvlH8H82V_xsgFHnaeJOobIiFnMb4I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
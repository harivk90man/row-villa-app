import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fodgucoubcvlfefbxlua.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZGd1Y291YmN2bGZlZmJ4bHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxODA4MTMsImV4cCI6MjA2OTc1NjgxM30.ZNEP-MQkowIbx6TtvmL3x7uIm0y6pdWhxHs_sPfSmvc';
export const supabase = createClient(supabaseUrl, supabaseKey);

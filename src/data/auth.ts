import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://gwghbfdegklrnxkwgxyx.supabase.co';
const supabaseKey = 'moo'; //process.env.SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey!);

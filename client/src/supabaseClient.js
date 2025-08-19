import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Key starts with:", supabaseAnonKey?.slice(0, 10));

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

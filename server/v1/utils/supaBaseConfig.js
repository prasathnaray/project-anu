import { createClient } from '@supabase/supabase-js'
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const SUPABASE_URL = process.env.SUPABASE_PROJECT_URL
const SUPABASE_KEY = process.env.SUPABASE_API_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
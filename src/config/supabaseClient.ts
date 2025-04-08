const { createClient } = require('@supabase/supabase-js');

// Inisialisasi Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_KEY  
);

module.exports = {supabase};
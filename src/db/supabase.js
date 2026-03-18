const { createClient } = require('@supabase/supabase-js');

// Service key has full DB access — never expose this to the frontend
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = supabase;

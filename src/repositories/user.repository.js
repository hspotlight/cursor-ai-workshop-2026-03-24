const supabase = require('../db/supabase');

async function findByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return null;
  return data;
}

async function create(email, passwordHash) {
  const { data, error } = await supabase
    .from('users')
    .insert({ email, password: passwordHash })
    .select()
    .single();

  if (error) throw error;
  return data;
}

module.exports = { findByEmail, create };

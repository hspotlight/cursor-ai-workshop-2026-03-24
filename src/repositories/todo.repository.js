const supabase = require('../db/supabase');

async function findAllByUser(userId) {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

async function create(userId, title) {
  const { data, error } = await supabase
    .from('todos')
    .insert({ user_id: userId, title })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function update(id, userId, fields) {
  const { data, error } = await supabase
    .from('todos')
    .update(fields)
    .eq('id', id)
    .eq('user_id', userId) // user can only update their own todos
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function remove(id, userId) {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)
    .eq('user_id', userId); // user can only delete their own todos

  if (error) throw error;
}

module.exports = { findAllByUser, create, update, remove };

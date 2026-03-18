-- Run this in the Supabase SQL editor to set up the database

-- Users table
create table users (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  password   text not null,        -- bcrypt hash, never plain text
  created_at timestamptz not null default now()
);

-- Todos table
create table todos (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references users(id) on delete cascade,
  title      text not null,
  completed  boolean not null default false,
  created_at timestamptz not null default now()
);

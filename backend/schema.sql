-- ═══════════════════════════════════════════════════════
--  VidyāMitra — Supabase Database Schema
--  Run this in the Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Users ──────────────────────────────────────────────
create table if not exists users (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  email         text unique not null,
  password_hash text not null,
  created_at    timestamptz default now()
);

-- ── Resume Reports ─────────────────────────────────────
create table if not exists resume_reports (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references users(id) on delete cascade,
  filename        text,
  skills          jsonb default '[]',
  gaps            jsonb default '[]',
  summary         text,
  readiness_score integer default 0,
  created_at      timestamptz default now()
);

-- ── Learning Plans ─────────────────────────────────────
create table if not exists learning_plans (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references users(id) on delete cascade,
  target_role text not null,
  plan        jsonb not null,
  created_at  timestamptz default now()
);

-- ── Interview Sessions ─────────────────────────────────
create table if not exists interview_sessions (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references users(id) on delete cascade,
  role       text not null,
  level      text default 'Mid',
  questions  jsonb not null,
  answers    jsonb default '[]',
  status     text default 'in_progress',
  created_at timestamptz default now()
);

-- ── Quizzes ────────────────────────────────────────────
create table if not exists quizzes (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references users(id) on delete cascade,
  topic      text not null,
  questions  jsonb not null,
  responses  jsonb default '{}',
  score      integer,
  status     text default 'pending',
  created_at timestamptz default now()
);

-- ── Row Level Security ─────────────────────────────────
alter table users             enable row level security;
alter table resume_reports    enable row level security;
alter table learning_plans    enable row level security;
alter table interview_sessions enable row level security;
alter table quizzes           enable row level security;

-- Note: Since we use SERVICE_ROLE_KEY in the backend,
-- RLS policies will be bypassed for backend operations.
-- Add user-facing policies if you switch to ANON key:
--   create policy "Users own their data" on resume_reports
--     for all using (auth.uid() = user_id);

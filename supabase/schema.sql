create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.trading_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_name text not null,
  account_number text,
  server_name text,
  platform text not null,
  account_type text not null default 'LIVE',
  currency text not null default 'USC',
  balance numeric(18, 2) not null default 0,
  connection_type text not null default 'API',
  last_synced_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid not null references public.trading_accounts(id) on delete cascade,
  symbol text not null,
  side text not null check (side in ('buy', 'sell')),
  lots numeric(12, 4) not null,
  entry_price numeric(18, 8) not null,
  exit_price numeric(18, 8),
  pnl numeric(18, 2) not null default 0,
  fees numeric(18, 2) not null default 0,
  opened_at timestamptz not null,
  closed_at timestamptz,
  notes text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trade_id uuid references public.trades(id) on delete set null,
  title text not null,
  body text not null default '',
  mood text,
  checklist jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists trading_accounts_user_created_idx
  on public.trading_accounts (user_id, created_at desc);

create index if not exists trades_account_opened_idx
  on public.trades (account_id, opened_at desc);

create index if not exists trades_user_closed_idx
  on public.trades (user_id, closed_at desc)
  where closed_at is not null;

create index if not exists journal_entries_user_created_idx
  on public.journal_entries (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.trading_accounts enable row level security;
alter table public.trades enable row level security;
alter table public.journal_entries enable row level security;

create policy "profiles are owner readable"
  on public.profiles for select
  using ((select auth.uid()) = id);

create policy "profiles are owner writable"
  on public.profiles for all
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "accounts are owner scoped"
  on public.trading_accounts for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "trades are owner scoped"
  on public.trades for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "journal entries are owner scoped"
  on public.journal_entries for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

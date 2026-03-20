-- Oddex initial schema

-- signals: scored market snapshots every 5 min
create table if not exists signals (
  id uuid primary key default gen_random_uuid(),
  market_id text not null,
  signal_score int not null,
  yes_price numeric not null,
  no_price numeric not null,
  volume_24h numeric not null,
  created_at timestamptz not null default now()
);

create index if not exists signals_market_id_idx on signals(market_id);
create index if not exists signals_created_at_idx on signals(created_at desc);
create index if not exists signals_score_idx on signals(signal_score desc);

-- trader_scores: computed trader profiles
create table if not exists trader_scores (
  wallet text primary key,
  score int not null default 0,
  win_rate numeric not null default 0,
  specialty text not null default 'GENERALIST',
  total_volume numeric not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists trader_scores_score_idx on trader_scores(score desc);

-- alert_prefs: per-wallet alert settings
create table if not exists alert_prefs (
  wallet text primary key,
  telegram_chat_id text,
  min_score int not null default 70,
  crypto_alerts bool not null default true,
  football_alerts bool not null default true,
  updated_at timestamptz not null default now()
);

-- Row Level Security
alter table signals enable row level security;
alter table trader_scores enable row level security;
alter table alert_prefs enable row level security;

-- Public read access for signals and trader_scores
create policy "signals_public_read" on signals for select using (true);
create policy "trader_scores_public_read" on trader_scores for select using (true);

-- alert_prefs: only own wallet can read/write
create policy "alert_prefs_own_wallet" on alert_prefs
  using (wallet = current_setting('request.jwt.claims', true)::json->>'sub')
  with check (wallet = current_setting('request.jwt.claims', true)::json->>'sub');

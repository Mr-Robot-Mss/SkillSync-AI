create extension if not exists pgcrypto;

create table if not exists public.coach_goals (
    id uuid primary key default gen_random_uuid(),
    user_id text not null unique,
    title text not null check (char_length(title) between 3 and 160),
    description text,
    target_date date,
    progress integer not null default 0 check (progress between 0 and 100),
    status text not null default 'active' check (status in ('active', 'completed', 'paused')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists coach_goals_user_id_idx
    on public.coach_goals (user_id);

create or replace function public.set_coach_goals_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists coach_goals_updated_at on public.coach_goals;
create trigger coach_goals_updated_at
before update on public.coach_goals
for each row execute function public.set_coach_goals_updated_at();

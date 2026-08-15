create extension if not exists "pgcrypto";

create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    username text not null unique,
    created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.statistics (
    user_id uuid primary key references auth.users (id) on delete cascade,
    total_lessons integer not null default 0,
    average_wpm integer not null default 0,
    best_wpm integer not null default 0,
    accuracy integer not null default 0,
    total_keys bigint not null default 0,
    time_spent bigint not null default 0
);

create table if not exists public.settings (
    user_id uuid primary key references auth.users (id) on delete cascade,
    sound boolean not null default true,
    theme text not null default 'light',
    animation_speed integer not null default 1
);

create table if not exists public.progress (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    lesson_id integer not null,
    completed boolean not null default false,
    stars integer not null default 0 check (stars between 0 and 3),
    accuracy integer not null default 0,
    best_wpm integer not null default 0,
    updated_at timestamptz not null default timezone('utc', now()),
    unique (user_id, lesson_id)
);

create table if not exists public.lesson_attempts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    lesson_id integer not null,
    wpm integer not null default 0,
    accuracy integer not null default 0,
    mistakes integer not null default 0,
    completed_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;
alter table public.statistics enable row level security;
alter table public.settings enable row level security;
alter table public.progress enable row level security;
alter table public.lesson_attempts enable row level security;

create policy "profiles own rows"
on public.profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "statistics own rows"
on public.statistics
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "settings own rows"
on public.settings
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "progress own rows"
on public.progress
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "lesson_attempts own rows"
on public.lesson_attempts
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, username)
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))
    )
    on conflict (id) do nothing;

    insert into public.statistics (user_id)
    values (new.id)
    on conflict (user_id) do nothing;

    insert into public.settings (user_id)
    values (new.id)
    on conflict (user_id) do nothing;

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

# MalluTyping ⌨️

MalluTyping is an interactive, open-source Malayalam touch typing trainer designed to help users master Malayalam touch typing. The application utilizes a retro neo-brutalism design style and features high-fidelity typewriter mechanical switch clacks, a 3D physical-style virtual keyboard, guided lesson stages, and database synchronization.

## 🚀 Features

* **Guided Lesson Map**: Learn Malayalam typing in structured progression groups (basics, signs, fluid drills).
* **3D Virtual Keyboard**: Visual mechanical keyboard highlighting correctly typed, current, and wrong keys dynamically.
* **Realistic Sound Effects**: Implements a reusable global `AudioContext` to deliver latency-free mechanical key clicks that do not degrade or stutter over long sessions.
* **Progress Autosave**: Resumes your exact lesson and stage index where you left off.
* **Sleek Retro Style**: Beautiful light blue-turquoise retro styling with vibrant violet highlights.
* **Open Source & Extensible**: Fully set up for community contributions.

---

## 🛠️ Tech Stack

* **Frontend**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
* **Styling**: Tailwind CSS & Custom CSS
* **Database & Auth**: [Supabase](https://supabase.com/)
* **Icons**: [@tabler/icons-react](https://tabler.com/icons)

---

## 💻 Local Setup & Development

### 1. Prerequisites
Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18+ recommended)
* [npm](https://www.npmjs.com/)
* A free [Supabase](https://supabase.com/) account

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/MrNihalT/mallutyping.git
cd mallutyping
npm install
```

### 3. Environment Variables
Create a file named `.env.local` in the root of the project and populate it with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Database Schema

To set up your database tables, go to your **Supabase SQL Editor** and run the following queries to create the tables, enable row-level security (RLS), and configure user profile triggers:

```sql
-- Enable PGCrypto extension
create extension if not exists "pgcrypto";

-- Profiles Table
create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    username text not null unique,
    created_at timestamptz not null default timezone('utc', now())
);

-- User Progress Table
create table if not exists public.progress (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    lesson_id integer not null,
    completed boolean not null default false,
    stars integer not null default 0 check (stars between 0 and 3),
    accuracy integer not null default 0,
    best_wpm integer not null default 0,
    current_stage_index integer not null default 0,
    updated_at timestamptz not null default timezone('utc', now()),
    unique (user_id, lesson_id)
);

-- Statistics Table
create table if not exists public.statistics (
    user_id uuid primary key references auth.users (id) on delete cascade,
    total_lessons integer not null default 0,
    average_wpm integer not null default 0,
    best_wpm integer not null default 0,
    accuracy integer not null default 0,
    total_keys bigint not null default 0,
    time_spent bigint not null default 0
);

-- Settings Table
create table if not exists public.settings (
    user_id uuid primary key references auth.users (id) on delete cascade,
    sound boolean not null default true,
    theme text not null default 'light',
    animation_speed integer not null default 1
);

-- Lesson Attempts Log Table
create table if not exists public.lesson_attempts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    lesson_id integer not null,
    wpm integer not null default 0,
    accuracy integer not null default 0,
    mistakes integer not null default 0,
    completed_at timestamptz not null default timezone('utc', now())
);

-- Enable RLS Policies
alter table public.profiles enable row level security;
alter table public.statistics enable row level security;
alter table public.settings enable row level security;
alter table public.progress enable row level security;
alter table public.lesson_attempts enable row level security;

-- Row Level Security (RLS) User Control Policies
create policy "profiles own rows" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "statistics own rows" on public.statistics for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "settings own rows" on public.settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "progress own rows" on public.progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "lesson_attempts own rows" on public.lesson_attempts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Profile trigger when a new user signs up via Supabase Auth
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

-- Trigger creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
```

---

## 🤝 How to Contribute

We welcome contributions of all forms—bug fixes, styling enhancements, new lessons, or documentation updates!

1. **Fork the Repository**: Create a personal copy of this repository on GitHub.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Verify Integrity**:
   Make sure to format and lint your changes before committing:
   ```bash
   npm run lint
   ```
4. **Test the Build**:
   Verify that your modifications compile cleanly:
   ```bash
   npm run build
   ```
5. **Commit Your Changes**: Keep your commit messages descriptive and clear.
6. **Submit a Pull Request**: Push your branch to GitHub and open a Pull Request (PR) against the main repository!

---

## 📄 License
This project is licensed under the MIT License. See `LICENSE` for more information.


-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table
create table if not exists public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  account_type text check (account_type in ('student', 'extracurricular_host')) not null,
  year text check (year in ('freshman', 'sophomore', 'junior', 'senior')), -- nullable for non-students
  username text unique not null,
  phone_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Users (safe to run multiple times? No, idempotent check needed or just ignore error?
-- ALTER TABLE ... ENABLE ROW LEVEL SECURITY is idempotent-ish, it won't fail if already enabled, usually.)
alter table public.users enable row level security;

-- Policies for Users
-- We drop and recreate to ensure they match desired state and to avoid "policy already exists" errors.

drop policy if exists "Public profiles are viewable by everyone." on public.users;
create policy "Public profiles are viewable by everyone."
  on public.users for select
  using ( true );

drop policy if exists "Users can insert their own profile." on public.users;
create policy "Users can insert their own profile."
  on public.users for insert
  with check ( auth.uid() = id );

drop policy if exists "Users can update own profile." on public.users;
create policy "Users can update own profile."
  on public.users for update
  using ( auth.uid() = id );

-- Posts Table
create table if not exists public.posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  post_type text check (post_type in ('tutor_request', 'tutor_offer', 'extracurricular')) not null,
  description text check (char_length(description) <= 500) not null,
  subjects text[], -- Array of strings
  date date, -- For extracurriculars
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Posts
alter table public.posts enable row level security;

-- Policies for Posts
drop policy if exists "Posts are viewable by everyone." on public.posts;
create policy "Posts are viewable by everyone."
  on public.posts for select
  using ( true );

drop policy if exists "Authenticated users can insert posts." on public.posts;
create policy "Authenticated users can insert posts."
  on public.posts for insert
  with check ( auth.role() = 'authenticated' );

drop policy if exists "Users can delete own posts." on public.posts;
create policy "Users can delete own posts."
  on public.posts for delete
  using ( auth.uid() = user_id );

-- Trigger to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, account_type, year, username, phone_number)
  values (
    new.id,
    new.email,
    (new.raw_user_meta_data ->> 'account_type'),
    (new.raw_user_meta_data ->> 'year'),
    (new.raw_user_meta_data ->> 'username'),
    (new.raw_user_meta_data ->> 'phone_number')
  );
  return new;
end;
$$;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to allow a user to delete their own account
-- This needs to be security definer because users cannot delete their own auth.users record directly
create or replace function public.delete_own_user()
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  -- Delete from auth.users (this will cascade to public.users and posts due to foreign keys)
  delete from public.posts where user_id = auth.uid();
  delete from public.users where id = auth.uid();
  delete from auth.users where id = auth.uid();
end;
$$;


-- Level 4A Hospital Supabase Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Profiles Table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text check (role in ('receptionist', 'doctor', 'patient')) default 'patient',
  full_name text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security for profiles
alter table public.profiles enable row level security;
-- Allow users to read their own profile
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
-- Allow receptionists to read all profiles (assuming role based RLS logic, though simplified here)
create policy "Receptionists can view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'receptionist')
);

-- Trigger to automatically create a profile when a new user signs up
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Create Chat Rooms Table
create table public.chat_rooms (
  id uuid default uuid_generate_v4() primary key,
  patient_name text not null,
  patient_phone text not null,
  inquiry_type text not null,
  status text check (status in ('active', 'resolved')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.chat_rooms enable row level security;
-- Allow anonymous inserts (for patients starting chats without logging in)
create policy "Anyone can insert chat rooms" on public.chat_rooms for insert with check (true);
-- Allow anyone to read for now (can be tightened up)
create policy "Anyone can view chat rooms" on public.chat_rooms for select using (true);
create policy "Receptionists can update chat rooms" on public.chat_rooms for update using (true);

-- 3. Create Chat Messages Table
create table public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references public.chat_rooms on delete cascade not null,
  sender_type text check (sender_type in ('patient', 'receptionist')) not null,
  message_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.chat_messages enable row level security;
-- Allow anonymous inserts
create policy "Anyone can insert chat messages" on public.chat_messages for insert with check (true);
-- Allow anyone to read
create policy "Anyone can view chat messages" on public.chat_messages for select using (true);


-- 4. Create Appointments Table
create table public.appointments (
  id uuid default uuid_generate_v4() primary key,
  patient_name text not null,
  patient_phone text not null,
  selected_service text not null,
  appointment_date date not null,
  appointment_time time not null,
  status text check (status in ('pending', 'confirmed', 'cancelled', 'rescheduled', 'completed')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.appointments enable row level security;
-- Allow anonymous inserts
create policy "Anyone can insert appointments" on public.appointments for insert with check (true);
-- Allow anyone to read (in a real app, restrict to receptionist/user)
create policy "Anyone can view appointments" on public.appointments for select using (true);
create policy "Anyone can update appointments" on public.appointments for update using (true);

-- Enable Realtime for Chat Rooms, Messages, and Appointments
alter publication supabase_realtime add table public.chat_rooms;
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.appointments;

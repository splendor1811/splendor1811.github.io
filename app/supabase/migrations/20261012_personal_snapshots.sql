-- One private, revisioned snapshot per signed-in reader. The static Library is not stored here.
create table if not exists public.personal_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  revision bigint not null default 1 check (revision > 0),
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  updated_at timestamptz not null default now()
);

alter table public.personal_snapshots enable row level security;
revoke all on public.personal_snapshots from anon;
grant select, insert, update, delete on public.personal_snapshots to authenticated;

create policy "Readers see only their own snapshot"
  on public.personal_snapshots for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Readers create only their own snapshot"
  on public.personal_snapshots for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Readers update only their own snapshot"
  on public.personal_snapshots for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Readers delete only their own snapshot"
  on public.personal_snapshots for delete to authenticated
  using ((select auth.uid()) = user_id);

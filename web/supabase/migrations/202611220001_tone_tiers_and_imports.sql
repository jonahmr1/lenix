begin;

alter table public.playlists add column track_tiers jsonb not null default '{}'::jsonb
  check (jsonb_typeof(track_tiers) = 'object');

create table public.spotify_matches (
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  song_key text not null,
  video_id text check (video_id is null or video_id ~ '^[A-Za-z0-9_-]{11}$'),
  primary key (user_id, song_key)
);
alter table public.spotify_matches enable row level security;
create policy "Users manage their own Spotify matches" on public.spotify_matches
  for all to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create table public.spotify_imports (
  user_id uuid primary key references auth.users(id) on delete cascade default auth.uid(),
  playlist_url text not null
);
alter table public.spotify_imports enable row level security;
create policy "Users manage their own Spotify import" on public.spotify_imports
  for all to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.spotify_matches, public.spotify_imports to authenticated;
commit;

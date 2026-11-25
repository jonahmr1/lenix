alter table public.player
  add column session jsonb,
  add column saved_at timestamptz;

create function public.keep_newer_tone_session() returns trigger language plpgsql
set search_path = '' as $$
begin
  if new.saved_at < old.saved_at then return null; end if;
  return new;
end;
$$;
create trigger keep_newer before update on public.player
for each row execute function public.keep_newer_tone_session();

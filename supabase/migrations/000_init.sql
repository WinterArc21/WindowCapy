-- Enable extensions
create extension if not exists pgcrypto;

-- Buckets
insert into storage.buckets (id, name, public) values ('images', 'images', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('audio', 'audio', false) on conflict (id) do nothing;

-- Tables
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  bio text,
  family text,
  matters text,
  current text,
  avatar_url text,
  show_follower_counts boolean default true not null,
  allow_dm boolean default false not null,
  created_at timestamp with time zone default now() not null
);

create table if not exists public.follows (
  follower_id uuid not null references auth.users(id) on delete cascade,
  followee_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now() not null,
  primary key (follower_id, followee_id)
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  image_url text,
  audio_url text,
  privacy text not null check (privacy in ('public','followers')),
  is_anonymous boolean default false not null,
  is_draft boolean default false not null,
  prompt_id uuid null,
  sensitive boolean default false not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  reactor_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('tell_me_more','interesting','relatable','new_perspective','wow')),
  created_at timestamp with time zone default now() not null,
  unique (story_id, reactor_id, type)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  parent_id uuid null references public.comments(id) on delete cascade,
  created_at timestamp with time zone default now() not null
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text null,
  created_at timestamp with time zone default now() not null
);

create table if not exists public.collection_items (
  collection_id uuid not null references public.collections(id) on delete cascade,
  story_id uuid not null references public.stories(id) on delete cascade,
  created_at timestamp with time zone default now() not null,
  primary key (collection_id, story_id)
);

create table if not exists public.themes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null
);

create table if not exists public.story_themes (
  story_id uuid not null references public.stories(id) on delete cascade,
  theme_id uuid not null references public.themes(id) on delete cascade,
  primary key (story_id, theme_id)
);

create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text null,
  cadence text not null check (cadence in ('daily','weekly')),
  active_from date not null,
  active_to date null
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('story','comment','profile')),
  target_id uuid not null,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (reason in ('harassment','self_harm','explicit','spam','other')),
  details text null,
  status text not null default 'open' check (status in ('open','reviewed','actioned')),
  created_at timestamp with time zone default now() not null
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  data jsonb not null default '{}'::jsonb,
  read_at timestamp with time zone null,
  created_at timestamp with time zone default now() not null
);

-- RLS
alter table public.profiles enable row level security;
alter table public.follows enable row level security;
alter table public.stories enable row level security;
alter table public.reactions enable row level security;
alter table public.comments enable row level security;
alter table public.collections enable row level security;
alter table public.collection_items enable row level security;
alter table public.reports enable row level security;
alter table public.notifications enable row level security;
alter table public.prompts enable row level security;
alter table public.themes enable row level security;
alter table public.story_themes enable row level security;

-- Profiles policies
create policy profiles_select on public.profiles for select using (true);
create policy profiles_update on public.profiles for update using (auth.uid() = id);

-- Follows policies
create policy follows_all_select on public.follows for select using (true);
create policy follows_insert on public.follows for insert with check (auth.uid() = follower_id);
create policy follows_delete on public.follows for delete using (auth.uid() = follower_id);

-- Stories policies
create policy stories_select on public.stories for select using (
  privacy = 'public'
  or auth.uid() = author_id
  or (
    privacy = 'followers'
    and exists (
      select 1 from public.follows f where f.followee_id = public.stories.author_id and f.follower_id = auth.uid()
    )
  )
);
create policy stories_insert on public.stories for insert with check (auth.uid() = author_id);
create policy stories_update on public.stories for update using (auth.uid() = author_id);
create policy stories_delete on public.stories for delete using (auth.uid() = author_id);

-- Reactions policies
create policy reactions_select on public.reactions for select using (
  exists (
    select 1 from public.stories s
    where s.id = public.reactions.story_id
      and (
        s.privacy = 'public'
        or auth.uid() = s.author_id
        or (s.privacy = 'followers' and exists (select 1 from public.follows f where f.followee_id = s.author_id and f.follower_id = auth.uid()))
      )
  )
);
create policy reactions_insert on public.reactions for insert with check (
  auth.uid() = reactor_id and exists (
    select 1 from public.stories s
    where s.id = public.reactions.story_id
      and (
        s.privacy = 'public'
        or auth.uid() = s.author_id
        or (s.privacy = 'followers' and exists (select 1 from public.follows f where f.followee_id = s.author_id and f.follower_id = auth.uid()))
      )
  )
);
create policy reactions_update on public.reactions for update using (auth.uid() = reactor_id);
create policy reactions_delete on public.reactions for delete using (auth.uid() = reactor_id);

-- Comments policies
create policy comments_select on public.comments for select using (
  exists (
    select 1 from public.stories s
    where s.id = public.comments.story_id
      and (
        s.privacy = 'public'
        or auth.uid() = s.author_id
        or (s.privacy = 'followers' and exists (select 1 from public.follows f where f.followee_id = s.author_id and f.follower_id = auth.uid()))
      )
  )
);
create policy comments_insert on public.comments for insert with check (
  auth.uid() = author_id and exists (
    select 1 from public.stories s
    where s.id = public.comments.story_id
      and (
        s.privacy = 'public'
        or auth.uid() = s.author_id
        or (s.privacy = 'followers' and exists (select 1 from public.follows f where f.followee_id = s.author_id and f.follower_id = auth.uid()))
      )
  )
);
create policy comments_update on public.comments for update using (auth.uid() = author_id);
create policy comments_delete on public.comments for delete using (auth.uid() = author_id);

-- Collections policies
create policy collections_select on public.collections for select using (auth.uid() = user_id);
create policy collections_insert on public.collections for insert with check (auth.uid() = user_id);
create policy collections_update on public.collections for update using (auth.uid() = user_id);
create policy collections_delete on public.collections for delete using (auth.uid() = user_id);

create policy collection_items_select on public.collection_items for select using (
  exists (select 1 from public.collections c where c.id = public.collection_items.collection_id and c.user_id = auth.uid())
);
create policy collection_items_insert on public.collection_items for insert with check (
  exists (select 1 from public.collections c where c.id = public.collection_items.collection_id and c.user_id = auth.uid())
);
create policy collection_items_delete on public.collection_items for delete using (
  exists (select 1 from public.collections c where c.id = public.collection_items.collection_id and c.user_id = auth.uid())
);

-- Reports policies
create policy reports_insert on public.reports for insert with check (auth.role() = 'authenticated');
create policy reports_moderator_select on public.reports for select using ((coalesce(auth.jwt() ->> 'role', '') = 'moderator'));
create policy reports_moderator_update on public.reports for update using ((coalesce(auth.jwt() ->> 'role', '') = 'moderator'));

-- Notifications policies
create policy notifications_select on public.notifications for select using (auth.uid() = user_id);
create policy notifications_update on public.notifications for update using (auth.uid() = user_id);

-- Prompts/themes: read for all, changes restricted to moderator
create policy prompts_select on public.prompts for select using (true);
create policy prompts_update on public.prompts for update using ((coalesce(auth.jwt() ->> 'role', '') = 'moderator'));
create policy prompts_insert on public.prompts for insert with check ((coalesce(auth.jwt() ->> 'role', '') = 'moderator'));

create policy themes_select on public.themes for select using (true);
create policy themes_modify on public.themes for all using ((coalesce(auth.jwt() ->> 'role', '') = 'moderator'));

create policy story_themes_select on public.story_themes for select using (true);
create policy story_themes_modify on public.story_themes for all using ((auth.role() = 'authenticated'));

-- Seed data
insert into public.prompts (title, body, cadence, active_from)
values
  ('Today, something small that meant a lot', null, 'daily', current_date),
  ('This week, a moment of perspective', null, 'weekly', current_date)
  on conflict do nothing;

insert into public.themes (slug, name) values
  ('family', 'Family'),
  ('work', 'Work'),
  ('health', 'Health'),
  ('community', 'Community')
  on conflict (slug) do nothing;

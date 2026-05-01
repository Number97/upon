-- Run this once in the Neon SQL editor to create all tables.
create extension if not exists pgcrypto;

create table if not exists categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  label      text not null,
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists links (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  title       text not null,
  url         text not null,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists socials (
  id       uuid primary key default gen_random_uuid(),
  name     text not null unique,
  url      text not null,
  icon     text not null,
  position integer not null default 0
);

create table if not exists theme (
  id         integer primary key default 1,
  blue       text not null,
  dark       text not null,
  gray       text not null,
  light      text not null,
  updated_at timestamptz not null default now(),
  constraint theme_singleton check (id = 1)
);

create table if not exists settings (
  id      integer primary key default 1,
  email   text not null,
  tagline text not null,
  constraint settings_singleton check (id = 1)
);

create index if not exists idx_links_category_position on links(category_id, position);
create index if not exists idx_categories_position on categories(position);
create index if not exists idx_socials_position on socials(position);

-- Run this once after schema.sql to populate the current site content.
-- Idempotent: re-running will not duplicate.

insert into categories (slug, label, position) values
  ('releases', 'Releases', 0),
  ('podcasts', 'Podcasts', 1)
on conflict (slug) do nothing;

insert into links (category_id, title, url, position)
select c.id, v.title, v.url, v.pos
from categories c
join (values
  ('releases', 'Seamless Blend [UPG-SB001]',                   'https://on.soundcloud.com/kBPnDGJZzIj4mLwkDM',  0),
  ('releases', 'PAKZ - Channel 2',                              'https://www.youtube.com/watch?v=pbrWMw7OA0o',   1),
  ('releases', 'Nichel - Romanian Dream [UPG002]',              'https://www.youtube.com/watch?v=LBL9Ad7jOu8',   2),
  ('releases', 'Raffers - Dialog [UPG001]',                     'https://www.youtube.com/watch?v=hRxR9aYpAmY',   3),
  ('podcasts', 'Geolyna Georgia - Celebrating Women''s Day [UPC001]', 'https://on.soundcloud.com/j4hArARmAQDToJvn8O', 0)
) as v(slug, title, url, pos) on c.slug = v.slug
where not exists (
  select 1 from links l where l.category_id = c.id and l.url = v.url
);

insert into socials (name, url, icon, position) values
  ('Instagram',  'https://instagram.com/uponground',     'instagram',  0),
  ('YouTube',    'https://www.youtube.com/@uponhub/',    'youtube',    1),
  ('SoundCloud', 'https://soundcloud.com/uponground',    'soundcloud', 2),
  ('Bandcamp',   'https://uponground.bandcamp.com/',     'bandcamp',   3),
  ('Telegram',   'https://t.me/uponhub',                 'telegram',   4)
on conflict (name) do nothing;

insert into theme (id, blue, dark, gray, light) values
  (1, '#002366', '#010206', '#BCBEC0', '#F2F2F0')
on conflict (id) do nothing;

insert into settings (id, email, tagline) values
  (1, 'upongroundhub@gmail.com', 'Electronic Music Platform')
on conflict (id) do nothing;

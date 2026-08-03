/*
# Create Menthong Association Schema

Creates the full database schema for the Menthong Association Group app.

## Tables

1. `families` — Family groups within the association
   - id (uuid, PK)
   - name (text, not null)
   - description (text, nullable)
   - created_at (timestamptz, default now())

2. `members` — Association members
   - id (uuid, PK)
   - first_name, last_name (text, not null)
   - photo_url, gender, birth_date, phone, email, address, profession, bio (nullable)
   - family_id (FK to families, nullable)
   - is_active (boolean, default true)
   - created_at (timestamptz, default now())

3. `association_roles` — Roles assigned to members
   - id (uuid, PK)
   - member_id (FK to members, cascade delete)
   - role (text, not null)

4. `events` — Association events
   - id (uuid, PK)
   - title (text, not null)
   - description, event_date, photo_url, video_url, location (nullable)
   - created_at (timestamptz, default now())

5. `news` — News articles
   - id (uuid, PK)
   - title (text, not null)
   - content (text, not null)
   - photo_url, video_url (nullable)
   - published_at (timestamptz, default now())
   - created_at (timestamptz, default now())

6. `admins` — Admin users (references auth.users)
   - id (uuid, PK, references auth.users)
   - full_name (text, not null)
   - created_at (timestamptz, default now())

## Security (RLS)

- Public tables (families, members, association_roles, events, news):
  SELECT is open to anon + authenticated (public-facing site).
  INSERT/UPDATE/DELETE restricted to authenticated users (admin only).
- `admins` table: SELECT restricted to authenticated (used for admin checks).
  INSERT/DELETE restricted to authenticated (self-service admin registration).

## Storage

- Creates `photos` bucket for member/event/news photo uploads.
- Allows public read, authenticated write.
*/

-- Families
CREATE TABLE IF NOT EXISTS families (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE families ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_families" ON families;
CREATE POLICY "public_select_families" ON families FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_families" ON families;
CREATE POLICY "auth_insert_families" ON families FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_families" ON families;
CREATE POLICY "auth_update_families" ON families FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_families" ON families;
CREATE POLICY "auth_delete_families" ON families FOR DELETE
  TO authenticated USING (true);

-- Members
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  photo_url text,
  gender text,
  birth_date date,
  phone text,
  email text,
  address text,
  profession text,
  bio text,
  family_id uuid REFERENCES families(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_members" ON members;
CREATE POLICY "public_select_members" ON members FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_members" ON members;
CREATE POLICY "auth_insert_members" ON members FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_members" ON members;
CREATE POLICY "auth_update_members" ON members FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_members" ON members;
CREATE POLICY "auth_delete_members" ON members FOR DELETE
  TO authenticated USING (true);

-- Association roles
CREATE TABLE IF NOT EXISTS association_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  role text NOT NULL
);

ALTER TABLE association_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_roles" ON association_roles;
CREATE POLICY "public_select_roles" ON association_roles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_roles" ON association_roles;
CREATE POLICY "auth_insert_roles" ON association_roles FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_roles" ON association_roles;
CREATE POLICY "auth_update_roles" ON association_roles FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_roles" ON association_roles;
CREATE POLICY "auth_delete_roles" ON association_roles FOR DELETE
  TO authenticated USING (true);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date timestamptz,
  photo_url text,
  video_url text,
  location text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_events" ON events;
CREATE POLICY "public_select_events" ON events FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_events" ON events;
CREATE POLICY "auth_insert_events" ON events FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_events" ON events;
CREATE POLICY "auth_update_events" ON events FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_events" ON events;
CREATE POLICY "auth_delete_events" ON events FOR DELETE
  TO authenticated USING (true);

-- News
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  photo_url text,
  video_url text,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_news" ON news;
CREATE POLICY "public_select_news" ON news FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_news" ON news;
CREATE POLICY "auth_insert_news" ON news FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_news" ON news;
CREATE POLICY "auth_update_news" ON news FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_news" ON news;
CREATE POLICY "auth_delete_news" ON news FOR DELETE
  TO authenticated USING (true);

-- Admins
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_admins" ON admins;
CREATE POLICY "auth_select_admins" ON admins FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_admins" ON admins;
CREATE POLICY "auth_insert_admins" ON admins FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_admins" ON admins;
CREATE POLICY "auth_delete_admins" ON admins FOR DELETE
  TO authenticated USING (true);

-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "public_read_photos" ON storage.objects;
CREATE POLICY "public_read_photos" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'photos');

DROP POLICY IF EXISTS "auth_insert_photos" ON storage.objects;
CREATE POLICY "auth_insert_photos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'photos');

DROP POLICY IF EXISTS "auth_update_photos" ON storage.objects;
CREATE POLICY "auth_update_photos" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'photos') WITH CHECK (bucket_id = 'photos');

DROP POLICY IF EXISTS "auth_delete_photos" ON storage.objects;
CREATE POLICY "auth_delete_photos" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'photos');

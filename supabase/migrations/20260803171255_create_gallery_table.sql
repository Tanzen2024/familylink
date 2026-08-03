/*
# Create gallery table

1. New Tables
- `gallery`
  - `id` (uuid, primary key)
  - `title` (text, not null) — title of the photo
  - `description` (text, nullable) — optional caption/description
  - `photo_url` (text, not null) — URL of the image in Supabase Storage
  - `category` (text, nullable) — optional category (e.g. "Événements", "Réunions")
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `gallery`.
- Public read (anon + authenticated) so all visitors can view the gallery.
- Only authenticated users can insert, update, delete (admin management).
*/

CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  photo_url text NOT NULL,
  category text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_gallery" ON gallery;
CREATE POLICY "anon_select_gallery" ON gallery FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_gallery" ON gallery;
CREATE POLICY "auth_insert_gallery" ON gallery FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_gallery" ON gallery;
CREATE POLICY "auth_update_gallery" ON gallery FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_gallery" ON gallery;
CREATE POLICY "auth_delete_gallery" ON gallery FOR DELETE
  TO authenticated USING (true);

/*
# Create site_settings table

1. New Tables
- `site_settings`
  - id (uuid, primary key)
  - community_name (text, nullable) — name of the community/association
  - slogan (text, nullable) — short tagline
  - short_description (text, nullable) — brief summary for headers/cards
  - long_description (text, nullable) — full about text
  - logo (text, nullable) — URL to logo image
  - favicon (text, nullable) — URL to favicon
  - phone (text, nullable) — contact phone
  - email (text, nullable) — contact email
  - address (text, nullable) — physical address
  - website (text, nullable) — official website URL
  - facebook_url, linkedin_url, instagram_url, youtube_url, whatsapp_url, x_url, tiktok_url (text, nullable) — social media links
  - map_location (text, nullable) — embed URL or coordinates for map
  - footer_text (text, nullable) — text shown in site footer
  - primary_color (text, nullable) — hex color for theme primary
  - secondary_color (text, nullable) — hex color for theme secondary
  - created_at (timestamptz, default now())
  - updated_at (timestamptz, default now())

2. Security (RLS)
- Enable RLS on `site_settings`.
- SELECT open to anon + authenticated (public-facing site reads settings).
- INSERT/UPDATE/DELETE restricted to authenticated (admin only).

3. Notes
- Intended to hold a single row of global settings.
- `updated_at` auto-refreshes on every row update via a trigger.
*/

-- Helper function for updated_at (idempotent)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_name text,
  slogan text,
  short_description text,
  long_description text,
  logo text,
  favicon text,
  phone text,
  email text,
  address text,
  website text,
  facebook_url text,
  linkedin_url text,
  instagram_url text,
  youtube_url text,
  whatsapp_url text,
  x_url text,
  tiktok_url text,
  map_location text,
  footer_text text,
  primary_color text,
  secondary_color text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_site_settings" ON site_settings;
CREATE POLICY "public_select_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_site_settings" ON site_settings;
CREATE POLICY "auth_insert_site_settings" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_site_settings" ON site_settings;
CREATE POLICY "auth_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_site_settings" ON site_settings;
CREATE POLICY "auth_delete_site_settings" ON site_settings FOR DELETE
  TO authenticated USING (true);

-- Auto-update updated_at on row change
DROP TRIGGER IF EXISTS trg_site_settings_updated_at ON site_settings;
CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

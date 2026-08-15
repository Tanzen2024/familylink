/*
# Add video upload support for events and news

## Changes

1. Storage
   - Creates a dedicated `videos` bucket (separate from `photos` since videos
     are larger and use different mime types), reusing the exact same
     Supabase Storage infrastructure and RLS model as the existing `photos`
     bucket: public read, authenticated write/update/delete.
   - Restricts the bucket to common video mime types and a 200MB per-file
     limit (matches the client-side VideoUploader defaults).

2. `events` and `news` tables
   - Adds nullable metadata columns so the admin form can display the
     selected video's name/size without re-fetching it from storage:
     `video_name`, `video_size`, `video_mime_type`.
   - The existing `video_url` column on both tables is reused to store the
     public storage URL (previously used for a free-text URL field).
*/

-- Storage bucket for videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  true,
  209715200,
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies (mirrors the "photos" bucket policies)
DROP POLICY IF EXISTS "public_read_videos" ON storage.objects;
CREATE POLICY "public_read_videos" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'videos');

DROP POLICY IF EXISTS "auth_insert_videos" ON storage.objects;
CREATE POLICY "auth_insert_videos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "auth_update_videos" ON storage.objects;
CREATE POLICY "auth_update_videos" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'videos') WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "auth_delete_videos" ON storage.objects;
CREATE POLICY "auth_delete_videos" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'videos');

-- Event video metadata
ALTER TABLE events ADD COLUMN IF NOT EXISTS video_name text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS video_size bigint;
ALTER TABLE events ADD COLUMN IF NOT EXISTS video_mime_type text;

-- News video metadata
ALTER TABLE news ADD COLUMN IF NOT EXISTS video_name text;
ALTER TABLE news ADD COLUMN IF NOT EXISTS video_size bigint;
ALTER TABLE news ADD COLUMN IF NOT EXISTS video_mime_type text;

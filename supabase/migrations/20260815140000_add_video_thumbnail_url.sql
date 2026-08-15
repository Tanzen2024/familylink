/*
# Add video thumbnail URL for events and news

## Changes

- Adds a nullable `video_thumbnail_url` column to `events` and `news`.
  Populated client-side by extracting a frame a couple of seconds into the
  uploaded video (canvas capture) and storing it as a JPEG in the existing
  `photos` storage bucket (same infra already used for member/event/news
  photos — no new bucket or storage policies needed).
- Used by the public event/news card lists to show a video cover thumbnail
  instead of leaving an empty area when a video has no dedicated photo.
*/

ALTER TABLE events ADD COLUMN IF NOT EXISTS video_thumbnail_url text;
ALTER TABLE news ADD COLUMN IF NOT EXISTS video_thumbnail_url text;

export interface Family {
  id: string
  name: string
  description: string | null
  created_at?: string
}

export interface AssociationRole {
  id: string
  member_id: string
  role: string
}

export interface Member {
  id: string
  first_name: string
  last_name: string
  photo_url: string | null
  gender: string | null
  birth_date: string | null
  phone: string | null
  email: string | null
  address: string | null
  profession: string | null
  bio: string | null
  family_id: string | null
  is_active: boolean
  created_at?: string
  family?: Family | null
  association_roles?: AssociationRole[]
}

export interface EventItem {
  id: string
  title: string
  description: string | null
  event_date: string | null
  photo_url: string | null
  video_url: string | null
  video_name?: string | null
  video_size?: number | null
  video_mime_type?: string | null
  video_thumbnail_url?: string | null
  location: string | null
  created_at?: string
}

export interface NewsItem {
  id: string
  title: string
  content: string
  photo_url: string | null
  video_url: string | null
  video_name?: string | null
  video_size?: number | null
  video_mime_type?: string | null
  video_thumbnail_url?: string | null
  published_at: string
  created_at?: string
}

export interface GalleryItem {
  id: string
  title: string
  description: string | null
  photo_url: string
  category: string | null
  created_at?: string
}

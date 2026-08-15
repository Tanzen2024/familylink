import { useEffect, useRef, useState } from 'react'
import { Film, Upload, X, RefreshCw } from 'lucide-react'
import { supabase } from '../lib/supabase'

export interface VideoValue {
  url: string
  name: string
  size: number
  mimeType: string
  thumbnailUrl?: string | null
}

interface VideoUploaderProps {
  value: VideoValue | null
  onChange: (value: VideoValue | null) => void
  onUploadingChange?: (uploading: boolean) => void
  label?: string
  folder?: string
  maxSizeMB?: number
  acceptedTypes?: string[]
}

const BUCKET = 'videos'
const THUMBNAIL_BUCKET = 'photos'
const DEFAULT_ACCEPTED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
const MIME_EXTENSIONS: Record<string, string> = {
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'video/x-msvideo': 'avi',
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

function storagePathFromUrl(url: string, bucket: string): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return url.slice(idx + marker.length)
}

// Extracts a frame a couple of seconds into the video (rather than the very
// first frame, which is often black/blank) and returns it as a JPEG blob.
// Best-effort: resolves to null on unsupported codecs, timeouts or any
// decoding error instead of failing the overall video upload.
function captureVideoFrame(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const videoEl = document.createElement('video')
    videoEl.preload = 'metadata'
    videoEl.muted = true
    videoEl.playsInline = true
    const objectUrl = URL.createObjectURL(file)
    videoEl.src = objectUrl

    let settled = false
    const finish = (result: Blob | null) => {
      if (settled) return
      settled = true
      clearTimeout(timeoutId)
      URL.revokeObjectURL(objectUrl)
      videoEl.remove()
      resolve(result)
    }

    const timeoutId = setTimeout(() => finish(null), 8000)

    videoEl.addEventListener('loadedmetadata', () => {
      const duration = videoEl.duration
      // Aim for ~10% into the clip (bounded to 1-5s) rather than frame 0,
      // which is frequently black or a transition on real-world videos.
      const seekTime = Number.isFinite(duration) && duration > 0
        ? Math.min(5, Math.max(Math.min(1, duration / 2), duration * 0.1))
        : 0
      videoEl.currentTime = Math.max(0, seekTime)
    })

    videoEl.addEventListener('seeked', () => {
      try {
        const maxWidth = 640
        const sourceWidth = videoEl.videoWidth || maxWidth
        const sourceHeight = videoEl.videoHeight || Math.round((maxWidth * 9) / 16)
        const scale = Math.min(1, maxWidth / sourceWidth)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(sourceWidth * scale)
        canvas.height = Math.round(sourceHeight * scale)
        const ctx = canvas.getContext('2d')
        if (!ctx) { finish(null); return }
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => finish(blob), 'image/jpeg', 0.8)
      } catch {
        finish(null)
      }
    })

    videoEl.addEventListener('error', () => finish(null))
  })
}

async function uploadThumbnail(blob: Blob, folder: string): Promise<string | null> {
  try {
    const path = `video-thumbnails/${folder}/${crypto.randomUUID()}.jpg`
    const { error } = await supabase.storage
      .from(THUMBNAIL_BUCKET)
      .upload(path, blob, { cacheControl: '3600', upsert: false, contentType: 'image/jpeg' })
    if (error) return null
    const { data } = supabase.storage.from(THUMBNAIL_BUCKET).getPublicUrl(path)
    return data.publicUrl
  } catch {
    return null
  }
}

export default function VideoUploader({
  value,
  onChange,
  onUploadingChange,
  label = 'Vidéo',
  folder = 'events',
  maxSizeMB = 200,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
}: VideoUploaderProps) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'generating-thumbnail' | 'success' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [thumbnailFailed, setThumbnailFailed] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(value?.url ?? null)
  const objectUrlRef = useRef<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const xhrRef = useRef<XMLHttpRequest | null>(null)

  useEffect(() => {
    setPreviewUrl(value?.url ?? null)
  }, [value?.url])

  useEffect(() => {
    onUploadingChange?.(status === 'uploading' || status === 'generating-thumbnail')
  }, [status, onUploadingChange])

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      xhrRef.current?.abort()
    }
  }, [])

  const handleRemove = async () => {
    const previous = value
    setStatus('idle')
    setProgress(0)
    setError(null)
    setThumbnailFailed(false)
    setPreviewUrl(null)
    onChange(null)
    if (fileInputRef.current) fileInputRef.current.value = ''

    if (previous?.url) {
      const path = storagePathFromUrl(previous.url, BUCKET)
      if (path) {
        try {
          await supabase.storage.from(BUCKET).remove([path])
        } catch (err) {
          console.error('Échec de la suppression de la vidéo dans le stockage', err)
        }
      }
    }
    if (previous?.thumbnailUrl) {
      const thumbPath = storagePathFromUrl(previous.thumbnailUrl, THUMBNAIL_BUCKET)
      if (thumbPath) {
        try {
          await supabase.storage.from(THUMBNAIL_BUCKET).remove([thumbPath])
        } catch (err) {
          console.error('Échec de la suppression de la miniature dans le stockage', err)
        }
      }
    }
  }

  const uploadWithProgress = (file: File, path: string, token: string): Promise<void> => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string
    const endpoint = `${supabaseUrl}/storage/v1/object/${BUCKET}/${path}`

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhrRef.current = xhr
      xhr.open('POST', endpoint, true)
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      xhr.setRequestHeader('apikey', anonKey)
      xhr.setRequestHeader('x-upsert', 'false')
      xhr.setRequestHeader('Content-Type', file.type)
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve()
        else reject(new Error(`storage upload failed: ${xhr.status} ${xhr.responseText}`))
      }
      xhr.onerror = () => reject(new Error('network error during video upload'))
      xhr.onabort = () => reject(new Error('video upload aborted'))
      xhr.send(file)
    })
  }

  const handleFile = async (file: File) => {
    setError(null)

    if (!acceptedTypes.includes(file.type)) {
      setStatus('error')
      setError("Le format de cette vidéo n'est pas pris en charge. Formats acceptés : MP4, WebM, MOV.")
      return
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setStatus('error')
      setError(`La vidéo est trop volumineuse (maximum ${maxSizeMB} Mo).`)
      return
    }

    const previousUrl = value?.url ?? null
    const previousThumbnailUrl = value?.thumbnailUrl ?? null

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const localUrl = URL.createObjectURL(file)
    objectUrlRef.current = localUrl
    setPreviewUrl(localUrl)
    setStatus('uploading')
    setProgress(0)
    setThumbnailFailed(false)

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token
      if (!token) throw new Error('missing session token')

      const ext = MIME_EXTENSIONS[file.type] ?? 'mp4'
      const path = `${folder}/${crypto.randomUUID()}.${ext}`

      await uploadWithProgress(file, path, token)

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)

      setStatus('generating-thumbnail')
      let thumbnailUrl: string | null = null
      try {
        const frameBlob = await captureVideoFrame(file)
        if (frameBlob) thumbnailUrl = await uploadThumbnail(frameBlob, folder)
        if (!thumbnailUrl) setThumbnailFailed(true)
      } catch (err) {
        console.error('Échec de la génération de la miniature vidéo', err)
        setThumbnailFailed(true)
      }

      setStatus('success')
      setProgress(100)
      onChange({ url: data.publicUrl, name: file.name, size: file.size, mimeType: file.type, thumbnailUrl })

      if (previousUrl) {
        const oldPath = storagePathFromUrl(previousUrl, BUCKET)
        if (oldPath) {
          supabase.storage.from(BUCKET).remove([oldPath]).catch((err) => {
            console.error("Échec de la suppression de l'ancienne vidéo", err)
          })
        }
      }
      if (previousThumbnailUrl) {
        const oldThumbPath = storagePathFromUrl(previousThumbnailUrl, THUMBNAIL_BUCKET)
        if (oldThumbPath) {
          supabase.storage.from(THUMBNAIL_BUCKET).remove([oldThumbPath]).catch((err) => {
            console.error("Échec de la suppression de l'ancienne miniature", err)
          })
        }
      }
    } catch (err) {
      console.error("Échec de l'upload vidéo", err)
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
      setPreviewUrl(previousUrl)
      setStatus('error')
      setError("L'importation de la vidéo a échoué. Veuillez réessayer.")
    } finally {
      xhrRef.current = null
    }
  }

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="video-upload">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          style={{ display: 'none' }}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {status === 'uploading' && (
          <div className="video-upload-progress-box">
            <p className="video-upload-progress-label">Importation de la vidéo…</p>
            <div className="sol-progress">
              <div className="sol-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="video-upload-progress-pct">{progress}%</p>
          </div>
        )}

        {status === 'generating-thumbnail' && (
          <div className="video-upload-progress-box">
            <p className="video-upload-progress-label">✓ Vidéo importée</p>
            <div className="sol-progress">
              <div className="sol-progress-fill" style={{ width: '100%' }} />
            </div>
            <p className="video-upload-progress-pct">Génération de l'image de couverture…</p>
          </div>
        )}

        {status !== 'uploading' && status !== 'generating-thumbnail' && value && (
          <div className="video-upload-file">
            <div className="video-upload-file-info">
              <Film size={18} />
              <div>
                <div className="video-upload-file-name">{value.name}</div>
                <div className="video-upload-file-size">{formatSize(value.size)}</div>
              </div>
            </div>
            {previewUrl && (
              <div className="video-wrapper">
                <video controls className="video-player" src={previewUrl} />
              </div>
            )}
            {status === 'success' && (
              <div className="video-upload-success">
                <p>✓ Vidéo importée avec succès</p>
                <p className={thumbnailFailed ? 'video-upload-success-muted' : undefined}>
                  {thumbnailFailed ? 'Image de couverture indisponible pour cette vidéo' : '✓ Image de couverture générée'}
                </p>
              </div>
            )}
            <div className="video-upload-actions">
              <button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
                <RefreshCw size={14} /> Remplacer
              </button>
              <button type="button" className="btn btn-danger" onClick={handleRemove}>
                <X size={14} /> Supprimer
              </button>
            </div>
          </div>
        )}

        {status !== 'uploading' && status !== 'generating-thumbnail' && !value && (
          <button type="button" className="video-upload-dropzone" onClick={() => fileInputRef.current?.click()}>
            <Upload size={28} />
            <span className="video-upload-dropzone-title">Importer une vidéo</span>
            <span className="video-upload-dropzone-hint">MP4, WebM, MOV</span>
          </button>
        )}

        {error && <div className="form-error">{error}</div>}
      </div>
    </div>
  )
}

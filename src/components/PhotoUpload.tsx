import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

interface PhotoUploadProps {
  value: string | null
  onChange: (url: string | null) => void
  label?: string
  folder?: string
}

export default function PhotoUpload({ value, onChange, label = 'Photo', folder = 'members' }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Le fichier ne doit pas dépasser 5 Mo.')
      return
    }
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner un fichier image.')
      return
    }

    setUploading(true)
    setError(null)

    const ext = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('photos').getPublicUrl(fileName)
    onChange(data.publicUrl)
    setUploading(false)
  }

  const handleRemove = () => {
    onChange(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="photo-upload">
        <div className="photo-upload-preview">
          {value ? (
            <img src={value} alt="Aperçu" className="photo-upload-img" />
          ) : (
            <div className="photo-upload-placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )}
        </div>
        <div className="photo-upload-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Chargement…' : value ? 'Changer la photo' : 'Importer une photo'}
          </button>
          {value && (
            <button type="button" className="btn btn-danger" onClick={handleRemove} style={{ marginLeft: '0.5rem' }}>
              Retirer
            </button>
          )}
          {error && <div className="form-error">{error}</div>}
        </div>
      </div>
    </div>
  )
}

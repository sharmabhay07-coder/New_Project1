import { useState } from 'react'
import { motion } from 'framer-motion'
import { UploadCloud, Loader2 } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import { uploadVideo } from '@/lib/api/videoApi'
import './video-upload-form.css'

export default function VideoUploadForm({ onUploaded }) {
  const { token } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const getVideoDuration = (videoFile) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src)
        resolve(Math.round(video.duration))
      }
      video.onerror = () => reject(new Error('Could not read video file'))
      video.src = URL.createObjectURL(videoFile)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!title.trim()) {
      setError('Title is required')
      return
    }
    if (!file) {
      setError('Please select a video file')
      return
    }

    try {
      setSubmitting(true)
      const duration = await getVideoDuration(file)

      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('duration', duration)
      formData.append('video', file)

      await uploadVideo(formData, token)

      setSuccess('Video uploaded successfully')
      setTitle('')
      setDescription('')
      setFile(null)
      onUploaded?.()
    } catch (err) {
      setError(err?.message || 'Upload failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      className="video-upload-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="video-upload-header">
        <UploadCloud size={18} />
        <h4>Upload Video</h4>
      </div>

      <form onSubmit={handleSubmit} className="video-upload-form">
        <label className="video-upload-label">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            className="video-upload-input"
          />
        </label>

        <label className="video-upload-label">
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter video description"
            className="video-upload-textarea"
            rows={3}
          />
        </label>

        <label className="video-upload-label">
          Video File
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="video-upload-file"
          />
        </label>

        {error && <p className="video-upload-error">{error}</p>}
        {success && <p className="video-upload-success">{success}</p>}

        <button type="submit" className="video-upload-btn" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 size={14} className="video-upload-spin" /> Uploading...
            </>
          ) : (
            'Upload'
          )}
        </button>
      </form>
    </motion.div>
  )
}
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
  const [uploadProgress, setUploadProgress] = useState(0)
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

  const uploadToCloudinary = (file, cloudName, uploadPreset) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
      
      xhr.open('POST', url, true);
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percent);
        }
      };
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          let errorMsg = 'Failed to upload to Cloudinary. Check your Unsigned Preset.';
          try {
            const errData = JSON.parse(xhr.responseText);
            if (errData.error && errData.error.message) {
              errorMsg = `Cloudinary Error: ${errData.error.message}`;
            }
          } catch (e) {
            console.error('Failed to parse Cloudinary error:', xhr.responseText);
          }
          console.error('Cloudinary upload failed:', xhr.responseText);
          reject(new Error(errorMsg));
        }
      };
      
      xhr.onerror = () => reject(new Error('Network error during upload.'));
      
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', uploadPreset);
      
      xhr.send(fd);
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setUploadProgress(0)

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
      const backendData = new FormData();
      backendData.append('title', title);
      backendData.append('description', description);
      backendData.append('duration', duration);
      backendData.append('file', file);

      setUploadProgress(50);

      await uploadVideo(backendData, token)
      setUploadProgress(100);

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
              <Loader2 size={14} className="video-upload-spin" /> {uploadProgress < 100 ? 'Uploading...' : 'Finalizing...'}
            </>
          ) : (
            'Upload'
          )}
        </button>

        {submitting && (
          <div style={{ marginTop: '12px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888', marginBottom: '4px' }}>
              <span>Upload Progress</span>
              <span>{uploadProgress}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#333', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${uploadProgress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.2s ease-out' }} />
            </div>
          </div>
        )}
      </form>
    </motion.div>
  )
}
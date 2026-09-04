import { useState, useRef } from 'react'
import { User, Mail, Smartphone, Camera, Loader2, Trash2 } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import { uploadProfilePicture, removeProfilePicture } from '@/lib/api/userApi'

export default function ProfilePage() {
  const { user, token, refreshUser } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const fileInputRef = useRef(null)

  const userName = user?.name || 'N/A'
  const initials = userName.slice(0, 2).toUpperCase()
  const userEmail = user?.email || 'N/A'
  const userMobile = user?.mobileNumber || 'N/A'

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      await uploadProfilePicture(token, file)
      await refreshUser()
    } catch (err) {
      alert(err.message || 'Failed to upload profile picture')
    } finally {
      setUploading(false)
    }
  }

  const handleRemovePicture = async () => {
    if (!window.confirm("Are you sure you want to remove your profile picture?")) return;
    setRemoving(true)
    try {
      await removeProfilePicture(token)
      await refreshUser()
    } catch (err) {
      alert(err.message || 'Failed to remove profile picture')
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div className="dash-page">
      <div>
        <h1 className="dash-text-2xl dash-font-bold dash-text-foreground">Profile</h1>
        <p className="dash-mt-1 dash-text-sm dash-text-muted-foreground">Manage your account information.</p>
      </div>

      <div className="dash-card dash-p-5 dash-shadow-soft dash-space-y-4 dash-mt-6">
        <div className="dash-flex dash-items-center dash-gap-2">
          <User className="dash-size-4 dash-text-primary" />
          <h2 className="dash-text-sm dash-font-bold dash-text-foreground">Personal Information</h2>
        </div>

        <div className="dash-flex dash-flex-col dash-items-center dash-gap-4 dash-py-6">
          <div className="dash-relative dash-flex dash-flex-col dash-items-center dash-gap-4">
            {user?.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt={userName} 
                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--border)' }} 
              />
            ) : (
              <span 
                className="dash-user-avatar-placeholder"
                style={{ width: '100px', height: '100px', borderRadius: '50%', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--primary)', color: 'var(--primary-fg)', fontWeight: 'bold' }}
              >
                {initials}
              </span>
            )}
            
            <div className="dash-flex dash-gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || removing}
                className="dash-flex dash-items-center dash-gap-1.5 dash-px-3 dash-py-1.5 dash-rounded-lg dash-bg-primary dash-text-primary-foreground dash-text-xs dash-font-semibold dash-shadow-sm hover:dash-bg-primary/90 dash-transition-all"
              >
                {uploading ? <Loader2 className="dash-size-3 dash-animate-spin" /> : <Camera className="dash-size-3" />}
                {user?.profilePicture ? 'Change Photo' : 'Add Photo'}
              </button>

              {user?.profilePicture && (
                <button
                  onClick={handleRemovePicture}
                  disabled={uploading || removing}
                  className="dash-flex dash-items-center dash-gap-1.5 dash-px-3 dash-py-1.5 dash-rounded-lg dash-bg-destructive/10 dash-text-destructive dash-text-xs dash-font-semibold dash-shadow-sm hover:dash-bg-destructive/20 dash-transition-all"
                >
                  {removing ? <Loader2 className="dash-size-3 dash-animate-spin" /> : <Trash2 className="dash-size-3" />}
                  Remove
                </button>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="dash-hidden"
            />
          </div>
          <p className="dash-text-2xl dash-font-bold dash-text-foreground dash-mt-2">{userName}</p>
        </div>

        <div className="dash-space-y-4 dash-mt-4">
          <div>
            <label className="dash-mb-1.5 dash-block dash-text-xs dash-font-semibold dash-text-muted-foreground">Email</label>
            <div className="dash-flex dash-items-center dash-gap-3 dash-w-full dash-rounded-xl dash-border dash-border-border dash-bg-background dash-px-4 dash-py-3 dash-text-sm dash-text-foreground">
              <Mail className="dash-size-5 dash-text-muted-foreground" />
              <span className="dash-font-medium">{userEmail}</span>
            </div>
          </div>

          <div>
            <label className="dash-mb-1.5 dash-block dash-text-xs dash-font-semibold dash-text-muted-foreground">Mobile Number</label>
            <div className="dash-flex dash-items-center dash-gap-3 dash-w-full dash-rounded-xl dash-border dash-border-border dash-bg-background dash-px-4 dash-py-3 dash-text-sm dash-text-foreground">
              <Smartphone className="dash-size-5 dash-text-muted-foreground" />
              <span className="dash-font-medium">{userMobile}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

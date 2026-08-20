import { User, Mail, Smartphone } from 'lucide-react'
import useAuth from '@/hooks/useAuth'

export default function ProfilePage() {
  const { user } = useAuth()

  const userName = user?.name || 'N/A'
  const initials = userName.slice(0, 2).toUpperCase()
  const userEmail = user?.email || 'N/A'
  const userMobile = user?.mobileNumber || 'N/A'

  return (
    <div className="dash-page">
      <div>
        <h1 className="dash-text-2xl dash-font-bold dash-text-foreground">Profile</h1>
        <p className="dash-mt-1 dash-text-sm dash-text-muted-foreground">Manage your account information.</p>
      </div>

      <div className="dash-card dash-p-5 dash-shadow-soft dash-space-y-4">
        <div className="dash-flex dash-items-center dash-gap-2">
          <User className="dash-size-4 dash-text-primary" />
          <h2 className="dash-text-sm dash-font-bold dash-text-foreground">Personal Information</h2>
        </div>

        <div className="dash-flex dash-flex-col dash-items-center dash-gap-4 dash-py-4">
          <span className="dash-user-avatar-lg dash-user-avatar-placeholder">
            {initials}
          </span>
          <p className="dash-text-xl dash-font-semibold dash-text-foreground">{userName}</p>
        </div>

        <div className="dash-space-y-3">
          <div>
            <label className="dash-mb-1 dash-block dash-text-xs dash-font-semibold dash-text-muted-foreground">Email</label>
            <div className="dash-flex dash-items-center dash-gap-2 dash-w-full dash-rounded-xl dash-border dash-border-border dash-bg-background dash-px-4 dash-py-2.5 dash-text-sm dash-text-foreground">
              <Mail className="dash-size-4 dash-text-muted-foreground" />
              <span>{userEmail}</span>
            </div>
          </div>

          <div>
            <label className="dash-mb-1 dash-block dash-text-xs dash-font-semibold dash-text-muted-foreground">Mobile Number</label>
            <div className="dash-flex dash-items-center dash-gap-2 dash-w-full dash-rounded-xl dash-border dash-border-border dash-bg-background dash-px-4 dash-py-2.5 dash-text-sm dash-text-foreground">
              <Smartphone className="dash-size-4 dash-text-muted-foreground" />
              <span>{userMobile}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

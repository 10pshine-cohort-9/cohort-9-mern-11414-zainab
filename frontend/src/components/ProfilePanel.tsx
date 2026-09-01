import { useEffect, useState, type FormEvent } from "react"
import { api } from "../utils/api"
import { formatDate } from "../utils/format"
import type { AuthUser } from "../utils/auth"
import "./ProfilePanel.css"

interface FullProfile extends AuthUser {
  createdAt: string
}

interface ProfilePanelProps {
  readonly user: AuthUser | null
}

function memberSinceLabel(loading: boolean, createdAt: string | undefined): string {
  if (loading) return "…"
  if (createdAt) return formatDate(createdAt)
  return "—"
}

export default function ProfilePanel({ user }: ProfilePanelProps) {
  const [profile, setProfile] = useState<FullProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pwError, setPwError] = useState("")
  const [pwSuccess, setPwSuccess] = useState("")
  const [pwSubmitting, setPwSubmitting] = useState(false)

  useEffect(() => {
    api
      .get("/auth/profile")
      .then(({ data }) => setProfile(data.user))
      .finally(() => setLoading(false))
  }, [])

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setPwError("")
    setPwSuccess("")

    if (newPassword !== confirmPassword) {
      setPwError("New passwords don't match")
      return
    }

    setPwSubmitting(true)
    try {
      await api.put("/auth/password", { currentPassword, newPassword })
      setPwSuccess("Password updated")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      setPwError(err.response?.data?.message || "Couldn't update password. Try again.")
    } finally {
      setPwSubmitting(false)
    }
  }

  return (
    <div className="profile-panel">
      <div className="main-head">
        <p className="eyebrow">Account</p>
        <h2>Profile</h2>
      </div>

      <div className="profile-card">
        <div className="profile-row">
          <span>Name</span>
          <span>{loading ? "…" : profile?.name ?? user?.name}</span>
        </div>
        <div className="profile-row">
          <span>Email</span>
          <span>{loading ? "…" : profile?.email ?? user?.email}</span>
        </div>
        <div className="profile-row">
          <span>Member since</span>
          <span>{memberSinceLabel(loading, profile?.createdAt)}</span>
        </div>
      </div>

      <div className="profile-card">
        <h3>Change password</h3>
        {pwError && <div className="profile-error">{pwError}</div>}
        {pwSuccess && <div className="profile-success">{pwSuccess}</div>}
        <form onSubmit={handlePasswordSubmit}>
          <div className="profile-field">
            <label htmlFor="currentPassword">Current password</label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="profile-field">
            <label htmlFor="newPassword">New password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <div className="profile-field">
            <label htmlFor="confirmPassword">Confirm new password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <button type="submit" className="btn-new" disabled={pwSubmitting}>
            {pwSubmitting ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  )
}

import { useNavigate } from "react-router-dom"
import { getUser, clearSession } from "../utils/auth"
import "./Profile.css"

export default function Profile() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    clearSession()
    navigate("/")
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1>Profile</h1>
        <div className="profile-row">
          <span>Name</span>
          <span>{user?.name}</span>
        </div>
        <div className="profile-row">
          <span>Email</span>
          <span>{user?.email}</span>
        </div>
        <div className="profile-actions">
          <button className="back" onClick={() => navigate("/dashboard")}>
            Back
          </button>
          <button className="logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}

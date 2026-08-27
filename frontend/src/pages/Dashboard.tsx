import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../utils/api"
import { getUser, clearSession } from "../utils/auth"
import { excerpt, formatDate, greeting } from "../utils/format"
import "./Dashboard.css"

interface Note {
  id: number
  title: string
  content: string
  updatedAt: string
}

const STICKY_COLORS = ["blue", "pink", "yellow", "green"] as const

export default function Dashboard() {
  const navigate = useNavigate()
  const user = getUser()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  useEffect(() => {
    api
      .get("/notes")
      .then(({ data }) => setNotes(data.notes))
      .finally(() => setLoading(false))
  }, [])

  const filteredNotes = useMemo(() => {
    if (!query.trim()) return notes
    const q = query.toLowerCase()
    return notes.filter(
      (note) => note.title.toLowerCase().includes(q) || note.content.toLowerCase().includes(q)
    )
  }, [notes, query])

  const handleLogout = () => {
    clearSession()
    navigate("/")
  }

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    if (!confirm("Delete this note?")) return
    try {
      await api.delete(`/notes/${id}`)
      setNotes((prev) => prev.filter((n) => n.id !== id))
    } catch {
      alert("Couldn't delete this note. Try again.")
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">Pearls Notes</div>
        <button className="nav-item active">All notes</button>
        <button className="nav-item" onClick={() => navigate("/profile")}>
          Profile
        </button>
        <div className="sidebar-foot">
          <div className="avatar">{user?.name?.[0]?.toUpperCase() || "?"}</div>
          <span>{user?.name}</span>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <div className="search-box">
            <span>⌕</span>
            <input
              placeholder="Search notes"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button onClick={handleLogout} className="nav-item" style={{ width: "auto" }}>
            Log out
          </button>
          <button className="btn-new" onClick={() => navigate("/notes/new")}>
            + New note
          </button>
        </div>

        <div className="main-head">
          <p className="eyebrow">
            {greeting()}, {user?.name}
          </p>
          <h2>Your notes</h2>
          <p className="note-count">{notes.length} notes</p>
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            <p>{notes.length === 0 ? "No notes yet." : "No notes match your search."}</p>
            {notes.length === 0 && (
              <button className="btn-new" onClick={() => navigate("/notes/new")}>
                + New note
              </button>
            )}
          </div>
        ) : (
          <div className="note-grid">
            {filteredNotes.map((note, i) => (
              <button
                key={note.id}
                className={`note-card note-card--${STICKY_COLORS[i % STICKY_COLORS.length]}`}
                onClick={() => navigate(`/notes/${note.id}`)}
              >
                <button className="delete-btn" onClick={(e) => handleDelete(e, note.id)} title="Delete note">
                  ✕
                </button>
                <h3>{note.title}</h3>
                <p>{excerpt(note.content) || "Empty note"}</p>
                <div className="note-meta">Edited {formatDate(note.updatedAt)}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { api } from "../utils/api"
import "./NoteEditor.css"

const QUILL_MODULES = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ header: 2 }, { header: 3 }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote"],
    ["clean"],
  ],
}

export default function NoteEditor() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isNew = !id || id === "new"

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isNew) return
    api
      .get(`/notes/${id}`)
      .then(({ data }) => {
        setTitle(data.note.title)
        setContent(data.note.content)
      })
      .catch(() => setError("Couldn't load this note."))
      .finally(() => setLoading(false))
  }, [id, isNew])

  const handleSave = async () => {
    setSaving(true)
    setError("")
    try {
      if (isNew) {
        await api.post("/notes", { title: title || "Untitled note", content })
      } else {
        await api.put(`/notes/${id}`, { title: title || "Untitled note", content })
      }
      navigate("/dashboard")
    } catch {
      setError("Couldn't save this note. Try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="editor-page">
        <div className="editor-shell">
          <p style={{ padding: 24 }}>Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="editor-page">
      <div className="editor-shell">
        <div className="editor-top">
          <button className="back-link" onClick={() => navigate("/dashboard")}>
            ← All notes
          </button>
          <div className="actions">
            <button className="btn-cancel" onClick={() => navigate("/dashboard")}>
              Cancel
            </button>
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        {error && (
          <p style={{ color: "#b3492f", fontSize: "0.85rem", padding: "12px 24px 0" }}>{error}</p>
        )}

        <input
          className="editor-title-input"
          placeholder="Untitled note"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="editor-quill-wrap">
          <ReactQuill theme="snow" value={content} onChange={setContent} modules={QUILL_MODULES} />
        </div>

        <div className="editor-foot">{isNew ? "New note" : "Editing note"}</div>
      </div>
    </div>
  )
}

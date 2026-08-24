import { BrowserRouter, Routes, Route } from "react-router-dom"
import PaperBackdrop from "./components/PaperBackdrop"
import ProtectedRoute from "./components/ProtectedRoute"
import Auth from "./pages/Auth"
import Dashboard from "./pages/Dashboard"
import NoteEditor from "./pages/NoteEditor"
import Profile from "./pages/Profile"

function App() {
  return (
    <BrowserRouter>
      <PaperBackdrop />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notes/new" element={<NoteEditor />} />
          <Route path="/notes/:id" element={<NoteEditor />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

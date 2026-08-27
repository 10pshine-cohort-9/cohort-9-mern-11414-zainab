import express from "express"
import { listNotes, getNote, createNote, updateNote, deleteNote } from "../controllers/noteController"
import { requireAuth } from "../middleware/auth"

const router = express.Router()

router.use(requireAuth)
router.get("/", listNotes)
router.post("/", createNote)
router.get("/:id", getNote)
router.put("/:id", updateNote)
router.delete("/:id", deleteNote)

export default router

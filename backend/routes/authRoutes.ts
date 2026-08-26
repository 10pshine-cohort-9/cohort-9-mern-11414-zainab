import express from "express"
import { signup, login, getProfile, changePassword } from "../controllers/authController"
import { requireAuth } from "../middleware/auth"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/profile", requireAuth, getProfile)
router.put("/password", requireAuth, changePassword)

export default router

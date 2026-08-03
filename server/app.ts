import express from "express"
import cors from "cors"
import pinoHttp from "pino-http"
import { logger } from "./config/logger"
import { notFoundHandler, errorHandler } from "./middleware/errorHandler"

export const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(pinoHttp({ logger }))

import authRoutes from "./routes/authRoutes"
import noteRoutes from "./routes/noteRoutes"
app.use("/api/auth", authRoutes)
app.use("/api/notes", noteRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

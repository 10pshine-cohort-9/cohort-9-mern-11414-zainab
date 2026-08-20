import express from "express" // Imports Express to create and configure the backend server.
import cors from "cors" // Imports CORS to allow requests from the frontend.
import pinoHttp from "pino-http" // Imports middleware for logging HTTP requests and responses.
import { logger } from "./config/logger" // Imports the configured Pino logger.
import { notFoundHandler, errorHandler } from "./middleware/errorHandler" // Imports middleware for handling 404s and other errors.

export const app = express() // Creates and exports the Express application.

app.use(cors()) // Enables CORS for incoming requests.
app.use(express.json()) // Allows Express to parse JSON request bodies.
app.use(express.urlencoded({ extended: true })) // Allows Express to parse URL-encoded request data.
app.use(pinoHttp({ logger })) // Logs HTTP requests and responses using Pino.

import authRoutes from "./routes/authRoutes" // Imports the authentication routes.
import noteRoutes from "./routes/noteRoutes" // Imports the notes routes.
app.use("/api/auth", authRoutes) // Registers authentication routes under /api/auth.
app.use("/api/notes", noteRoutes) // Registers note routes under /api/notes.

app.use(notFoundHandler) // Handles requests that don't match any defined route.
app.use(errorHandler) // Handles errors that occur in the application.

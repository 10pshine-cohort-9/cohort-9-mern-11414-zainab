import { config } from "dotenv"
config({ path: "./config.env" })

import { app } from "./app"
import { sequelize, connectDb } from "./config/db"
import { logger } from "./config/logger"
import "./models/User"
import "./models/Note"

const PORT = process.env.PORT || 8000

const start = async () => {
    try {
        await connectDb()
        await sequelize.sync({ alter: true })
        app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`))
    } catch (err) {
        logger.error(err, "Failed to start server")
        process.exit(1)
    }
}

start()

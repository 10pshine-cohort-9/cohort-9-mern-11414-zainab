import { Sequelize } from "sequelize"
import { logger } from "./logger"

export const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        dialect: "mysql",
        logging: (sql) => logger.debug(sql),
    }
)

export const connectDb = async () => {
    await sequelize.authenticate()
    logger.info("MySQL connected")
}

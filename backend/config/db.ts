import { readFileSync } from "fs"
import { Sequelize } from "sequelize"
import { logger } from "./logger"

// Managed MySQL providers (e.g. Aiven) require TLS and hand you a CA cert to
// verify the server with. Set DB_SSL_CA to that cert's path to enable it;
// leave it unset for a plain local MySQL instance with no TLS.
const sslCaPath = process.env.DB_SSL_CA
const ssl = sslCaPath ? { ca: readFileSync(sslCaPath, "utf8"), rejectUnauthorized: true } : undefined

export const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        dialect: "mysql",
        dialectOptions: ssl ? { ssl } : undefined,
        logging: (sql) => logger.debug(sql),
    }
)

export const connectDb = async () => {
    await sequelize.authenticate()
    logger.info("MySQL connected")
}

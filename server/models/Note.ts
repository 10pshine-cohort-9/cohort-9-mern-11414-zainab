import { DataTypes, Model, Optional } from "sequelize"
import { sequelize } from "../config/db"
import { User } from "./User"

interface NoteAttributes {
    id: number
    title: string
    content: string
    userId: number
    createdAt?: Date
    updatedAt?: Date
}

type NoteCreationAttributes = Optional<NoteAttributes, "id">

export class Note extends Model<NoteAttributes, NoteCreationAttributes> implements NoteAttributes {
    declare id: number
    declare title: string
    declare content: string
    declare userId: number
    declare readonly createdAt: Date
    declare readonly updatedAt: Date
}

Note.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        title: { type: DataTypes.STRING, allowNull: false, defaultValue: "Untitled note" },
        content: { type: DataTypes.TEXT("long"), allowNull: false, defaultValue: "" },
        userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
        sequelize,
        modelName: "Note",
        tableName: "notes",
    }
)

User.hasMany(Note, { foreignKey: "userId", onDelete: "CASCADE" })
Note.belongsTo(User, { foreignKey: "userId" })

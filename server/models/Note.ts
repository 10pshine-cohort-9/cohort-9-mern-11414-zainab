import { DataTypes, Model, Optional } from "sequelize" // Tools needed to create Note database model
import { sequelize } from "../config/db" //db connection
import { User } from "./User" //each Note belongs to a User

interface NoteAttributes {
    id: number
    title: string
    content: string
    userId: number
    createdAt?: Date
    updatedAt?: Date
}

type NoteCreationAttributes = Optional<NoteAttributes, "id"> // ID is optional because the db generates it

export class Note extends Model<NoteAttributes, NoteCreationAttributes> implements NoteAttributes {
    // Creates the Sequelize model representing a Note
    declare id: number
    declare title: string
    declare content: string
    declare userId: number
    declare readonly createdAt: Date
    declare readonly updatedAt: Date
}

Note.init(
    //how the Note should be stored in the database
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

User.hasMany(Note, { foreignKey: "userId", onDelete: "CASCADE" }) //one User, many Notes
Note.belongsTo(User, { foreignKey: "userId" }) //each Note belongs to 1 User

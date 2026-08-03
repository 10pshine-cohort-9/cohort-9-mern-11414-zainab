import { Request, Response, NextFunction } from "express"
import { Note } from "../models/Note"
import { AppError } from "../middleware/errorHandler"
import { logger } from "../config/logger"

export const listNotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notes = await Note.findAll({
            where: { userId: req.userId },
            order: [["updatedAt", "DESC"]],
        })
        res.json({ notes })
    } catch (err) {
        next(err)
    }
}

export const getNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const note = await Note.findOne({ where: { id: req.params.id, userId: req.userId } })
        if (!note) throw new AppError("Note not found", 404)
        res.json({ note })
    } catch (err) {
        next(err)
    }
}

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, content } = req.body
        const note = await Note.create({
            title: title || "Untitled note",
            content: content || "",
            userId: req.userId!,
        })
        logger.info({ userId: req.userId, noteId: note.id }, "Note created")
        res.status(201).json({ note })
    } catch (err) {
        next(err)
    }
}

export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const note = await Note.findOne({ where: { id: req.params.id, userId: req.userId } })
        if (!note) throw new AppError("Note not found", 404)

        const { title, content } = req.body
        if (title !== undefined) note.title = title
        if (content !== undefined) note.content = content
        await note.save()

        logger.info({ userId: req.userId, noteId: note.id }, "Note updated")
        res.json({ note })
    } catch (err) {
        next(err)
    }
}

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const note = await Note.findOne({ where: { id: req.params.id, userId: req.userId } })
        if (!note) throw new AppError("Note not found", 404)

        await note.destroy()
        logger.info({ userId: req.userId, noteId: note.id }, "Note deleted")
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}

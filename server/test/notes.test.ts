import { expect } from "chai"
import sinon from "sinon"
import request from "supertest"
import { app } from "../app"
import { Note } from "../models/Note"
import { signToken } from "../utils/jwt"

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret"
const authHeader = `Bearer ${signToken({ userId: 1 })}`

describe("Note routes", () => {
    afterEach(() => sinon.restore())

    it("rejects requests without a token", async () => {
        const res = await request(app).get("/api/notes")
        expect(res.status).to.equal(401)
    })

    it("lists only the authenticated user's notes", async () => {
        const findAllStub = sinon.stub(Note, "findAll").resolves([] as any)

        const res = await request(app).get("/api/notes").set("Authorization", authHeader)

        expect(res.status).to.equal(200)
        expect(findAllStub.firstCall.args[0]).to.deep.include({ where: { userId: 1 } })
    })

    it("creates a note for the authenticated user", async () => {
        sinon.stub(Note, "create").resolves({ id: 5, title: "Groceries", content: "Milk" } as any)

        const res = await request(app)
            .post("/api/notes")
            .set("Authorization", authHeader)
            .send({ title: "Groceries", content: "Milk" })

        expect(res.status).to.equal(201)
        expect(res.body.note.title).to.equal("Groceries")
    })

    it("returns 404 when updating a note that isn't the user's", async () => {
        sinon.stub(Note, "findOne").resolves(null)

        const res = await request(app)
            .put("/api/notes/999")
            .set("Authorization", authHeader)
            .send({ title: "Hacked" })

        expect(res.status).to.equal(404)
    })

    it("deletes a note the user owns", async () => {
        const destroy = sinon.stub().resolves()
        sinon.stub(Note, "findOne").resolves({ id: 5, destroy } as any)

        const res = await request(app).delete("/api/notes/5").set("Authorization", authHeader)

        expect(res.status).to.equal(204)
        expect(destroy.calledOnce).to.equal(true)
    })
})

import { expect } from "chai"
import sinon from "sinon"
import request from "supertest"
import bcrypt from "bcrypt"
import { app } from "../app"
import { User } from "../models/User"
import { signToken } from "../utils/jwt"

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret"
const authHeader = `Bearer ${signToken({ userId: 1 })}`

describe("Auth routes", () => {
    afterEach(() => sinon.restore())

    describe("POST /api/auth/signup", () => {
        it("rejects a request missing required fields", async () => {
            const res = await request(app).post("/api/auth/signup").send({ email: "a@b.com" })
            expect(res.status).to.equal(400)
        })

        it("rejects a password shorter than 6 characters", async () => {
            const res = await request(app)
                .post("/api/auth/signup")
                .send({ name: "Ada", email: "ada@example.com", password: "123" })
            expect(res.status).to.equal(400)
        })

        it("rejects a duplicate email", async () => {
            sinon.stub(User, "findOne").resolves({ id: 1 } as any)

            const res = await request(app)
                .post("/api/auth/signup")
                .send({ name: "Ada", email: "ada@example.com", password: "secret123" })

            expect(res.status).to.equal(409)
        })

        it("creates a user and returns a token", async () => {
            sinon.stub(User, "findOne").resolves(null)
            sinon.stub(User, "create").resolves({
                id: 1,
                name: "Ada",
                email: "ada@example.com",
            } as any)

            const res = await request(app)
                .post("/api/auth/signup")
                .send({ name: "Ada", email: "ada@example.com", password: "secret123" })

            expect(res.status).to.equal(201)
            expect(res.body).to.have.property("token")
            expect(res.body.user.email).to.equal("ada@example.com")
        })
    })

    describe("POST /api/auth/login", () => {
        it("rejects an unknown email", async () => {
            sinon.stub(User, "findOne").resolves(null)

            const res = await request(app)
                .post("/api/auth/login")
                .send({ email: "nope@example.com", password: "secret123" })

            expect(res.status).to.equal(401)
        })

        it("rejects an incorrect password", async () => {
            const hashed = await bcrypt.hash("correct-password", 10)
            sinon.stub(User, "findOne").resolves({ id: 1, password: hashed } as any)

            const res = await request(app)
                .post("/api/auth/login")
                .send({ email: "ada@example.com", password: "wrong-password" })

            expect(res.status).to.equal(401)
        })

        it("logs in with correct credentials", async () => {
            const hashed = await bcrypt.hash("correct-password", 10)
            sinon.stub(User, "findOne").resolves({
                id: 1,
                name: "Ada",
                email: "ada@example.com",
                password: hashed,
            } as any)

            const res = await request(app)
                .post("/api/auth/login")
                .send({ email: "ada@example.com", password: "correct-password" })

            expect(res.status).to.equal(200)
            expect(res.body).to.have.property("token")
        })
    })

    describe("PUT /api/auth/password", () => {
        it("rejects requests without a token", async () => {
            const res = await request(app)
                .put("/api/auth/password")
                .send({ currentPassword: "old-password", newPassword: "new-password" })

            expect(res.status).to.equal(401)
        })

        it("rejects a request missing required fields", async () => {
            const res = await request(app)
                .put("/api/auth/password")
                .set("Authorization", authHeader)
                .send({ currentPassword: "old-password" })

            expect(res.status).to.equal(400)
        })

        it("rejects a new password shorter than 6 characters", async () => {
            const res = await request(app)
                .put("/api/auth/password")
                .set("Authorization", authHeader)
                .send({ currentPassword: "old-password", newPassword: "123" })

            expect(res.status).to.equal(400)
        })

        it("rejects an incorrect current password", async () => {
            const hashed = await bcrypt.hash("correct-password", 10)
            sinon.stub(User, "findByPk").resolves({ id: 1, password: hashed } as any)

            const res = await request(app)
                .put("/api/auth/password")
                .set("Authorization", authHeader)
                .send({ currentPassword: "wrong-password", newPassword: "new-password" })

            expect(res.status).to.equal(401)
        })

        it("updates the password when the current one is correct", async () => {
            const hashed = await bcrypt.hash("correct-password", 10)
            const save = sinon.stub().resolves()
            sinon.stub(User, "findByPk").resolves({ id: 1, password: hashed, save } as any)

            const res = await request(app)
                .put("/api/auth/password")
                .set("Authorization", authHeader)
                .send({ currentPassword: "correct-password", newPassword: "new-password" })

            expect(res.status).to.equal(200)
            expect(save.calledOnce).to.equal(true)
        })
    })
})

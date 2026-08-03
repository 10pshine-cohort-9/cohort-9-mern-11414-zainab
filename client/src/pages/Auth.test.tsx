import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Auth from "./Auth"
import { api } from "../utils/api"

jest.mock("../utils/api", () => ({
  api: { post: jest.fn() },
}))

const mockedPost = api.post as jest.Mock

const renderAuth = () =>
  render(
    <MemoryRouter>
      <Auth />
    </MemoryRouter>
  )

describe("Auth page", () => {
  beforeEach(() => {
    mockedPost.mockReset()
    localStorage.clear()
  })

  it("shows login fields by default, without a name field", () => {
    renderAuth()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument()
  })

  it("shows the name field after switching to sign up", () => {
    renderAuth()
    fireEvent.click(screen.getByText("Sign up"))
    expect(screen.getByLabelText("Name")).toBeInTheDocument()
    expect(screen.getByText("Create account")).toBeInTheDocument()
  })

  it("submits login credentials to the login endpoint", async () => {
    mockedPost.mockResolvedValue({
      data: { token: "abc", user: { id: 1, name: "Ada", email: "ada@example.com" } },
    })

    renderAuth()
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } })
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret123" } })
    fireEvent.click(screen.getByText("Log in", { selector: "button[type=submit]" }))

    await waitFor(() =>
      expect(mockedPost).toHaveBeenCalledWith("/auth/login", {
        email: "ada@example.com",
        password: "secret123",
      })
    )
  })

  it("shows the server's error message when login fails", async () => {
    mockedPost.mockRejectedValue({ response: { data: { message: "Invalid credentials" } } })

    renderAuth()
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } })
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrongpass" } })
    fireEvent.click(screen.getByText("Log in", { selector: "button[type=submit]" }))

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument()
  })
})

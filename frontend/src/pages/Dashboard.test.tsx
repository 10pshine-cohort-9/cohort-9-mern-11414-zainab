import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Dashboard from "./Dashboard"
import { api } from "../utils/api"

jest.mock("../utils/api", () => ({
  api: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
}))

const mockedGet = api.get as jest.Mock
const mockedPut = api.put as jest.Mock

const SAMPLE_NOTES = [
  { id: 1, title: "Groceries", content: "<p>Milk and eggs</p>", updatedAt: "2026-01-10T00:00:00Z" },
  { id: 2, title: "Meeting notes", content: "<p>Discuss roadmap</p>", updatedAt: "2026-01-11T00:00:00Z" },
]

function setupMocks(notes: typeof SAMPLE_NOTES = []) {
  mockedGet.mockImplementation((url: string) => {
    if (url === "/notes") return Promise.resolve({ data: { notes } })
    if (url === "/auth/profile") {
      return Promise.resolve({
        data: { user: { id: 1, name: "Ada", email: "ada@example.com", createdAt: "2026-01-15T00:00:00Z" } },
      })
    }
    return Promise.reject(new Error("unexpected GET " + url))
  })
}

beforeEach(() => {
  localStorage.setItem("pearls_notes_user", JSON.stringify({ id: 1, name: "Ada", email: "ada@example.com" }))
  mockedGet.mockReset()
  mockedPut.mockReset()
  setupMocks()
})

afterEach(() => {
  localStorage.clear()
})

const renderDashboard = () =>
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  )

describe("Dashboard profile view toggle", () => {
  it("shows the notes view by default, with the sidebar present", async () => {
    renderDashboard()
    expect(await screen.findByText("Your notes")).toBeInTheDocument()
    expect(screen.getByText("Pearls Notes")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Search notes")).toBeInTheDocument()
  })

  it("switches the right panel to Profile without touching the sidebar, and back", async () => {
    renderDashboard()
    await screen.findByText("Your notes")

    fireEvent.click(screen.getByText("Profile"))

    expect(await screen.findByText("Member since")).toBeInTheDocument()
    // "same screen" claim: sidebar brand is still there, untouched
    expect(screen.getByText("Pearls Notes")).toBeInTheDocument()
    // notes-only controls are gone from the right side
    expect(screen.queryByPlaceholderText("Search notes")).not.toBeInTheDocument()
    expect(screen.queryByText("+ New note")).not.toBeInTheDocument()

    fireEvent.click(screen.getByText("All notes"))
    expect(await screen.findByText("Your notes")).toBeInTheDocument()
  })

  it("fetches and displays the account's creation date", async () => {
    renderDashboard()
    await screen.findByText("Your notes")
    fireEvent.click(screen.getByText("Profile"))

    await waitFor(() => expect(mockedGet).toHaveBeenCalledWith("/auth/profile"))
    expect(await screen.findByText("Jan 15, 2026")).toBeInTheDocument()
  })

  it("shows a client-side error when new and confirm passwords differ", async () => {
    renderDashboard()
    await screen.findByText("Your notes")
    fireEvent.click(screen.getByText("Profile"))
    await screen.findByLabelText("Current password")

    fireEvent.change(screen.getByLabelText("Current password"), { target: { value: "secret123" } })
    fireEvent.change(screen.getByLabelText("New password"), { target: { value: "newpass123" } })
    fireEvent.change(screen.getByLabelText("Confirm new password"), { target: { value: "different" } })
    fireEvent.click(screen.getByText("Update password"))

    expect(await screen.findByText("New passwords don't match")).toBeInTheDocument()
    expect(mockedPut).not.toHaveBeenCalled()
  })

  it("shows the server's error message when the current password is wrong", async () => {
    mockedPut.mockRejectedValue({ response: { data: { message: "Current password is incorrect" } } })
    renderDashboard()
    await screen.findByText("Your notes")
    fireEvent.click(screen.getByText("Profile"))
    await screen.findByLabelText("Current password")

    fireEvent.change(screen.getByLabelText("Current password"), { target: { value: "wrong" } })
    fireEvent.change(screen.getByLabelText("New password"), { target: { value: "newpass123" } })
    fireEvent.change(screen.getByLabelText("Confirm new password"), { target: { value: "newpass123" } })
    fireEvent.click(screen.getByText("Update password"))

    expect(await screen.findByText("Current password is incorrect")).toBeInTheDocument()
  })

  it("shows a success message and calls the API with the right payload", async () => {
    mockedPut.mockResolvedValue({ data: { message: "Password updated" } })
    renderDashboard()
    await screen.findByText("Your notes")
    fireEvent.click(screen.getByText("Profile"))
    await screen.findByLabelText("Current password")

    fireEvent.change(screen.getByLabelText("Current password"), { target: { value: "secret123" } })
    fireEvent.change(screen.getByLabelText("New password"), { target: { value: "newpass123" } })
    fireEvent.change(screen.getByLabelText("Confirm new password"), { target: { value: "newpass123" } })
    fireEvent.click(screen.getByText("Update password"))

    expect(await screen.findByText("Password updated")).toBeInTheDocument()
    expect(mockedPut).toHaveBeenCalledWith("/auth/password", {
      currentPassword: "secret123",
      newPassword: "newpass123",
    })
  })
})

describe("Dashboard search/filter", () => {
  it("shows all notes when the search box is empty", async () => {
    setupMocks(SAMPLE_NOTES)
    renderDashboard()
    expect(await screen.findByText("Groceries")).toBeInTheDocument()
    expect(screen.getByText("Meeting notes")).toBeInTheDocument()
  })

  it("filters notes by title", async () => {
    setupMocks(SAMPLE_NOTES)
    renderDashboard()
    await screen.findByText("Groceries")

    fireEvent.change(screen.getByPlaceholderText("Search notes"), { target: { value: "grocer" } })

    expect(screen.getByText("Groceries")).toBeInTheDocument()
    expect(screen.queryByText("Meeting notes")).not.toBeInTheDocument()
  })

  it("filters notes by content, case-insensitively", async () => {
    setupMocks(SAMPLE_NOTES)
    renderDashboard()
    await screen.findByText("Groceries")

    fireEvent.change(screen.getByPlaceholderText("Search notes"), { target: { value: "ROADMAP" } })

    expect(screen.getByText("Meeting notes")).toBeInTheDocument()
    expect(screen.queryByText("Groceries")).not.toBeInTheDocument()
  })

  it("shows a no-match message when nothing matches the search", async () => {
    setupMocks(SAMPLE_NOTES)
    renderDashboard()
    await screen.findByText("Groceries")

    fireEvent.change(screen.getByPlaceholderText("Search notes"), { target: { value: "nonexistent" } })

    expect(await screen.findByText("No notes match your search.")).toBeInTheDocument()
  })
})

describe("Dashboard note deletion", () => {
  const originalConfirm = window.confirm

  afterEach(() => {
    window.confirm = originalConfirm
  })

  it("deletes a note when the user confirms", async () => {
    setupMocks(SAMPLE_NOTES)
    window.confirm = jest.fn(() => true)
    const deleteMock = api.delete as jest.Mock
    deleteMock.mockResolvedValue({})
    renderDashboard()
    await screen.findByText("Groceries")

    fireEvent.click(screen.getAllByTitle("Delete note")[0])

    await waitFor(() => expect(deleteMock).toHaveBeenCalledWith("/notes/1"))
    expect(screen.queryByText("Groceries")).not.toBeInTheDocument()
  })

  it("does not delete when the user cancels the confirmation", async () => {
    setupMocks(SAMPLE_NOTES)
    window.confirm = jest.fn(() => false)
    const deleteMock = api.delete as jest.Mock
    deleteMock.mockClear()
    renderDashboard()
    await screen.findByText("Groceries")

    fireEvent.click(screen.getAllByTitle("Delete note")[0])

    expect(deleteMock).not.toHaveBeenCalled()
    expect(screen.getByText("Groceries")).toBeInTheDocument()
  })
})

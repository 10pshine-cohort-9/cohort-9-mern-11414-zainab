import { render, fireEvent, act } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import { Quill } from "react-quill-new"
import NoteEditor from "./NoteEditor"

jest.mock("../utils/api", () => ({
  api: { get: jest.fn(), post: jest.fn(), put: jest.fn() },
}))

const renderNewNoteEditor = () =>
  render(
    <MemoryRouter initialEntries={["/notes/new"]}>
      <Routes>
        <Route path="/notes/new" element={<NoteEditor />} />
      </Routes>
    </MemoryRouter>
  )

// Drives the Quill instance directly (its own documented API) rather than
// emulating real browser typing/selection, which jsdom can't fully do.
function getQuillInstance(container: HTMLElement) {
  const root = container.querySelector(".ql-container") as HTMLElement
  return Quill.find(root) as import("quill").default
}

function typeIntoEditor(container: HTMLElement, text: string) {
  act(() => {
    getQuillInstance(container).setText(text)
  })
}

function selectAllEditorText(container: HTMLElement) {
  act(() => {
    const quill = getQuillInstance(container)
    quill.setSelection(0, quill.getLength() - 1)
  })
}

describe("NoteEditor formatting toolbar", () => {
  it("renders Bold, Italic, and Underline as toolbar buttons", () => {
    const { container } = renderNewNoteEditor()
    expect(container.querySelector(".ql-bold")).toBeTruthy()
    expect(container.querySelector(".ql-italic")).toBeTruthy()
    expect(container.querySelector(".ql-underline")).toBeTruthy()
  })

  it("toggles bold on and off on the selected text", () => {
    const { container } = renderNewNoteEditor()
    typeIntoEditor(container, "hello world")
    selectAllEditorText(container)

    const bold = container.querySelector(".ql-bold") as HTMLButtonElement
    const editor = container.querySelector(".ql-editor") as HTMLElement

    fireEvent.click(bold)
    expect(bold.className).toContain("ql-active")
    expect(editor.innerHTML).toContain("<strong>")

    selectAllEditorText(container)
    fireEvent.click(bold)
    expect(bold.className).not.toContain("ql-active")
    expect(editor.innerHTML).not.toContain("<strong>")
  })

  it("toggles italic on and off on the selected text", () => {
    const { container } = renderNewNoteEditor()
    typeIntoEditor(container, "hello world")
    selectAllEditorText(container)

    const italic = container.querySelector(".ql-italic") as HTMLButtonElement
    const editor = container.querySelector(".ql-editor") as HTMLElement

    fireEvent.click(italic)
    expect(italic.className).toContain("ql-active")
    expect(editor.innerHTML).toContain("<em>")

    selectAllEditorText(container)
    fireEvent.click(italic)
    expect(italic.className).not.toContain("ql-active")
    expect(editor.innerHTML).not.toContain("<em>")
  })

  it("toggles underline on and off on the selected text", () => {
    const { container } = renderNewNoteEditor()
    typeIntoEditor(container, "hello world")
    selectAllEditorText(container)

    const underline = container.querySelector(".ql-underline") as HTMLButtonElement
    const editor = container.querySelector(".ql-editor") as HTMLElement

    fireEvent.click(underline)
    expect(underline.className).toContain("ql-active")
    expect(editor.innerHTML).toContain("<u>")

    selectAllEditorText(container)
    fireEvent.click(underline)
    expect(underline.className).not.toContain("ql-active")
    expect(editor.innerHTML).not.toContain("<u>")
  })

  it("combines bold, italic, and underline on the same selection independently", () => {
    const { container } = renderNewNoteEditor()
    typeIntoEditor(container, "hello world")
    selectAllEditorText(container)

    const bold = container.querySelector(".ql-bold") as HTMLButtonElement
    const italic = container.querySelector(".ql-italic") as HTMLButtonElement
    const underline = container.querySelector(".ql-underline") as HTMLButtonElement
    const editor = container.querySelector(".ql-editor") as HTMLElement

    fireEvent.click(bold)
    selectAllEditorText(container)
    fireEvent.click(italic)
    selectAllEditorText(container)
    fireEvent.click(underline)

    expect(bold.className).toContain("ql-active")
    expect(italic.className).toContain("ql-active")
    expect(underline.className).toContain("ql-active")
    expect(editor.innerHTML).toContain("<strong>")
    expect(editor.innerHTML).toContain("<em>")
    expect(editor.innerHTML).toContain("<u>")
  })
})

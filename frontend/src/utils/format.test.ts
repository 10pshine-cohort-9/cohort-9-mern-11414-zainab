import { stripHtml, excerpt, formatDate } from "./format"

describe("stripHtml", () => {
  it("removes tags and collapses whitespace", () => {
    expect(stripHtml("<p>Hello <b>world</b></p>")).toBe("Hello world")
  })

  it("returns an empty string for empty content", () => {
    expect(stripHtml("")).toBe("")
  })
})

describe("excerpt", () => {
  it("returns short content unchanged", () => {
    expect(excerpt("<p>Short note</p>", 140)).toBe("Short note")
  })

  it("truncates long content with an ellipsis", () => {
    const long = "<p>" + "a".repeat(200) + "</p>"
    const result = excerpt(long, 140)
    expect(result).toHaveLength(141)
    expect(result.endsWith("…")).toBe(true)
  })
})

describe("formatDate", () => {
  it("formats a date as Month Day, Year", () => {
    expect(formatDate("2026-07-30T12:00:00Z")).toBe("Jul 30, 2026")
  })
})

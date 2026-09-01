// Excludes "<" from the tag-body class (not just ">") so the engine can't
// treat an unmatched "<" as ambiguous overlap with the outer tag markers —
// keeps this provably linear instead of merely "usually fine in practice".
export const stripHtml = (html: string): string => html.replace(/<[^<>]*>/g, " ").replace(/\s+/g, " ").trim()

export const excerpt = (html: string, length = 140): string => {
    const text = stripHtml(html)
    return text.length > length ? `${text.slice(0, length).trim()}…` : text
}

export const formatDate = (value: string | Date): string =>
    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

export const greeting = (): string => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
}

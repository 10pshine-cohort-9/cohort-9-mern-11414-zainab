export interface AuthUser {
    id: number
    name: string
    email: string
}

const TOKEN_KEY = "pearls_notes_token"
const USER_KEY = "pearls_notes_user"

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY)

export const getUser = (): AuthUser | null => {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
}

export const setSession = (token: string, user: AuthUser): void => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const clearSession = (): void => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
}

export const isLoggedIn = (): boolean => getToken() !== null

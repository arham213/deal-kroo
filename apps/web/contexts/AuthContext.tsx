"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import type { User } from "@repo/utils/types/auth"

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = "dk_token"
const USER_KEY = "dk_user"

function decodeJWT(token: string): { exp?: number } | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const base64Url = parts[1]
    let base64 = base64Url?.replace(/-/g, "+").replace(/_/g, "/")
    while (base64?.length && base64?.length % 4) base64 += "="

    const json =
      typeof atob !== "undefined"
        ? decodeURIComponent(
          atob(base64 || "")
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join(""),
        )
        : ""

    return JSON.parse(json)
  } catch {
    return null
  }
}

function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token)
  if (!decoded?.exp) return true
  const now = Math.floor(Date.now() / 1000)
  return decoded.exp < now
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

async function saveToken(token: string | null) {
  if (typeof window === "undefined") return
  if (!token) {
    localStorage.removeItem(TOKEN_KEY)
  } else {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

async function saveUser(user: User | null) {
  if (typeof window === "undefined") return
  if (!user) {
    localStorage.removeItem(USER_KEY)
  } else {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const setUser = async (value: User | null) => {
    setUserState(value)
    await saveUser(value)
  }

  const setToken = async (value: string | null) => {
    setTokenState(value)
    await saveToken(value)
    setIsAuthenticated(Boolean(value))
  }

  const checkAuth = useCallback(async () => {
    setIsLoading(true)
    try {
      const storedToken = getStoredToken()
      if (!storedToken || isTokenExpired(storedToken)) {
        await setToken(null)
        await setUser(null)
        return
      }

      const storedUser = getStoredUser()
      setTokenState(storedToken)
      setUserState(storedUser)
      setIsAuthenticated(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await setToken(null)
    await setUser(null)
  }, [])

  useEffect(() => {
    void checkAuth()
  }, [checkAuth])

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    setUser,
    setToken,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return ctx
}



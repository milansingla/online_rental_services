"use client"

import type React from "react"
import { SessionProvider } from "next-auth/react"

// next-auth's useSession() needs a SessionProvider above it (App Router: in a client component).
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

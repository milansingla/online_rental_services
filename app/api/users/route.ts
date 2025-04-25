import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

// In a real application, this would be stored in a database
let users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@flixo.com",
    password: "admin123", // In production, use hashed passwords
    role: "admin",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    password: "user123",
    role: "user",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "user456",
    role: "user",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// GET all users (admin only) or current user
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (session.user.role === "admin") {
    // Admin can see all users or a specific user
    if (id) {
      const user = users.find((user) => user.id === id)
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Don't return password in response
      const { password, ...userWithoutPassword } = user
      return NextResponse.json(userWithoutPassword)
    }

    // Return all users without passwords
    const usersWithoutPasswords = users.map(({ password, ...user }) => user)
    return NextResponse.json(usersWithoutPasswords)
  } else {
    // Regular users can only see their own info
    const user = users.find((user) => user.id === session.user.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Don't return password in response
    const { password, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  }
}

// POST create a new user (admin only)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if email already exists
    if (users.some((user) => user.email === data.email)) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    // Generate unique ID (in production, use UUID or similar)
    const userId = `user-${Date.now()}`

    const newUser = {
      id: userId,
      name: data.name,
      email: data.email,
      password: data.password, // In production, hash this password
      role: data.role || "user", // Default to user role
      createdAt: new Date().toISOString(),
    }

    // In production, save to database
    users.push(newUser)

    // Don't return password in response
    const { password, ...userWithoutPassword } = newUser
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

// PATCH update a user (admin only or self)
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { id, ...updates } = data

    // Check if user exists
    const userIndex = users.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Only allow admin or self to update
    if (session.user.role !== "admin" && session.user.id !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Regular users cannot change their role
    if (session.user.role !== "admin" && updates.role) {
      delete updates.role
    }

    // Update the user
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
    }

    // Don't return password in response
    const { password, ...userWithoutPassword } = users[userIndex]
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

// DELETE a user (admin only)
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  // Prevent deleting the last admin
  const adminUsers = users.filter((user) => user.role === "admin")
  if (adminUsers.length === 1 && adminUsers[0].id === id) {
    return NextResponse.json({ error: "Cannot delete the last admin user" }, { status: 400 })
  }

  const initialLength = users.length
  users = users.filter((user) => user.id !== id)

  if (users.length === initialLength) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

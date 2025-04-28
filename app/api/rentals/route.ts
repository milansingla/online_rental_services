import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// In a real application, this would be stored in a database
let rentals = [
  {
    id: "rent-123",
    userId: "2",
    serviceId: "netflix",
    startDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    duration: "day",
    price: 3,
    credentials: {
      username: "flixo_user123",
      password: "securePass456!",
    },
    status: "active",
    paymentId: "pay-123",
  },
  {
    id: "rent-124",
    userId: "3",
    serviceId: "spotify",
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    expiryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    duration: "day",
    price: 1.5,
    credentials: {
      username: "flixo_user456",
      password: "spotifyPass789!",
    },
    status: "expired",
    paymentId: "pay-124",
  },
]

// GET all rentals (admin only)
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json(rentals)
}

// POST create a new rental
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()

    // Generate unique IDs (in production, use UUID or similar)
    const rentalId = `rent-${Date.now()}`
    const paymentId = `pay-${Date.now()}`

    // Generate credentials (in production, use a secure generator)
    const username = `flixo_${Math.random().toString(36).substring(2, 8)}`
    const password = `secure${Math.random().toString(36).substring(2, 10)}!`

    // Calculate expiry date based on duration
    let expiryDate = new Date()
    switch (data.duration) {
      case "hour":
        expiryDate = new Date(Date.now() + 60 * 60 * 1000)
        break
      case "day":
        expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
        break
      case "week":
        expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        break
      default:
        expiryDate = new Date(Date.now() + 60 * 60 * 1000) // Default to 1 hour
    }

    const newRental = {
      id: rentalId,
      userId: session.user.id,
      serviceId: data.serviceId,
      startDate: new Date().toISOString(),
      expiryDate: expiryDate.toISOString(),
      duration: data.duration,
      price: data.price,
      credentials: {
        username,
        password,
      },
      status: "active",
      paymentId,
    }

    // In production, save to database
    rentals.push(newRental)

    return NextResponse.json(newRental, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create rental" }, { status: 500 })
  }
}

// PATCH update a rental (admin only)
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { id, ...updates } = data

    const rentalIndex = rentals.findIndex((rental) => rental.id === id)

    if (rentalIndex === -1) {
      return NextResponse.json({ error: "Rental not found" }, { status: 404 })
    }

    // Update the rental
    rentals[rentalIndex] = {
      ...rentals[rentalIndex],
      ...updates,
    }

    return NextResponse.json(rentals[rentalIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update rental" }, { status: 500 })
  }
}

// DELETE a rental (admin only)
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Rental ID is required" }, { status: 400 })
  }

  const initialLength = rentals.length
  rentals = rentals.filter((rental) => rental.id !== id)

  if (rentals.length === initialLength) {
    return NextResponse.json({ error: "Rental not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

// In a real application, this would be stored in a database
let services = [
  {
    id: "netflix",
    name: "Netflix",
    image: "/placeholder.svg?height=80&width=150&text=Netflix",
    description: "Stream your favorite movies and TV shows",
    hourlyPrice: 1,
    dailyPrice: 3,
    weeklyPrice: 7,
    accessInfo: "Instant access to a premium account",
    active: true,
  },
  {
    id: "spotify",
    name: "Spotify",
    image: "/placeholder.svg?height=80&width=150&text=Spotify",
    description: "Listen to millions of songs and podcasts",
    hourlyPrice: 0.5,
    dailyPrice: 1.5,
    weeklyPrice: 4,
    accessInfo: "Immediate access to premium features",
    active: true,
  },
  {
    id: "amazon-prime",
    name: "Amazon Prime",
    image: "/placeholder.svg?height=80&width=150&text=Amazon+Prime",
    description: "Shop online with free shipping and watch Prime Video",
    hourlyPrice: 0.8,
    dailyPrice: 2.5,
    weeklyPrice: 6,
    accessInfo: "Full access to Prime benefits",
    active: true,
  },
]

// GET all services
export async function GET() {
  // For public access, filter to only show active services
  const session = await getServerSession(authOptions)

  if (session?.user?.role === "admin") {
    // Admin sees all services
    return NextResponse.json(services)
  }

  // Regular users only see active services
  const activeServices = services.filter((service) => service.active)
  return NextResponse.json(activeServices)
}

// POST create a new service (admin only)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()

    // Validate required fields
    if (!data.id || !data.name || !data.description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if service ID already exists
    if (services.some((service) => service.id === data.id)) {
      return NextResponse.json({ error: "Service ID already exists" }, { status: 409 })
    }

    const newService = {
      ...data,
      active: data.active ?? true, // Default to active if not specified
    }

    // In production, save to database
    services.push(newService)

    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}

// PATCH update a service (admin only)
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { id, ...updates } = data

    const serviceIndex = services.findIndex((service) => service.id === id)

    if (serviceIndex === -1) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    // Update the service
    services[serviceIndex] = {
      ...services[serviceIndex],
      ...updates,
    }

    return NextResponse.json(services[serviceIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

// DELETE a service (admin only)
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
  }

  const initialLength = services.length
  services = services.filter((service) => service.id !== id)

  if (services.length === initialLength) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

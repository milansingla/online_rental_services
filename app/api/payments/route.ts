import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// In a real application, this would be stored in a database
const payments = [
  {
    id: "pay-123",
    userId: "2",
    rentalId: "rent-123",
    amount: 3,
    currency: "USD",
    status: "completed",
    paymentMethod: "credit_card",
    createdAt: new Date().toISOString(),
  },
  {
    id: "pay-124",
    userId: "3",
    rentalId: "rent-124",
    amount: 1.5,
    currency: "USD",
    status: "completed",
    paymentMethod: "credit_card",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// GET all payments (admin only) or user's payments
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (session.user.role === "admin") {
    // Admin can see all payments or filter by userId
    if (userId) {
      const userPayments = payments.filter((payment) => payment.userId === userId)
      return NextResponse.json(userPayments)
    }
    return NextResponse.json(payments)
  } else {
    // Regular users can only see their own payments
    const userPayments = payments.filter((payment) => payment.userId === session.user.id)
    return NextResponse.json(userPayments)
  }
}

// POST create a new payment
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()

    // Validate required fields
    if (!data.rentalId || !data.amount || !data.paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate unique ID (in production, use UUID or similar)
    const paymentId = `pay-${Date.now()}`

    const newPayment = {
      id: paymentId,
      userId: session.user.id,
      rentalId: data.rentalId,
      amount: data.amount,
      currency: data.currency || "USD",
      status: "completed", // In production, this would be pending until processed
      paymentMethod: data.paymentMethod,
      createdAt: new Date().toISOString(),
    }

    // In production, save to database and process payment through a payment gateway
    payments.push(newPayment)

    return NextResponse.json(newPayment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 })
  }
}

// PATCH update a payment (admin only)
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { id, ...updates } = data

    const paymentIndex = payments.findIndex((payment) => payment.id === id)

    if (paymentIndex === -1) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Update the payment
    payments[paymentIndex] = {
      ...payments[paymentIndex],
      ...updates,
    }

    return NextResponse.json(payments[paymentIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 })
  }
}

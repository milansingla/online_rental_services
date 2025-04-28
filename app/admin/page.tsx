"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Users, CreditCard, Film, ShoppingCart, TrendingUp, DollarSign, UserPlus, Clock } from "lucide-react"

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRentals: 0,
    totalRevenue: 0,
    activeRentals: 0,
    newUsers: 0,
    popularService: "",
  })
  const [recentRentals, setRecentRentals] = useState([])
  const [loading, setLoading] = useState(true)

  if (typeof window !== "undefined" && status === "loading") {
    return null;
  }

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || (status === "authenticated" && !session)) {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/");
    } else if (status === "authenticated" && session?.user?.role === "admin") {
      fetchDashboardData();
    }
  }, [status, session, router])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStats({
        totalUsers: 42,
        totalRentals: 156,
        totalRevenue: 487.5,
        activeRentals: 28,
        newUsers: 7,
        popularService: "Netflix",
      })

      setRecentRentals([
        {
          id: "rent-123",
          user: "John Doe",
          service: "Netflix",
          duration: "day",
          price: 3,
          date: new Date().toLocaleString(),
        },
        {
          id: "rent-122",
          user: "Jane Smith",
          service: "Spotify",
          duration: "week",
          price: 4,
          date: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(),
        },
        {
          id: "rent-121",
          user: "Mike Johnson",
          service: "Amazon Prime",
          duration: "day",
          price: 2.5,
          date: new Date(Date.now() - 5 * 60 * 60 * 1000).toLocaleString(),
        },
      ])

      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
      setLoading(false)
    }
  }

  if (status === "loading" || loading || !session) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <AdminSidebar activePage="dashboard" />

          <main className="flex-1">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-full">
                    <ShoppingCart className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Rentals</p>
                    <p className="text-2xl font-bold">{stats.totalRentals}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Active Rentals</p>
                    <p className="text-2xl font-bold">{stats.activeRentals}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {recentRentals.map((rental) => (
                    <div key={rental.id} className="flex items-center p-3 bg-gray-50 rounded-md">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Film className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">
                          {rental.user} rented {rental.service}
                        </p>
                        <p className="text-xs text-gray-500">{rental.date}</p>
                      </div>
                      <div className="ml-auto">
                        <p className="text-sm font-bold">${rental.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-full">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Most Popular Service</p>
                      <p className="text-xs text-gray-500">{stats.popularService}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <UserPlus className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">New Users (Last 7 Days)</p>
                      <p className="text-xs text-gray-500">{stats.newUsers} new registrations</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Average Rental Value</p>
                      <p className="text-xs text-gray-500">
                        ${(stats.totalRevenue / stats.totalRentals).toFixed(2)} per rental
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}

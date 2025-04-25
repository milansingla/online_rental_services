"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Search, Edit, Trash2, X, Clock, User, Film, DollarSign, Key, RefreshCw } from "lucide-react"

interface Rental {
  id: string
  userId: string
  userName: string
  serviceId: string
  serviceName: string
  startDate: string
  expiryDate: string
  duration: string
  price: number
  credentials: {
    username: string
    password: string
  }
  status: string
  paymentId: string
}

export default function AdminRentalsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCredentialsModal, setShowCredentialsModal] = useState(false)
  const [currentRental, setCurrentRental] = useState<Rental | null>(null)
  const [formData, setFormData] = useState({
    status: "",
    credentials: {
      username: "",
      password: "",
    },
  })

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/")
    } else if (status === "authenticated" && session?.user?.role === "admin") {
      // Fetch rentals
      fetchRentals()
    }
  }, [status, session, router])

  const fetchRentals = async () => {
    setLoading(true)
    try {
      // In a real app, this would be an actual API call
      // For demo purposes, we'll use mock data

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockRentals: Rental[] = [
        {
          id: "rent-123",
          userId: "2",
          userName: "John Doe",
          serviceId: "netflix",
          serviceName: "Netflix",
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
          userName: "Jane Smith",
          serviceId: "spotify",
          serviceName: "Spotify",
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
        {
          id: "rent-125",
          userId: "2",
          userName: "John Doe",
          serviceId: "amazon-prime",
          serviceName: "Amazon Prime",
          startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
          duration: "week",
          price: 6,
          credentials: {
            username: "flixo_user789",
            password: "amazonPass123!",
          },
          status: "active",
          paymentId: "pay-125",
        },
      ]

      setRentals(mockRentals)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch rentals:", error)
      setLoading(false)
    }
  }

  const handleEditRental = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentRental) return

    try {
      // In a real app, this would be an actual API call
      console.log("Editing rental:", currentRental.id, formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update rental in the list (in a real app, this would come from the API response)
      const updatedRentals = rentals.map((rental) => {
        if (rental.id === currentRental.id) {
          return {
            ...rental,
            status: formData.status,
            credentials: {
              username: formData.credentials.username,
              password: formData.credentials.password,
            },
          }
        }
        return rental
      })

      setRentals(updatedRentals)
      setShowEditModal(false)
      setCurrentRental(null)
      setFormData({
        status: "",
        credentials: {
          username: "",
          password: "",
        },
      })
    } catch (error) {
      console.error("Failed to edit rental:", error)
    }
  }

  const handleDeleteRental = async () => {
    if (!currentRental) return

    try {
      // In a real app, this would be an actual API call
      console.log("Deleting rental:", currentRental.id)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Remove rental from the list (in a real app, this would be confirmed by the API)
      const updatedRentals = rentals.filter((rental) => rental.id !== currentRental.id)

      setRentals(updatedRentals)
      setShowDeleteModal(false)
      setCurrentRental(null)
    } catch (error) {
      console.error("Failed to delete rental:", error)
    }
  }

  const handleResetCredentials = async () => {
    if (!currentRental) return

    try {
      // In a real app, this would be an actual API call
      console.log("Resetting credentials for rental:", currentRental.id)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate new credentials
      const newUsername = `flixo_${Math.random().toString(36).substring(2, 8)}`
      const newPassword = `secure${Math.random().toString(36).substring(2, 10)}!`

      // Update rental in the list (in a real app, this would come from the API response)
      const updatedRentals = rentals.map((rental) => {
        if (rental.id === currentRental.id) {
          return {
            ...rental,
            credentials: {
              username: newUsername,
              password: newPassword,
            },
          }
        }
        return rental
      })

      setRentals(updatedRentals)
      setCurrentRental({
        ...currentRental,
        credentials: {
          username: newUsername,
          password: newPassword,
        },
      })
    } catch (error) {
      console.error("Failed to reset credentials:", error)
    }
  }

  const openEditModal = (rental: Rental) => {
    setCurrentRental(rental)
    setFormData({
      status: rental.status,
      credentials: {
        username: rental.credentials.username,
        password: rental.credentials.password,
      },
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (rental: Rental) => {
    setCurrentRental(rental)
    setShowDeleteModal(true)
  }

  const openCredentialsModal = (rental: Rental) => {
    setCurrentRental(rental)
    setShowCredentialsModal(true)
  }

  const filteredRentals = rentals.filter(
    (rental) =>
      rental.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  if (status === "loading" || loading) {
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
          <AdminSidebar activePage="rentals" />

          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Manage Rentals</h1>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search rentals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        User
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Service
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Duration
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Dates
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRentals.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          No rentals found
                        </td>
                      </tr>
                    ) : (
                      filteredRentals.map((rental) => (
                        <tr key={rental.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-500" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{rental.userName}</div>
                                <div className="text-xs text-gray-500">ID: {rental.userId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <Film className="h-4 w-4 text-gray-500" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{rental.serviceName}</div>
                                <div className="text-xs text-gray-500">ID: {rental.serviceId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-gray-400" />
                              <div className="text-sm text-gray-900">
                                {rental.duration === "hour"
                                  ? "1 Hour"
                                  : rental.duration === "day"
                                    ? "1 Day"
                                    : rental.duration === "week"
                                      ? "1 Week"
                                      : rental.duration}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              <DollarSign className="h-3 w-3 inline mr-1" />${rental.price}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-xs text-gray-500">
                              <div className="mb-1">
                                <span className="font-medium">Start:</span>{" "}
                                {new Date(rental.startDate).toLocaleString()}
                              </div>
                              <div>
                                <span className="font-medium">Expiry:</span>{" "}
                                {new Date(rental.expiryDate).toLocaleString()}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(rental.status)}`}
                            >
                              {rental.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openCredentialsModal(rental)}
                              className="text-gray-600 hover:text-gray-900 mr-3"
                              title="View Credentials"
                            >
                              <Key className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(rental)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                              title="Edit Rental"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(rental)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Rental"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />

      {/* Edit Rental Modal */}
      {showEditModal && currentRental && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Rental</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditRental}>
              <div className="mb-4">
                <label htmlFor="rental-id" className="block text-sm font-medium text-gray-700 mb-1">
                  Rental ID
                </label>
                <input
                  type="text"
                  id="rental-id"
                  value={currentRental.id}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                  disabled
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="user-name" className="block text-sm font-medium text-gray-700 mb-1">
                    User
                  </label>
                  <input
                    type="text"
                    id="user-name"
                    value={currentRental.userName}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                    disabled
                  />
                </div>

                <div>
                  <label htmlFor="service-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Service
                  </label>
                  <input
                    type="text"
                    id="service-name"
                    value={currentRental.serviceName}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                    disabled
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.credentials.username}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      credentials: { ...formData.credentials, username: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="text"
                  id="password"
                  value={formData.credentials.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      credentials: { ...formData.credentials, password: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Rental Confirmation Modal */}
      {showDeleteModal && currentRental && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Delete Rental</h2>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete the rental <span className="font-semibold">{currentRental.id}</span> for
                user <span className="font-semibold">{currentRental.userName}</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRental}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Credentials Modal */}
      {showCredentialsModal && currentRental && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Account Credentials</h2>
              <button onClick={() => setShowCredentialsModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Service: {currentRental.serviceName}</h3>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(currentRental.status)}`}
                  >
                    {currentRental.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Username</p>
                    <p className="font-mono text-sm">{currentRental.credentials.username}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Password</p>
                    <p className="font-mono text-sm">{currentRental.credentials.password}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <div className="mb-1">
                    <span className="font-medium">User:</span> {currentRental.userName}
                  </div>
                  <div className="mb-1">
                    <span className="font-medium">Start Date:</span>{" "}
                    {new Date(currentRental.startDate).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Expiry Date:</span>{" "}
                    {new Date(currentRental.expiryDate).toLocaleString()}
                  </div>
                </div>
              </div>

              <button
                onClick={handleResetCredentials}
                className="flex items-center justify-center w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Credentials
              </button>
              <p className="mt-2 text-xs text-gray-500 text-center">
                This will generate new credentials and revoke access to the old ones.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowCredentialsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Search, Plus, Edit, Trash2, X, Film, DollarSign, Clock, Info, ToggleLeft, ToggleRight } from "lucide-react"

interface Service {
  id: string
  name: string
  image: string
  description: string
  hourlyPrice: number
  dailyPrice: number
  weeklyPrice: number
  accessInfo: string
  active: boolean
}

export default function AdminServicesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentService, setCurrentService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    image: "",
    description: "",
    hourlyPrice: 0,
    dailyPrice: 0,
    weeklyPrice: 0,
    accessInfo: "",
    active: true,
  })

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/")
    } else if (status === "authenticated" && session?.user?.role === "admin") {
      // Fetch services
      fetchServices()
    }
  }, [status, session, router])

  const fetchServices = async () => {
    setLoading(true)
    try {
      // In a real app, this would be an actual API call
      // For demo purposes, we'll use mock data

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockServices: Service[] = [
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
        {
          id: "disney-plus",
          name: "Disney+",
          image: "/placeholder.svg?height=80&width=150&text=Disney+",
          description: "Stream Disney, Marvel, Star Wars, and more",
          hourlyPrice: 0.9,
          dailyPrice: 2.8,
          weeklyPrice: 6.5,
          accessInfo: "Access to all Disney+ content",
          active: false,
        },
      ]

      setServices(mockServices)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch services:", error)
      setLoading(false)
    }
  }

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // In a real app, this would be an actual API call
      console.log("Adding service:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add service to the list (in a real app, this would come from the API response)
      const newService: Service = {
        id: formData.id,
        name: formData.name,
        image: formData.image || `/placeholder.svg?height=80&width=150&text=${encodeURIComponent(formData.name)}`,
        description: formData.description,
        hourlyPrice: formData.hourlyPrice,
        dailyPrice: formData.dailyPrice,
        weeklyPrice: formData.weeklyPrice,
        accessInfo: formData.accessInfo,
        active: formData.active,
      }

      setServices([...services, newService])
      setShowAddModal(false)
      resetFormData()
    } catch (error) {
      console.error("Failed to add service:", error)
    }
  }

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentService) return

    try {
      // In a real app, this would be an actual API call
      console.log("Editing service:", currentService.id, formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update service in the list (in a real app, this would come from the API response)
      const updatedServices = services.map((service) => {
        if (service.id === currentService.id) {
          return {
            ...service,
            name: formData.name,
            image: formData.image || service.image,
            description: formData.description,
            hourlyPrice: formData.hourlyPrice,
            dailyPrice: formData.dailyPrice,
            weeklyPrice: formData.weeklyPrice,
            accessInfo: formData.accessInfo,
            active: formData.active,
          }
        }
        return service
      })

      setServices(updatedServices)
      setShowEditModal(false)
      setCurrentService(null)
      resetFormData()
    } catch (error) {
      console.error("Failed to edit service:", error)
    }
  }

  const handleDeleteService = async () => {
    if (!currentService) return

    try {
      // In a real app, this would be an actual API call
      console.log("Deleting service:", currentService.id)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Remove service from the list (in a real app, this would be confirmed by the API)
      const updatedServices = services.filter((service) => service.id !== currentService.id)

      setServices(updatedServices)
      setShowDeleteModal(false)
      setCurrentService(null)
    } catch (error) {
      console.error("Failed to delete service:", error)
    }
  }

  const handleToggleActive = async (service: Service) => {
    try {
      // In a real app, this would be an actual API call
      console.log("Toggling service active state:", service.id, !service.active)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update service in the list (in a real app, this would come from the API response)
      const updatedServices = services.map((s) => {
        if (s.id === service.id) {
          return {
            ...s,
            active: !s.active,
          }
        }
        return s
      })

      setServices(updatedServices)
    } catch (error) {
      console.error("Failed to toggle service active state:", error)
    }
  }

  const openEditModal = (service: Service) => {
    setCurrentService(service)
    setFormData({
      id: service.id,
      name: service.name,
      image: service.image,
      description: service.description,
      hourlyPrice: service.hourlyPrice,
      dailyPrice: service.dailyPrice,
      weeklyPrice: service.weeklyPrice,
      accessInfo: service.accessInfo,
      active: service.active,
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (service: Service) => {
    setCurrentService(service)
    setShowDeleteModal(true)
  }

  const resetFormData = () => {
    setFormData({
      id: "",
      name: "",
      image: "",
      description: "",
      hourlyPrice: 0,
      dailyPrice: 0,
      weeklyPrice: 0,
      accessInfo: "",
      active: true,
    })
  }

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
          <AdminSidebar activePage="services" />

          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Manage Services</h1>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search services..."
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
                        Service
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Pricing
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
                    {filteredServices.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                          No services found
                        </td>
                      </tr>
                    ) : (
                      filteredServices.map((service) => (
                        <tr key={service.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-20">
                                <Image
                                  src={service.image || "/placeholder.svg"}
                                  alt={service.name}
                                  width={80}
                                  height={40}
                                  className="object-contain"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                <div className="text-sm text-gray-500">{service.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div className="flex items-center mb-1">
                                <Clock className="h-3 w-3 mr-1 text-gray-400" />
                                <span>Hour: ${service.hourlyPrice}</span>
                              </div>
                              <div className="flex items-center mb-1">
                                <Clock className="h-3 w-3 mr-1 text-gray-400" />
                                <span>Day: ${service.dailyPrice}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1 text-gray-400" />
                                <span>Week: ${service.weeklyPrice}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleActive(service)}
                              className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                service.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {service.active ? (
                                <>
                                  <ToggleRight className="h-3 w-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="h-3 w-3 mr-1" />
                                  Inactive
                                </>
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openEditModal(service)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(service)}
                              className="text-red-600 hover:text-red-900"
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

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Service</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddService}>
              <div className="mb-4">
                <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
                  Service ID
                </label>
                <input
                  type="text"
                  id="id"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Use a unique identifier (e.g., "netflix", "spotify")</p>
              </div>

              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name
                </label>
                <div className="relative">
                  <Film className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="/placeholder.svg?height=80&width=150&text=Service"
                />
                <p className="mt-1 text-xs text-gray-500">Leave blank to use a placeholder image</p>
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="hourlyPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Hourly Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      id="hourlyPrice"
                      value={formData.hourlyPrice}
                      onChange={(e) => setFormData({ ...formData, hourlyPrice: Number.parseFloat(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="dailyPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Daily Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      id="dailyPrice"
                      value={formData.dailyPrice}
                      onChange={(e) => setFormData({ ...formData, dailyPrice: Number.parseFloat(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="weeklyPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Weekly Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      id="weeklyPrice"
                      value={formData.weeklyPrice}
                      onChange={(e) => setFormData({ ...formData, weeklyPrice: Number.parseFloat(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="accessInfo" className="block text-sm font-medium text-gray-700 mb-1">
                  Access Information
                </label>
                <div className="relative">
                  <Info className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="accessInfo"
                    value={formData.accessInfo}
                    onChange={(e) => setFormData({ ...formData, accessInfo: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="e.g., Instant access to a premium account"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active (available for rent)</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {showEditModal && currentService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Service</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditService}>
              <div className="mb-4">
                <label htmlFor="edit-id" className="block text-sm font-medium text-gray-700 mb-1">
                  Service ID
                </label>
                <input
                  type="text"
                  id="edit-id"
                  value={formData.id}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500">Service ID cannot be changed</p>
              </div>

              <div className="mb-4">
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name
                </label>
                <div className="relative">
                  <Film className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="edit-image" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  id="edit-image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="edit-hourlyPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Hourly Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      id="edit-hourlyPrice"
                      value={formData.hourlyPrice}
                      onChange={(e) => setFormData({ ...formData, hourlyPrice: Number.parseFloat(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="edit-dailyPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Daily Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      id="edit-dailyPrice"
                      value={formData.dailyPrice}
                      onChange={(e) => setFormData({ ...formData, dailyPrice: Number.parseFloat(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="edit-weeklyPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Weekly Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      id="edit-weeklyPrice"
                      value={formData.weeklyPrice}
                      onChange={(e) => setFormData({ ...formData, weeklyPrice: Number.parseFloat(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="edit-accessInfo" className="block text-sm font-medium text-gray-700 mb-1">
                  Access Information
                </label>
                <div className="relative">
                  <Info className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="edit-accessInfo"
                    value={formData.accessInfo}
                    onChange={(e) => setFormData({ ...formData, accessInfo: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active (available for rent)</span>
                </label>
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

      {/* Delete Service Confirmation Modal */}
      {showDeleteModal && currentService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Delete Service</h2>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete the service <span className="font-semibold">{currentService.name}</span>
                ? This action cannot be undone.
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
                onClick={handleDeleteService}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

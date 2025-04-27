"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft, Check, Copy, Clock } from "lucide-react"
import Link from "next/link"

export default function RentServicePage() {
  const params = useParams()
  const serviceId = params.service as string

  const [selectedDuration, setSelectedDuration] = useState<string>("hour")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)
  const [copied, setCopied] = useState(false)

  // This would come from an API in a real application
  const services = {
    netflix: {
      id: "netflix",
      name: "Netflix",
      image: "/placeholder.svg?height=80&width=150&text=Netflix",
      description: "Stream your favorite movies and TV shows",
      hourlyPrice: 1,
      dailyPrice: 3,
      weeklyPrice: 7,
      accessInfo: "Instant access to a premium account",
    },
    spotify: {
      id: "spotify",
      name: "Spotify",
      image: "/placeholder1.svg?height=80&width=150&text=Spotify",
      description: "Listen to millions of songs and podcasts",
      hourlyPrice: 0.5,
      dailyPrice: 1.5,
      weeklyPrice: 4,
      accessInfo: "Immediate access to premium features",
    },
    "amazon-prime": {
      id: "amazon-prime",
      name: "Amazon Prime",
      image: "/placeholder2.svg?height=80&width=150&text=Amazon+Prime",
      description: "Shop online with free shipping and watch Prime Video",
      hourlyPrice: 0.8,
      dailyPrice: 2.5,
      weeklyPrice: 6,
      accessInfo: "Full access to Prime benefits",
    },
  }

  const service = services[serviceId as keyof typeof services]

  if (!service) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Service not found</h1>
            <Link href="/" className="text-blue-600 hover:underline">
              Return to homepage
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const getCurrentPrice = () => {
    switch (selectedDuration) {
      case "hour":
        return service.hourlyPrice
      case "day":
        return service.dailyPrice
      case "week":
        return service.weeklyPrice
      default:
        return service.hourlyPrice
    }
  }

  const getDurationText = () => {
    switch (selectedDuration) {
      case "hour":
        return "1 Hour"
      case "day":
        return "1 Day"
      case "week":
        return "1 Week"
      default:
        return "1 Hour"
    }
  }

  const handleConfirmRent = () => {
    setShowConfirmation(true)
    // In a real app, you would send this to your backend
  }

  const handleShowCredentials = () => {
    setShowCredentials(true)
    // In a real app, this would trigger a backend request to generate credentials
  }

  const handleCopyCredentials = () => {
    // In a real app, this would copy the actual credentials to clipboard
    navigator.clipboard.writeText("username: flixo_user123\npassword: securePass456!")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Generate a random expiration time based on the selected duration
  const getExpirationTime = () => {
    const now = new Date()
    switch (selectedDuration) {
      case "hour":
        return new Date(now.getTime() + 60 * 60 * 1000).toLocaleString()
      case "day":
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toLocaleString()
      case "week":
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleString()
      default:
        return new Date(now.getTime() + 60 * 60 * 1000).toLocaleString()
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-600 mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to services
        </Link>

        {showConfirmation ? (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-2">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">Rental Confirmed!</h2>
            <div className="text-center mb-6">
              <p className="mb-2">
                You have rented <span className="font-semibold">{service.name}</span> for {getDurationText()}.
              </p>
              <p className="text-lg font-bold">Total Price: ${getCurrentPrice()}</p>

              <div className="mt-4 flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <p className="text-sm text-gray-600">Expires: {getExpirationTime()}</p>
              </div>
            </div>

            {showCredentials ? (
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Your Login Credentials</h3>
                  <button
                    onClick={handleCopyCredentials}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="font-mono text-sm bg-gray-100 p-3 rounded">
                  <p>username: flixo_user123</p>
                  <p>password: securePass456!</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  These credentials are valid until your rental expires. Do not share them with others.
                </p>
              </div>
            ) : (
              <button
                onClick={handleShowCredentials}
                className="w-full py-2 mb-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Show Account Credentials
              </button>
            )}

            <div className="flex justify-center">
              <Link
                href="/profile"
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
              >
                Go to My Rentals
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={`${service.name} logo`}
                    width={120}
                    height={60}
                    className="object-contain mr-4"
                  />
                  <div>
                    <h1 className="text-2xl font-bold">{service.name}</h1>
                    <p className="text-gray-600">{service.description}</p>
                    <p className="text-sm text-gray-500 mt-1 italic">{service.accessInfo}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">Select Rental Duration</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      className={`p-4 rounded-lg border ${
                        selectedDuration === "hour"
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedDuration("hour")}
                    >
                      <h3 className="font-medium">1 Hour</h3>
                      <p className="text-2xl font-bold mt-2">${service.hourlyPrice}</p>
                    </button>
                    <button
                      className={`p-4 rounded-lg border ${
                        selectedDuration === "day"
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedDuration("day")}
                    >
                      <h3 className="font-medium">1 Day</h3>
                      <p className="text-2xl font-bold mt-2">${service.dailyPrice}</p>
                    </button>
                    <button
                      className={`p-4 rounded-lg border ${
                        selectedDuration === "week"
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedDuration("week")}
                    >
                      <h3 className="font-medium">1 Week</h3>
                      <p className="text-2xl font-bold mt-2">${service.weeklyPrice}</p>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                  <div>
                    <p className="text-gray-600">Total Price:</p>
                    <p className="text-2xl font-bold">${getCurrentPrice()}</p>
                  </div>
                  <button
                    onClick={handleConfirmRent}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Confirm Rent
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

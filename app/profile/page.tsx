"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Clock, Eye, EyeOff, RefreshCw, AlertTriangle, Check } from "lucide-react"

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  // Mock data - in a real app, this would come from your backend
  const activeRentals = [
    {
      id: "rent-123",
      service: {
        id: "netflix",
        name: "Netflix",
        image: "/placeholder.svg?height=60&width=120&text=Netflix",
      },
      startDate: new Date().toLocaleString(),
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString(), // 1 day from now
      credentials: {
        username: "flixo_user123",
        password: "securePass456!",
      },
      remainingTime: "23 hours, 45 minutes",
      isActive: true,
    },
  ]

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleResetPassword = () => {
    setIsResetting(true)

    // Simulate API call
    setTimeout(() => {
      setIsResetting(false)
      setResetSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setResetSuccess(false)
      }, 3000)
    }, 1500)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Active Rentals</h2>

            {activeRentals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">You don't have any active rentals.</p>
                <Link
                  href="/"
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Browse Services
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {activeRentals.map((rental) => (
                  <div key={rental.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Image
                          src={rental.service.image || "/placeholder.svg"}
                          alt={rental.service.name}
                          width={80}
                          height={40}
                          className="object-contain mr-3"
                        />
                        <div>
                          <h3 className="font-semibold">{rental.service.name}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Expires: {rental.expiryDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Active
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md mb-4">
                      <h4 className="text-sm font-medium mb-2">Login Credentials</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-gray-500">Username</p>
                          <p className="font-mono text-sm">{rental.credentials.username}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Password</p>
                          <div className="flex items-center">
                            <p className="font-mono text-sm mr-2">
                              {showPassword ? rental.credentials.password : "••••••••••••"}
                            </p>
                            <button onClick={handleTogglePassword} className="text-gray-400 hover:text-gray-600">
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full w-3/4"></div>
                        </div>
                        <p className="ml-3 text-sm text-gray-600">{rental.remainingTime} left</p>
                      </div>

                      <button
                        onClick={handleResetPassword}
                        disabled={isResetting}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        {isResetting ? (
                          <>
                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                            Resetting...
                          </>
                        ) : resetSuccess ? (
                          <>
                            <Check className="h-3 w-3 mr-1 text-green-600" />
                            Password Reset!
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Reset Password
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Security Information</h2>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Important Security Notes</h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Our system prevents concurrent logins for security reasons.</li>
                      <li>If you're logged out unexpectedly, someone else may be using your credentials.</li>
                      <li>Use the "Reset Password" option to secure your account if needed.</li>
                      <li>Your access will automatically expire at the end of your rental period.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              If you encounter any issues with your rentals or account access, please contact our support team at
              <a href="mailto:support@flixo.com" className="text-blue-600 hover:underline">
                {" "}
                support@flixo.com
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

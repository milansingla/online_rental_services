import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ServiceCard } from "@/components/service-card"

export default function Home() {
  const services = [
    {
      id: "netflix",
      name: "Netflix",
      image: "/placeholder.svg?height=80&width=150&text=Netflix",
      description: "Stream your favorite movies and TV shows",
      hourlyPrice: 1,
      dailyPrice: 3,
      weeklyPrice: 7,
      accessInfo: "Instant access to a premium account",
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
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-10">
          <h1 className="text-3xl font-bold text-center mb-2">Flixo</h1>
          <p className="text-center text-gray-600 mb-8">Rent premium streaming services by the hour, day, or week</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                <span className="font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-medium mb-2">Choose a Service</h3>
              <p className="text-gray-600 text-sm">Browse our selection of premium services available for rent.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                <span className="font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-medium mb-2">Select Duration</h3>
              <p className="text-gray-600 text-sm">Pick how long you need the service - by hour, day, or week.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                <span className="font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-medium mb-2">Confirm Rental</h3>
              <p className="text-gray-600 text-sm">
                Review your selection, pay securely, and get instant access credentials.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

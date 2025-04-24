import Link from "next/link"
import Image from "next/image"

interface Service {
  id: string
  name: string
  image: string
  description: string
  hourlyPrice: number
  dailyPrice: number
  weeklyPrice: number
  accessInfo: string
}

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-center mb-4">
          <Image
            src={service.image || "/placeholder.svg"}
            alt={`${service.name} logo`}
            width={150}
            height={80}
            className="object-contain"
          />
        </div>
        <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <div>
            <p>1 Hour: ${service.hourlyPrice}</p>
            <p>1 Day: ${service.dailyPrice}</p>
            <p>1 Week: ${service.weeklyPrice}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-4 italic">{service.accessInfo}</p>
        <Link
          href={`/rent/${service.id}`}
          className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Rent Now
        </Link>
      </div>
    </div>
  )
}

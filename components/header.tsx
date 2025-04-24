import Link from "next/link"
import { UserCircle } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Flixo
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/profile" className="flex items-center text-gray-600 hover:text-gray-900">
              <UserCircle className="h-5 w-5 mr-1" />
              <span>My Profile</span>
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

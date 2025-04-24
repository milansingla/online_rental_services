import Link from "next/link"
import { LayoutDashboard, Users, ShoppingCart, CreditCard, Film, Settings, BarChart } from "lucide-react"

interface AdminSidebarProps {
  activePage: string
}

export function AdminSidebar({ activePage }: AdminSidebarProps) {
  const menuItems = [
    { name: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "users", label: "Users", icon: Users, href: "/admin/users" },
    { name: "rentals", label: "Rentals", icon: ShoppingCart, href: "/admin/rentals" },
    { name: "payments", label: "Payments", icon: CreditCard, href: "/admin/payments" },
    { name: "services", label: "Services", icon: Film, href: "/admin/services" },
    { name: "reports", label: "Reports", icon: BarChart, href: "/admin/reports" },
    { name: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
  ]
  // .
  return (
    <aside className="w-full md:w-64 mb-6 md:mb-0">
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm ${
                    activePage === item.name
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

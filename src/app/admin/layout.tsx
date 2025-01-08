'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Menu, X, Users, Truck, AlertTriangle, MessageCircle, LogOut } from 'lucide-react'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "@/components/Logo"
import { Adminlogout } from './logout/actions'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Check if the current page is the admin login page
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  const navItems = [
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/deliveries', label: 'Deliveries', icon: Truck },
    { href: '/admin/issues', label: 'Issues', icon: AlertTriangle },
    { href: '/admin/maintenance', label: 'Maintenance', icon: MessageCircle },
    { href: '/admin/lubrication', label: 'lubricaition', icon: MessageCircle },
    { href: '/admin/applies', label: 'Applies', icon: MessageCircle },
    { href: '/admin/chats', label: 'Chats', icon: MessageCircle },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Logo size={40} />
              <Link href="/admin/dashboard" className="flex-shrink-0 flex items-center ml-2">
                Admin Dashboard
              </Link>
              
            </div>
            <div className="hidden md:flex md:items-center md:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
              <form action={Adminlogout}>
                <Button>Log out</Button>
              </form>
              
            </div>
            <div className="flex items-center md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col h-full">
                    <div className="flex-1 py-6 space-y-4">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          <item.icon className="mr-4 h-5 w-5" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <div className="py-6">
                      <form action={Adminlogout}>
                        <Button className="w-full flex items-center justify-center">
                          <LogOut className="mr-2 h-5 w-5" />
                          Log out
                        </Button>
                      </form>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}


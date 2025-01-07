'use client'
import { Toaster } from 'sonner' // Importa el componente Toaster
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Home, Truck, PenToolIcon as Tool, AlertTriangle, User, MessageCircle } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { redirect } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { createClient } from "../../../utils/supabase/client"

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  type Message = {
    id: string;
    senderid: string;
    receiverid: string;
    message: string;
    createdat: string;
  };
  
  type User = {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
  };
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User | null>(null); // `null` es un valor válido al principio
  const [users, setUsers] = useState<User[]>([]);  
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function getUser() {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        console.log('no user')
        redirect('/login') // Redirigir al usuario a la página de inicio de sesión
      } else {
        // @ts-ignore
        setUser(data.user)
      }
    }
    getUser()

    async function getUsers() {
      const supabase = createClient()
      const { data: users, error: usersError } = await supabase.from("users").select()
      if (usersError) {
        console.log('error fetching users', usersError)
      } else {
        setUsers(users)
      }
    }
    getUsers()
  }, [])

  useEffect(() => {
    if (user && users.length > 0) {
      const currentUser = users.find(u => u.email === user.email)
      if (currentUser) {
        fetchMessages(currentUser.id)
      }
    }
  }, [user, users])

  const fetchMessages = async (userId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`senderid.eq.${userId},receiverid.eq.${userId}`)
      .order('createdat', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
    } else {
      setMessages(data)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) {
      console.error('Error: Message or user is missing')
      return
    }

    const currentUser = users.find(u => u.email === user.email)
    if (!currentUser) {
      console.error('Error: Current user not found')
      return
    }

    const newMessage = {
      senderid: currentUser.id,
      receiverid: '1', // ID del administrador
      message: inputMessage,
      createdat: new Date().toISOString(),
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('messages')
      .insert([newMessage])
      .select()

    if (error) {
      console.error('Error sending message:', error)
    } else {
      setMessages([...messages, ...data])
      setInputMessage('')
      scrollToBottom()
    }
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <main className="max-w-7xl mx-auto py-6 pb-24 sm:px-6 lg:px-8">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/dashboard" className={`flex flex-col items-center ${isActive('/dashboard') ? 'text-blue-500' : 'text-gray-500'}`}>
              <Home size={24} />
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
            <Link href="/dashboard/start-trip" className={`flex flex-col items-center ${isActive('/dashboard/start-trip') ? 'text-blue-500' : 'text-gray-500'}`}>
              <Truck size={24} />
              <span className="text-xs mt-1">Delivery</span>
            </Link>
            <Link href="/dashboard/maintenance" className={`flex flex-col items-center ${isActive('/dashboard/maintenance') ? 'text-blue-500' : 'text-gray-500'}`}>
              <Tool size={24} />
              <span className="text-xs mt-1">Maintenance</span>
            </Link>
            <Link href="/dashboard/issues" className={`flex flex-col items-center ${isActive('/dashboard/issues') ? 'text-blue-500' : 'text-gray-500'}`}>
              <AlertTriangle size={24} />
              <span className="text-xs mt-1">Issues</span>
            </Link>
            <Link href="/dashboard/profile" className={`flex flex-col items-center ${isActive('/dashboard/profile') ? 'text-blue-500' : 'text-gray-500'}`}>
              <User size={24} />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </div>
      </nav>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-24 right-4 rounded-full shadow-lg"
          >
            <MessageCircle size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Chat with Admin</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-grow">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  // @ts-ignore
                  className={`flex ${msg.senderid === 15 ? 'justify-start' : 'justify-end'} my-2`}
                >
                  <div
                    className={`inline-block px-4 py-2 rounded-lg max-w-xs ${
                      // @ts-ignore
                      msg.senderid === 15
                        ? 'bg-gray-100 text-gray-800 shadow'
                        : 'bg-blue-500 text-white shadow-md'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </ScrollArea>
            <div className="flex gap-2 mt-4 mb-10">
              <Input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <Button onClick={handleSendMessage}>
                Send
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Toaster  position="top-center" richColors />
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
  )
}

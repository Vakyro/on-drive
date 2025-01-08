'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from '@/lib/supabase'

interface User {
  id: string // Asegúrate de que cada usuario tenga un ID único
  firstname: string
  lastname: string
  rol: string
}

interface Message {
  id: number
  senderid: string
  receiverid: string
  message: string
  createdat: string
  sender: User
  receiver: User
}

export default function AdminChatsPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([]) // Estado para los usuarios
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [selectedButton, setSelectedButton] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState<string>('')

  const messagesEndRef = useRef<HTMLDivElement>(null) // Ref para el contenedor

  useEffect(() => {
    fetchMessages() // Obtener los mensajes directamente desde Supabase
    fetchUsers() // Cargar usuarios cuando se monta el componente
  }, [])

  useEffect(() => {
    scrollToBottom() // Auto-scroll cada vez que cambien los mensajes
  }, [messages])

  const fetchMessages = async () => {
    // Obtener los mensajes directamente desde Supabase
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:senderid(*), receiver:receiverid(*)')
      .order('createdat', { ascending: true })
    
    if (error) {
      console.error('Error fetching messages:', error)
    } else if (data) {
      setMessages(data)
    }
  }

  const fetchUsers = async () => {
    // Suponiendo que tienes una tabla 'users' en tu base de datos
    const { data, error } = await supabase.from('users').select('*')
    if (error) {
      console.error('Error fetching users:', error)
    } else if (data) {
      setUsers(data)
    }
  }

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId)
    setSelectedButton(userId)
  }

  // Buscar el nombre del usuario seleccionado
  const selectedUserName = users.find(user => user.id === selectedUser)

  const filteredMessages = selectedUser
    ? messages.filter(
        (message) =>
          message.senderid === selectedUser || message.receiverid === selectedUser
      )
    : []

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
  }

  const handleSendMessage = async () => {
    if (!newMessage || !selectedUser) {
      console.error('Error: Message or selected user is missing')
      return
    }

    const senderid = '1' // Aquí lo dejas fijo o lo cambias a un valor dinámico
    const receiverid = selectedUser

    const message = {
      senderid,
      receiverid,
      message: newMessage,
      createdat: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select()

    if (error) {
      console.error('Error adding message:', error)
    } else if (data) {
      console.log('Message sent successfully:', data)
      fetchMessages() // Recargar los mensajes
      setNewMessage('') // Limpiar el campo de entrada
    }
  }

  // Función para hacer scroll hasta el final
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  let ArrayNames: string[] = [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Chats</h1>
      <Tabs defaultValue="chats" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chats">Chats</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        <TabsContent value="chats">
          <Card>
            <CardHeader>
              <CardTitle>Active Chats</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="space-y-2">
                  {messages.map((message) => {
                    if (message.sender.rol !== 'Admin') {
                      const isSelected = selectedButton === message.senderid

                      if (ArrayNames.includes(message.sender.firstname)) {
                        console.log('Ese ya ta');
                      } else {
                        ArrayNames.push(message.sender.firstname);
                        return (
                          <Button
                            key={message.senderid}
                            className={`w-full justify-start font-bold border ${isSelected ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'}`}
                            onClick={() => handleUserSelect(message.senderid)}
                          >
                            {`${message.sender.firstname} ${message.sender.lastname}`}
                          </Button>
                        )
                      }
                    }
                    return null
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedUser && selectedUserName
                  ? `Chat with ${selectedUserName.firstname} ${selectedUserName.lastname}`
                  : 'Select a chat'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedUser ? (
                <>
                  <ScrollArea className="h-[calc(100vh-24rem)] mb-4">
                    <div className="space-y-4">
                      {filteredMessages.map((message) => {
                        const isSenderAdmin = message.sender.rol === 'Admin'
                        return (
                          <div key={message.id} className={`flex ${isSenderAdmin ? 'justify-end' : 'justify-start'}`} >
                            <div className={`max-w-[75%] p-2 rounded-lg ${isSenderAdmin ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} >
                              {message.message}
                            </div>
                          </div>
                        )
                      })}
                      <div ref={messagesEndRef}></div> {/* Marcador para el autoscroll */}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={newMessage}
                      onChange={handleMessageChange}
                      className="flex-grow"
                      placeholder="Type your reply..."
                    />
                    <Button
                      onClick={handleSendMessage}
                    >
                      Enviar
                    </Button>
                  </div>
                </>
              ) : (
                <p>Select a chat to view messages</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

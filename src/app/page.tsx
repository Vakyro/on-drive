import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Logo"
import { redirect } from 'next/navigation'
import { createClient } from '../../utils/supabase/server'

export default async function Home() {

  const supabase = await createClient()

  // Obtener los datos del usuario autenticado
  const { data, error } = await supabase.auth.getUser()
  
  // Si hay un error o el usuario no está autenticado, redirigir a login
  if (data?.user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <main className="flex flex-col items-center justify-center flex-grow w-full text-center">
        <Logo size={80} />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-4 mb-2">
          Welcome to the Truck Driver App
        </h1>
        <p className="mt-3 text-xl sm:text-2xl mb-6">
          Log in to access your forms and reports
        </p>
        <Link href="/login">
          <Button size="lg">Log In</Button>
        </Link>
      </main>
      <div className="w-full text-center sm:text-right mt-8 sm:mt-0">
        <Link href="/apply" className="text-blue-500 hover:underline text-sm sm:text-base">
          Want to work with us? Apply here!
        </Link>
      </div>
    </div>
  )
}


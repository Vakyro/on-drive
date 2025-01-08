import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Logo"
import { redirect } from 'next/navigation'
import { createClient } from '../../../utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/admin/login')
  } else {
    redirect('/admin/dashboard')
  }

}

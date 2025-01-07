'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../../utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const username = formData.get('username') as string
  const newEmail = username + '@ondrive.com'

  const data = {
    email: newEmail,
    password: formData.get('password') as string,
  }
  

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Error logging in:', error.message)
    return
  }

  revalidatePath('/')
  redirect('/dashboard')
}

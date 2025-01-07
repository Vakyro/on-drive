'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '../../../utils/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Username y contraseña son obligatorios.' };
  }

  const email = `${username}@ondrive.com`;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: 'Inicio de sesión fallido. Verifica tus credenciales.' };
  }

  revalidatePath('/');
  redirect('/dashboard');
}

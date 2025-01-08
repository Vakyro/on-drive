'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../../../utils/supabase/server'

export async function Adminlogin(formData: FormData) {
  const supabase = await createClient();

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const email = username + '@ondrive.com'

  if (!username || !password) {
    return { error: 'Username y contraseña son obligatorios.' };
  }

  // Intentar iniciar sesión con email y password
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: 'Inicio de sesión fallido. Verifica tus credenciales.' };
  }

  // Obtener el usuario autenticado
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: 'No se pudo obtener el usuario.' };
  }

  // Acceder al ID del usuario
  const userEmail = user.user.email;

  // Verificar si el usuario tiene el rol de 'admin'
  const { data: userDetails, error: roleError } = await supabase
    .from('users')
    .select('rol')
    .eq('email', userEmail)
    .single();

  if (roleError || !userDetails || userDetails.rol !== 'Admin') {
    return { error: 'Acceso denegado: Solo los administradores pueden acceder.' };
  }

  // Si todo está correcto, redirigir al dashboard
  revalidatePath('/admin', 'layout')
  redirect('/admin/dashboard')
}

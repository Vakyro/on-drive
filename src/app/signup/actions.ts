import { createClient } from '../../../utils/supabase/client';  // Importamos desde client.ts
import { redirect } from 'next/navigation';

interface UserFormData {
  firstname: string;
  lastname: string;
  rol: string;
  phonenumber: string;
  username: string;
  password: string;
}

export const registerUser = async (formData: UserFormData) => {
  const supabase = createClient(); // Crear cliente Supabase en el navegador

  const { firstname, lastname, rol, phonenumber, username, password } = formData;

  // Validación simple
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  try {
    // Primero, registrar al usuario en auth.users
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: username + '@ondrive.com',  // Usamos el username como email para el registro
      password,
    });

    if (authError) {
      throw new Error(`Error registering auth user: ${authError.message}`);
    }

    // No necesitamos el id de authUser en este flujo, solo confirmamos que el registro fue exitoso
    if (!authUser) {
      throw new Error('Auth user registration failed');
    }

    // Ahora proceder con la inserción en la tabla 'users', usando 'email' como clave
    const { error: usersError } = await supabase
      .from('users')
      .insert([
        {
          firstname,
          lastname,
          rol,
          phonenumber,
          username,
          password, // El password no debería almacenarse aquí si usas la autenticación de Supabase
          email: username + '@ondrive.com', // Usamos el email para asociar con la tabla de auth.users
        },
      ]);

    if (usersError) {
      throw new Error(`Error inserting user data into users table: ${usersError.message}`);
    }

    // Redirigir al usuario a la página de inicio de sesión
    return redirect('/login');
  } catch (error) {
    throw new Error(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

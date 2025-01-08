import { createClient } from '../../../../utils/supabase/client';

interface UserFormData {
  firstname: string;
  lastname: string;
  rol: string;
  phonenumber: string;
  username: string;
  password: string;
}

export const registerUser = async (formData: UserFormData) => {
  const supabase = createClient();
  const { firstname, lastname, rol, phonenumber, username, password } = formData;

  const { data: authUser, error: authError } = await supabase.auth.signUp({
    email: `${username}@ondrive.com`,
    password,
  });

  if (authError) throw new Error(authError.message);

  const { data, error } = await supabase
    .from('users')
    .insert([
      { firstname, lastname, rol, phonenumber, username, password, email: `${username}@ondrive.com` },
    ])
    .select(); // Selecciona los datos insertados

  if (error) throw new Error(error.message);

  return data?.[0]; // Devuelve el usuario recién creado
};

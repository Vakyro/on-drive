
import { redirect } from 'next/navigation'
import { createClient } from '../../../../utils/supabase/server'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Logo } from "@/components/Logo"
import { logout } from '../../logout/actions'

export default async function ProfilePage() {
  const supabase = await createClient()

  // Obtener usuario autenticado
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login')
  }

  // Obtener datos de perfil desde la tabla `users`
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select(`*`)
    .eq('email', user.email)
    .single()


  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-center mt-6">
          <Logo size={80} />
        </div>
        <CardHeader>
          <CardTitle>Perfil del Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <Input value={`${profile.firstname} ${profile.lastname}`} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rol</label>
              <Input value={profile.rol} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <Input value={profile.phonenumber} readOnly />
            </div>
          </div>
        </CardContent>
        {/* 
        <CardHeader>
          <CardTitle>Language</CardTitle>
        </CardHeader>
        */}
        <CardContent>
          <div className="space-y-4">
            {/*
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Language</label>
              <Select defaultValue="es">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="pt">Portugués</SelectItem>
                </SelectContent>
              </Select>
            </div>
            */}
            <form action={logout}>
              <Button type="submit" variant="destructive" className="w-full">
                Cerrar Sesión
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

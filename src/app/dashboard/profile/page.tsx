
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
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <Input value={`${profile.firstname} ${profile.lastname}`} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <Input value={profile.rol} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <Input value={profile.phonenumber} readOnly />
            </div>
          </div>
        </CardContent>
        <CardContent>
          <div className="space-y-4">
            <form action={logout}>
              <Button type="submit" variant="destructive" className="w-full">
                Log Out
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

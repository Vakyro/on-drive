'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from '@/lib/supabase'
import { createClient } from "../../../../utils/supabase/client"
import { toast } from 'sonner'

export default function IssuesForm() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    carriername: '',
    unitnumber: '',
    year: '',
    make: '',
    model: '',
    license: '',
    mileageorhour: '',
    repairdate: '',
    repairdescription: '',
    truckplate: '',
  })

  // Estado para la foto de evidencia
  const [fileEvidence, setFileEvidence] = useState<File | null>(null)
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState(null)

  useEffect(() => {
    fetchUser()
    fetchUsers()
  }, [])

  const fetchUser = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
      console.log('no user')
    } else {
      //@ts-ignore
      setUser(data.user)
    }
  }

  const fetchUsers = async () => {
    const supabase = createClient()
    const { data: users, error: usersError } = await supabase.from("users").select()
    if (usersError) {
      console.log('error fetching users', usersError)
    } else {
      //@ts-ignore
      setUsers(users)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  // Manejo del input de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileEvidence(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    //@ts-ignore
    const userId = users?.find(u => u.email === user?.email)?.id
    if (!userId) {
      console.error('User ID not found')
      return
    }

    // Si se seleccionó un archivo, se sube al bucket
    let fileUrl = null
    if (fileEvidence) {
      const fileExt = fileEvidence.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('RepairFotoEvidence')
        .upload(fileName, fileEvidence)

      if (uploadError) {
        console.error('Error uploading file:', uploadError)
        toast.error('Error uploading file')
        return
      }

      // Se obtiene la URL pública del archivo
      const { data: publicUrlData } = supabase.storage
        .from('RepairFotoEvidence')
        .getPublicUrl(fileName)
      fileUrl = publicUrlData.publicUrl
    }

    // Se inserta el registro en la tabla incluyendo la URL de la foto
    const { data, error } = await supabase
      .from('repairreport')
      .insert({
        carriername: formData.carriername,
        unitnumber: parseInt(formData.unitnumber),
        year: parseInt(formData.year),
        make: formData.make,
        model: formData.model,
        license: formData.license,
        mileageorhour: parseInt(formData.mileageorhour),
        repairdate: formData.repairdate,
        repairdescription: formData.repairdescription,
        truckplate: formData.truckplate,
        repairEvidence: fileUrl,
        userid: userId
      })

    if (error) {
      console.error('Error submitting issue:', error)
      toast.error('Error submitting report')
    } else {
      console.log('Issue submitted successfully:', data)
      toast.success('Issue submitted successfully!')
      router.push('/dashboard')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Report an Issue</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="carriername"
            placeholder="Carrier Name"
            value={formData.carriername}
            onChange={handleChange}
            required
          />
          <Input
            name="unitnumber"
            type="number"
            placeholder="Unit Number"
            value={formData.unitnumber}
            onChange={handleChange}
            required
          />
          <Input
            name="year"
            type="number"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            required
          />
          <Input
            name="make"
            placeholder="Make"
            value={formData.make}
            onChange={handleChange}
            required
          />
          <Input
            name="model"
            placeholder="Model"
            value={formData.model}
            onChange={handleChange}
            required
          />
          <Input
            name="license"
            placeholder="License"
            value={formData.license}
            onChange={handleChange}
            required
          />
          <Input
            name="mileageorhour"
            type="number"
            placeholder="Mileage or Hours"
            value={formData.mileageorhour}
            onChange={handleChange}
            required
          />
          <Input
            name="repairdate"
            type="date"
            value={formData.repairdate}
            onChange={handleChange}
            required
          />
          <Textarea
            name="repairdescription"
            placeholder="Repair Description"
            value={formData.repairdescription}
            onChange={handleChange}
            required
          />
          <Input
            name="truckplate"
            placeholder="Truck Plate"
            value={formData.truckplate}
            onChange={handleChange}
            required
          />

          {/* Label pegada al input para el archivo */}
          <div className="flex flex-col">
            <Label htmlFor="RepairEvidence" className="mb-1">
              Foto Evidence
            </Label>
            <Input
              type="file"
              name="RepairEvidence"
              id="RepairEvidence"
              onChange={handleFileChange}
              required
            />
          </div>

          <Button type="submit">Submit Issue Report</Button>
        </form>
      </CardContent>
    </Card>
  )
}

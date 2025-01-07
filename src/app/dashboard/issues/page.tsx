'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from '@/lib/supabase'
import { createClient } from "../../../../utils/supabase/client"
import { toast } from 'sonner';

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
    } else {//@ts-ignore
      setUser(data.user)
    }
  }

  const fetchUsers = async () => {
    const supabase = createClient()
    const { data: users, error: usersError } = await supabase.from("users").select()
    if (usersError) {
      console.log('error fetching users', usersError)
    } else {//@ts-ignore
      setUsers(users)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()//@ts-ignore
    const userId = users?.find(u => u.email === user?.email)?.id
    if (!userId) {
      console.error('User ID not found')
      return
    }

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
        userid: userId
      })

    if (error) {
      console.error('Error submitting issue:', error)
    } else {
      console.log('Issue submitted successfully:', data)
      toast.success('Issue submitted successfully!');
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
          <Button type="submit" >Submit Issue Report</Button>
        </form>
      </CardContent>
    </Card>
  )
}

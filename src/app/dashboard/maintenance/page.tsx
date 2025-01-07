'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "../../../../utils/supabase/client"
import { toast } from 'sonner';

export default function VehicleInspectionForm() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    carrier: '',
    address: '',
    inspectiondate: '',
    inspectiontime: '',
    truckplate: '',
    odometerreading: '',
    remarks: '',
    driversignature: '',
    mechanicsignature: '',
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
      console.log('No user')
    } else {//@ts-ignore
      setUser(data.user)
    }
  }

  const fetchUsers = async () => {
    const supabase = createClient()
    const { data: users, error: usersError } = await supabase.from("users").select()
    if (usersError) {
      console.log('Error fetching users', usersError)
    } else {//@ts-ignore
      setUsers(users)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, error } = await createClient()
      .from('vehicleinspection')
      .insert({
        ...formData,
        truckplate: parseInt(formData.truckplate),
        odometerreading: parseInt(formData.odometerreading),
        userid: users?.find(u => u.email === user?.email)?.id,
      })

    if (error) {
      console.error('Error submitting maintenance:', error)
    } else {
      console.log('Maintenance submitted successfully:', data)
      toast.success('Maintenance submitted successfully!')
      router.push('/dashboard')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Vehicle Inspection Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="carrier"
            placeholder="Carrier"
            value={formData.carrier}
            onChange={handleChange}
            required
          />
          <Input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <Input
            name="inspectiondate"
            type="date"
            value={formData.inspectiondate}
            onChange={handleChange}
            required
          />
          <Input
            name="inspectiontime"
            type="time"
            value={formData.inspectiontime}
            onChange={handleChange}
            required
          />
          <Input
            name="truckplate"
            type="text"
            placeholder="Truck Plate"
            value={formData.truckplate}
            onChange={handleChange}
            required
          />
          <Input
            name="odometerreading"
            type="number"
            placeholder="Odometer Reading"
            value={formData.odometerreading}
            onChange={handleChange}
            required
          />
          <Textarea
            name="remarks"
            placeholder="Remarks"
            value={formData.remarks}
            onChange={handleChange}
          />
          <Textarea
            name="driversignature"
            placeholder="Driver's Signature"
            value={formData.driversignature}
            onChange={handleChange}
            required
          />
          <Textarea
            name="mechanicsignature"
            placeholder="Mechanic's Signature"
            value={formData.mechanicsignature}
            onChange={handleChange}
            required
          />
          <Button type="submit">Submit Inspection</Button>
        </form>
      </CardContent>
    </Card>
  )
}

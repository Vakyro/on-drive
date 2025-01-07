'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "../../../../utils/supabase/client"
import { toast } from 'sonner';

export default function MaintenanceForm() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    carriername: '',
    unitnumber: '',
    year: '',
    make: '',
    model: '',
    license: '',
    mileageorhours: '',
    inspectiondate: '',
    performedby: '',
    lubrication: false,
    oilchange: false,
    oildadded: false,
    filterchange: false,
    transmission: false,
    differential: false,
    wheelbearings: false,
    batteries: false,
    brakeadjustment: false,
    tirepressure: false,
    alevelservice: false,
    blevelservice: false,
    clevelservice: false,
    truckplate: '', // Campo de texto para la placa del camión
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prevState => ({ ...prevState, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, error } = await createClient()
      .from('lubricationinspection')
      .insert({
        ...formData,
        unitnumber: parseInt(formData.unitnumber),
        year: parseInt(formData.year),
        mileageorhours: parseInt(formData.mileageorhours),//@ts-ignore
        userid: users?.find(u => u.email === user?.email)?.id, // Usar el ID del usuario de la tabla users
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
        <CardTitle className="text-2xl font-bold">Maintenance Form</CardTitle>
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
            name="mileageorhours"
            type="number"
            placeholder="Mileage or Hours"
            value={formData.mileageorhours}
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
            name="performedby"
            placeholder="Performed By"
            value={formData.performedby}
            onChange={handleChange}
            required
          />
          <div className="space-y-2">
            <Checkbox
              id="lubrication"
              checked={formData.lubrication}
              onCheckedChange={(checked) => handleCheckboxChange('lubrication', checked as boolean)}
            />
            <label htmlFor="lubrication" className="ml-2">Lubrication</label>
          </div>
          <div className="space-y-2">
            <Checkbox
              id="oilchange"
              checked={formData.oilchange}
              onCheckedChange={(checked) => handleCheckboxChange('oilchange', checked as boolean)}
            />
            <label htmlFor="oildadded" className="ml-2">Oil Change</label>
          </div>
          <div className="space-y-2">
            <Checkbox
              id="oildadded"
              checked={formData.oildadded}
              onCheckedChange={(checked) => handleCheckboxChange('oildadded', checked as boolean)}
            />
            <label htmlFor="oildadded" className="ml-2">Oil Added</label>
          </div>
          <div className="space-y-2">
            <Checkbox
              id="filterchange"
              checked={formData.filterchange}
              onCheckedChange={(checked) => handleCheckboxChange('filterchange', checked as boolean)}
            />
            <label htmlFor="filterchange" className="ml-2">Filter Change</label>
          </div>
          <div className="space-y-2">
            <Checkbox
              id="transmission"
              checked={formData.transmission}
              onCheckedChange={(checked) => handleCheckboxChange('transmission', checked as boolean)}
            />
            <label htmlFor="transmission" className="ml-2">Transmission</label>
          </div>
          <div className="space-y-2">
            <Checkbox
              id="differential"
              checked={formData.differential}
              onCheckedChange={(checked) => handleCheckboxChange('differential', checked as boolean)}
            />
            <label htmlFor="differential" className="ml-2">Differential</label>
          </div>
          <div className="space-y-2">
            <Checkbox
              id="wheelbearings"
              checked={formData.wheelbearings}
              onCheckedChange={(checked) => handleCheckboxChange('wheelbearings', checked as boolean)}
            />
            <label htmlFor="wheelbearings" className="ml-2">Wheel Bearings</label>
          </div>
          <div className="space-y-2">
            <Checkbox
              id="batteries"
              checked={formData.batteries}
              onCheckedChange={(checked) => handleCheckboxChange('batteries', checked as boolean)}
            />
            <label htmlFor="batteries" className="ml-2">Batteries</label>
          </div>
          <div className="space-y-2">
            <Checkbox
              id="brakeadjustment"
              checked={formData.brakeadjustment}
              onCheckedChange={(checked) => handleCheckboxChange('brakeadjustment', checked as boolean)}
            />
            <label htmlFor="brakeadjustment" className="ml-2">Brake Adjustment</label>
          </div>
          <div className="space-y-2">
            <Checkbox
              id="tirepressure"
              checked={formData.tirepressure}
              onCheckedChange={(checked) => handleCheckboxChange('tirepressure', checked as boolean)}
            />
            <label htmlFor="tirepressure" className="ml-2">Tire Pressure</label>
          </div>
          <div className="space-y-2">
            <Checkbox
              id="alevelservice"
              checked={formData.alevelservice}
              onCheckedChange={(checked) => handleCheckboxChange('alevelservice', checked as boolean)}
            />
            <label htmlFor="alevelservice" className="ml-2">A-Level Service</label>
          </div>
          <div className="space-y-2">
            <Checkbox
              id="blevelservice"
              checked={formData.blevelservice}
              onCheckedChange={(checked) => handleCheckboxChange('blevelservice', checked as boolean)}
            />
            <label htmlFor="blevelservice" className="ml-2">B-Level Service</label>
          </div>
          <div className="space-y-2">
            <Checkbox
              id="clevelservice"
              checked={formData.clevelservice}
              onCheckedChange={(checked) => handleCheckboxChange('clevelservice', checked as boolean)}
            />
            <label htmlFor="clevelservice" className="ml-2">C-Level Service</label>
          </div>
          <Input
            name="truckplate"
            placeholder="Truck Plate"
            value={formData.truckplate}
            onChange={handleChange}
            required
          />
          <Button type="submit">Submit Maintenance Report</Button>
        </form>
      </CardContent>
    </Card>
  )
}


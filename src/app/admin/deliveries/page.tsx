'use client';

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { supabase } from '@/lib/supabase'
import { createClient } from "../../../../utils/supabase/client"
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Delivery {
  id: number;
  destination: string;
  deliverydate: string;
  chargenumber: string;
  evidence: string;
  status: string;
  driverid: number;
  truckplate: string;
  users?: {
    firstname: string
    lastname: string
  }
}

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [drivers, setDrivers] = useState<any[]>([])

  useEffect(() => {
    async function getDeliveries(){
      const supabase = createClient()
      const { data: deliveries, error: deliveriesError } = await supabase.from("deliveries").select()
      if (deliveriesError) {
        console.log('error fetching deliveries', deliveriesError)
      } else {//@ts-ignore
        setDeliveries(deliveries)
      }
    }
    getDeliveries()

    async function getDrivers(){
      const supabase = createClient()
      const { data: drivers, error: driversError } = await supabase.from("users").select()
      if (driversError) {
        console.log('error fetching users', driversError)
      } else {//@ts-ignore
        setDrivers(drivers)
      }
    }
    getDrivers()
  }, [])

  const deleteDelivery = async (id: number) => {
    try {
      const { error } = await supabase
        .from('deliveries')
        .delete()
        .eq('id', id)

      if (error) throw error

      setDeliveries(deliveries.filter(delivery => delivery.id !== id))
    } catch (error) {
      console.error('Error deleting delivery:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ScrollArea className="h-[400px] w-full rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                <TableHead className="hidden md:table-cell">Id</TableHead>
                <TableHead className="hidden md:table-cell">Driver</TableHead>
                <TableHead className="hidden md:table-cell">Truck Plate</TableHead>
                <TableHead className="hidden md:table-cell">Destination</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Charge #</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Evidence</TableHead>
                <TableHead className="hidden md:table-cell">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="hidden md:table-cell">{delivery.id}</TableCell>
                    <TableCell className="hidden md:table-cell">{delivery.users ? `${delivery.users.firstname} ${delivery.users.lastname}` : 'Unassigned'}</TableCell>
                    <TableCell className="hidden md:table-cell">{delivery.truckplate}</TableCell>
                    <TableCell className="hidden md:table-cell">{delivery.destination}</TableCell>
                    <TableCell className="hidden md:table-cell">{delivery.deliverydate}</TableCell>
                    <TableCell className="hidden md:table-cell">{delivery.chargenumber}</TableCell>
                    <TableCell className="hidden md:table-cell">{delivery.status}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {delivery.evidence ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">View</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Delivery Evidence</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                              <Image
                                src={delivery.evidence}
                                alt="Delivery Evidence"
                                width={400}
                                height={300}
                                layout="responsive"
                                objectFit="cover"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        'No evidence'
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex space-x-2">
                        <Button variant="destructive" size="sm" onClick={() =>  deleteDelivery(delivery.id)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}

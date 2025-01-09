"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from 'next/image';

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
    firstname: string;
    lastname: string;
  };
}

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    async function getDeliveries() {
      const { data: deliveries, error } = await supabase.from("deliveries").select();
      if (!error) setDeliveries(deliveries || []);
    }
    getDeliveries();
  }, []);

  const deleteDelivery = async (id: number) => {
    try {
      const { error } = await supabase.from('deliveries').delete().eq('id', id);
      if (!error) setDeliveries(deliveries.filter(delivery => delivery.id !== id));
    } catch (error) {
      console.error('Error deleting delivery:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block">
          <ScrollArea className="h-[400px] w-full rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Truck Plate</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Charge #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Evidence</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell>{delivery.id}</TableCell>
                    <TableCell>{delivery.users ? `${delivery.users.firstname} ${delivery.users.lastname}` : 'Unassigned'}</TableCell>
                    <TableCell>{delivery.truckplate}</TableCell>
                    <TableCell>{delivery.destination}</TableCell>
                    <TableCell>{delivery.deliverydate}</TableCell>
                    <TableCell>{delivery.chargenumber}</TableCell>
                    <TableCell>{delivery.status}</TableCell>
                    <TableCell>
                      {delivery.evidence ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">View</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Delivery Evidence</DialogTitle>
                            </DialogHeader>
                            <Image src={delivery.evidence} alt="Delivery Evidence" width={400} height={300} className="object-cover" />
                          </DialogContent>
                        </Dialog>
                      ) : (
                        'No evidence'
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => deleteDelivery(delivery.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="border rounded-md p-4 bg-gray-50 space-y-2">
              <p><strong>Id:</strong> {delivery.id}</p>
              <p><strong>Driver:</strong> {delivery.users ? `${delivery.users.firstname} ${delivery.users.lastname}` : 'Unassigned'}</p>
              <p><strong>Truck Plate:</strong> {delivery.truckplate}</p>
              <p><strong>Destination:</strong> {delivery.destination}</p>
              <p><strong>Date:</strong> {delivery.deliverydate}</p>
              <p><strong>Charge #:</strong> {delivery.chargenumber}</p>
              <p><strong>Status:</strong> {delivery.status}</p>
              <p><strong>Evidence:</strong> {delivery.evidence ? (
                <div>
                  <Image
                    src={delivery.evidence}
                    alt="Evidence Image"
                    width={150}
                    height={100}
                    className="object-cover rounded"
                  />
                </div>
              ) : 'No evidence'}</p>
              <div className="flex space-x-2">
                <Button variant="destructive" size="sm" onClick={() => deleteDelivery(delivery.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

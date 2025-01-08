'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/lib/supabase';

interface VehicleInspection {
  id: number;
  carrier: string;
  address: string;
  inspectiondate: string;
  inspectiontime: string;
  truckplate: string;
  odometerreading: number;
  remarks: string;
  driversignature: string;
  mechanicsignature: string;
  userid: number;
}

export default function VehicleInspectionsPage() {
  const [inspections, setInspections] = useState<VehicleInspection[]>([]);

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    const { data, error } = await supabase
      .from('vehicleinspection')
      .select('*');
    if (data) setInspections(data);
    if (error) console.error('Error fetching vehicle inspections:', error);
  };

  const deleteInspection = async (id: number) => {
    try {
      const { error } = await supabase
        .from('vehicleinspection')
        .delete()
        .eq('id', id);
      if (error) throw error;

      setInspections(inspections.filter((inspection) => inspection.id !== id));
    } catch (error) {
      console.error('Error deleting vehicle inspection:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Inspection Management</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Inspection Date</TableHead>
                <TableHead>Inspection Time</TableHead>
                <TableHead>Truck Plate</TableHead>
                <TableHead>Odometer Reading</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Driver's Signature</TableHead>
                <TableHead>Mechanic's Signature</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell>{inspection.id}</TableCell>
                  <TableCell>{inspection.carrier}</TableCell>
                  <TableCell>{inspection.address}</TableCell>
                  <TableCell>{inspection.inspectiondate}</TableCell>
                  <TableCell>{inspection.inspectiontime}</TableCell>
                  <TableCell>{inspection.truckplate}</TableCell>
                  <TableCell>{inspection.odometerreading}</TableCell>
                  <TableCell>{inspection.remarks}</TableCell>
                  <TableCell>{inspection.driversignature}</TableCell>
                  <TableCell>{inspection.mechanicsignature}</TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm" onClick={() => deleteInspection(inspection.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

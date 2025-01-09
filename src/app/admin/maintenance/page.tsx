'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    const { data, error } = await supabase.from('vehicleinspection').select('*');
    if (data) setInspections(data);
    if (error) console.error('Error fetching vehicle inspections:', error);
  };

  const deleteInspection = async (id: number) => {
    try {
      const { error } = await supabase.from('vehicleinspection').delete().eq('id', id);
      if (!error) {
        setInspections(inspections.filter((inspection) => inspection.id !== id));
      } else {
        console.error('Error deleting vehicle inspection:', error);
      }
    } catch (error) {
      console.error('Unexpected error deleting inspection:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Inspection Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
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
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {inspections.map((inspection) => (
            <div key={inspection.id} className="border rounded-md p-4 bg-gray-50 space-y-2">
              <p><strong>Id:</strong> {inspection.id}</p>
              <p><strong>Carrier:</strong> {inspection.carrier}</p>
              <p><strong>Address:</strong> {inspection.address}</p>
              <p><strong>Inspection Date:</strong> {inspection.inspectiondate}</p>
              <p><strong>Inspection Time:</strong> {inspection.inspectiontime}</p>
              <p><strong>Truck Plate:</strong> {inspection.truckplate}</p>
              <p><strong>Odometer Reading:</strong> {inspection.odometerreading}</p>
              <p><strong>Remarks:</strong> {inspection.remarks}</p>
              <p><strong>Driver's Signature:</strong> {inspection.driversignature}</p>
              <p><strong>Mechanic's Signature:</strong> {inspection.mechanicsignature}</p>
              <div className="flex space-x-2">
                <Button variant="destructive" size="sm" onClick={() => deleteInspection(inspection.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';

interface LubricationInspection {
  id: number;
  carriername: string;
  unitnumber: string;
  year: number;
  make: string;
  model: string;
  license: string;
  mileageorhours: number;
  inspectiondate: string;
  performedby: string;
  lubrication: boolean;
  oilchange: boolean;
  oildadded: boolean;
  filterchange: boolean;
  transmission: boolean;
  differential: boolean;
  wheelbearings: boolean;
  batteries: boolean;
  brakeadjustment: boolean;
  tirepressure: boolean;
  alevelservice: boolean;
  blevelservice: boolean;
  clevelservice: boolean;
  truckplate: string;
  userid: number;
}

export default function LubricationInspectionsPage() {
  const [inspections, setInspections] = useState<LubricationInspection[]>([]);

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    const { data, error } = await supabase.from('lubricationinspection').select('*');
    if (data) setInspections(data);
    if (error) console.error('Error fetching lubrication inspections:', error);
  };

  const deleteInspection = async (id: number) => {
    try {
      const { error } = await supabase.from('lubricationinspection').delete().eq('id', id);
      if (!error) {
        setInspections(inspections.filter((inspection) => inspection.id !== id));
      } else {
        console.error('Error deleting lubrication inspection:', error);
      }
    } catch (error) {
      console.error('Unexpected error deleting inspection:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lubrication Inspection Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Carrier Name</TableHead>
                <TableHead>Unit Number</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Make</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Mileage/Hours</TableHead>
                <TableHead>Inspection Date</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell>{inspection.id}</TableCell>
                  <TableCell>{inspection.carriername}</TableCell>
                  <TableCell>{inspection.unitnumber}</TableCell>
                  <TableCell>{inspection.year}</TableCell>
                  <TableCell>{inspection.make}</TableCell>
                  <TableCell>{inspection.model}</TableCell>
                  <TableCell>{inspection.license}</TableCell>
                  <TableCell>{inspection.mileageorhours}</TableCell>
                  <TableCell>{inspection.inspectiondate}</TableCell>
                  <TableCell>{inspection.performedby}</TableCell>
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
              <p><strong>Carrier Name:</strong> {inspection.carriername}</p>
              <p><strong>Unit Number:</strong> {inspection.unitnumber}</p>
              <p><strong>Year:</strong> {inspection.year}</p>
              <p><strong>Make:</strong> {inspection.make}</p>
              <p><strong>Model:</strong> {inspection.model}</p>
              <p><strong>License:</strong> {inspection.license}</p>
              <p><strong>Mileage/Hours:</strong> {inspection.mileageorhours}</p>
              <p><strong>Inspection Date:</strong> {inspection.inspectiondate}</p>
              <p><strong>Performed By:</strong> {inspection.performedby}</p>
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

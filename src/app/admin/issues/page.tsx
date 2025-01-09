'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/lib/supabase';

interface RepairReport {
  id: number;
  carriername: string;
  unitnumber: string;
  year: number;
  make: string;
  model: string;
  license: string;
  mileageorhour: number;
  repairdate: string;
  repairdescription: string;
  truckplate: string;
  userid: number;
}

export default function RepairReportsPage() {
  const [repairReports, setRepairReports] = useState<RepairReport[]>([]);

  useEffect(() => {
    fetchRepairReports();
  }, []);

  const fetchRepairReports = async () => {
    const { data, error } = await supabase.from('repairreport').select('*');
    if (data) setRepairReports(data);
    if (error) console.error('Error fetching repair reports:', error);
  };

  const deleteRepairReport = async (id: number) => {
    try {
      const { error } = await supabase.from('repairreport').delete().eq('id', id);
      if (!error) {
        setRepairReports(repairReports.filter((report) => report.id !== id));
      } else {
        console.error('Error deleting repair report:', error);
      }
    } catch (error) {
      console.error('Unexpected error deleting report:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Repair Report Management</CardTitle>
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
                <TableHead>Mileage/Hour</TableHead>
                <TableHead>Repair Date</TableHead>
                <TableHead>Repair Description</TableHead>
                <TableHead>Truck Plate</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {repairReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.id}</TableCell>
                  <TableCell>{report.carriername}</TableCell>
                  <TableCell>{report.unitnumber}</TableCell>
                  <TableCell>{report.year}</TableCell>
                  <TableCell>{report.make}</TableCell>
                  <TableCell>{report.model}</TableCell>
                  <TableCell>{report.license}</TableCell>
                  <TableCell>{report.mileageorhour}</TableCell>
                  <TableCell>{report.repairdate}</TableCell>
                  <TableCell>{report.repairdescription}</TableCell>
                  <TableCell>{report.truckplate}</TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm" onClick={() => deleteRepairReport(report.id)}>
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
          {repairReports.map((report) => (
            <div key={report.id} className="border rounded-md p-4 bg-gray-50 space-y-2">
              <p><strong>Id:</strong> {report.id}</p>
              <p><strong>Carrier Name:</strong> {report.carriername}</p>
              <p><strong>Unit Number:</strong> {report.unitnumber}</p>
              <p><strong>Year:</strong> {report.year}</p>
              <p><strong>Make:</strong> {report.make}</p>
              <p><strong>Model:</strong> {report.model}</p>
              <p><strong>License:</strong> {report.license}</p>
              <p><strong>Mileage/Hour:</strong> {report.mileageorhour}</p>
              <p><strong>Repair Date:</strong> {report.repairdate}</p>
              <p><strong>Description:</strong> {report.repairdescription}</p>
              <p><strong>Truck Plate:</strong> {report.truckplate}</p>
              <div className="flex space-x-2">
                <Button variant="destructive" size="sm" onClick={() => deleteRepairReport(report.id)}>
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

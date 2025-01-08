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
    const { data, error } = await supabase
      .from('repairreport')
      .select('*');
    if (data) setRepairReports(data);
    if (error) console.error('Error fetching repair reports:', error);
  };

  const deleteRepairReport = async (id: number) => {
    try {
      const { error } = await supabase
        .from('repairreport')
        .delete()
        .eq('id', id);
      if (error) throw error;

      setRepairReports(repairReports.filter((report) => report.id !== id));
    } catch (error) {
      console.error('Error deleting repair report:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Repair Report Management</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border">
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

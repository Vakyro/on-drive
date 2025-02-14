'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

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
  driverName?: string;
  repairEvidence?: string; // URL de la evidencia
}

export default function RepairReportsPage() {
  const [repairReports, setRepairReports] = useState<RepairReport[]>([]);

  useEffect(() => {
    fetchRepairReports();
  }, []);

  const fetchRepairReports = async () => {
    const { data: repairData, error: repairError } = await supabase
      .from('repairreport')
      .select('*');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, firstname, lastname');

    if (repairError) console.error('Error fetching repair reports:', repairError);
    if (usersError) console.error('Error fetching users:', usersError);

    if (repairData && usersData) {
      const usersMap = usersData.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {} as Record<number, { firstname: string; lastname: string }>);

      const reportsWithUsers = repairData.map(report => ({
        ...report,
        driverName: usersMap[report.userid]
          ? `${usersMap[report.userid].firstname} ${usersMap[report.userid].lastname}`
          : 'Unassigned',
      }));

      setRepairReports(reportsWithUsers);
    }
  };

  // Función auxiliar para extraer el nombre del archivo desde la URL pública
  const extractFileName = (url: string) => {
    const segments = url.split('/');
    return segments[segments.length - 1];
  };

  const deleteRepairReport = async (id: number) => {
    try {
      // Buscamos el reporte para saber si tiene evidencia asociada
      const report = repairReports.find(r => r.id === id);
      if (report?.repairEvidence) {
        const fileName = extractFileName(report.repairEvidence);
        const { error: storageError } = await supabase.storage
          .from('RepairFotoEvidence')
          .remove([fileName]);
        if (storageError) {
          console.error('Error deleting evidence file:', storageError);
          // Aquí puedes decidir si abortar o continuar con la eliminación del reporte
        }
      }

      const { error } = await supabase
        .from('repairreport')
        .delete()
        .eq('id', id);
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
        {/* Tabla para escritorio */}
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
                <TableHead>Driver Name</TableHead>
                <TableHead>Truck Plate</TableHead>
                <TableHead>Evidence</TableHead>
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
                  <TableCell>{report.driverName}</TableCell>
                  <TableCell>{report.truckplate}</TableCell>
                  <TableCell>
                    {report.repairEvidence ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Repair Evidence</DialogTitle>
                          </DialogHeader>
                          <Image
                            src={report.repairEvidence}
                            alt="Repair Evidence"
                            width={400}
                            height={300}
                            className="object-cover"
                          />
                        </DialogContent>
                      </Dialog>
                    ) : (
                      "No evidence"
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteRepairReport(report.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Vista para móviles */}
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
              <p><strong>Driver Name:</strong> {report.driverName}</p>
              <p><strong>Truck Plate:</strong> {report.truckplate}</p>
              <p>
                <strong>Evidence:</strong>{" "}
                {report.repairEvidence ? (
                  <div>
                    <Image
                      src={report.repairEvidence}
                      alt="Repair Evidence"
                      width={150}
                      height={100}
                      className="object-cover rounded"
                    />
                  </div>
                ) : (
                  "No evidence"
                )}
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteRepairReport(report.id)}
                >
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

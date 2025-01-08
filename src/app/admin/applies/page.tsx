'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/lib/supabase';

interface Apply {
  id: number;
  name: string;
  email: string;
  pdf_name: string;
  phone: string;
  pdf_url: string;
}

export default function AppliesPage() {
  const [applies, setApplies] = useState<Apply[]>([]);

  useEffect(() => {
    const fetchApplies = async () => {
      const { data, error } = await supabase
        .from('applies')
        .select('*');
      if (data) setApplies(data);
      if (error) console.error('Error fetching applies:', error);
    };

    fetchApplies();
  }, []);

  useEffect(() => {
    const fetchPdfUrls = async () => {
      const applicationsWithUrls = await Promise.all(
        (applies || []).map(async (apply) => {
          const { data: urlData, error: urlError } = await supabase.storage
            .from("pdf-storage")
            .createSignedUrl(apply.pdf_name, 60 * 60); // 1 hora de expiración

          if (urlError) {
            console.error(`Error creando URL firmada para ${apply.pdf_name}:`, urlError);
            return { ...apply, pdf_url: "" };
          }

          return { ...apply, pdf_url: urlData?.signedUrl || "" };
        })
      );
      setApplies(applicationsWithUrls); // Update state with the URLs
    };

    if (applies.length > 0) {
      fetchPdfUrls();
    }
  }, [applies]);

  const deleteApply = async (id: number) => {
    try {
      const { error } = await supabase
        .from('applies')
        .delete()
        .eq('id', id);
      if (error) throw error;

      setApplies(applies.filter((apply) => apply.id !== id));
    } catch (error) {
      console.error('Error deleting apply:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply Management</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>PDF Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applies.map((apply) => (
                <TableRow key={apply.id}>
                  <TableCell>{apply.id}</TableCell>
                  <TableCell>{apply.name}</TableCell>
                  <TableCell>{apply.email}</TableCell>
                  <TableCell>{apply.phone}</TableCell>
                  <TableCell>
                    <a
                      href={apply.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Ver PDF
                    </a>
                  </TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm" onClick={() => deleteApply(apply.id)}>
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

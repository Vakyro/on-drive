'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner'

export default function ApplyPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [templateUrl, setTemplateUrl] = useState<string | null>(null);
  const supabase = createClient(); // Crea una instancia del cliente Supabase

  const fetchTemplateUrl = async () => {
    const { data, error } = await supabase.storage
      .from("pdf-storage")
      .createSignedUrl("template.pdf", 60); // Ajusta el archivo y la expiración

    if (error) {
      console.error("Error fetching template URL:", error);
    } else {
      setTemplateUrl(data?.signedUrl || null);
    }
  };

  useEffect(() => {
    fetchTemplateUrl();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setUploadStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setUploadStatus("Please select a file first.");
      return;
    }

    setUploadStatus("Uploading...");

    // Subir el archivo al bucket
    const { data, error } = await supabase.storage
      .from("pdf-storage")
      .upload(`uploads/${file.name}`, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      setUploadStatus("");
      toast.error('Failed to upload the file.')
      return;
    }

    console.log("Upload successful:", data);

    // Insertar información en la tabla "applies"
    const { error: dbError } = await supabase
      .from("applies")
      .insert({
        name,
        email,
        pdf_name: `uploads/${file.name}`,
        phone,
      });

    if (dbError) {
      console.error("Database insertion error:", dbError);
      toast.error('Failed to save application data.')
      setUploadStatus("");
      return;
    }

    toast.success('Application submitted successfully!')
    setUploadStatus("");
    // Limpiar el formulario después de enviar
    setName('');
    setEmail('');
    setPhone('');
    setFile(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Apply to Work With Us</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p>Before applying, please download and read our contract:</p>
            {templateUrl ? (
              <a
                href={templateUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="text-blue-500 underline mb-4"
              >
                <Button className="mt-2">Download Contract PDF</Button>
              </a>
            ) : (
              <p className="mb-4 text-gray-600">Loading template...</p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <div className="space-y-2">
              <Label htmlFor="contract">Upload Signed Contract (PDF)</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                required
              />
            </div>
            <Button type="submit" disabled={!file} className="w-full">
              Submit Application
            </Button>
            {uploadStatus && (
              <p className="mt-4 text-center text-sm">{uploadStatus}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

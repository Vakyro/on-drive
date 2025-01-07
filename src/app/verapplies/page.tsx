"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";

interface Apply {
  name: string;
  email: string;
  phone: string;
  pdf_name: string;
  pdf_url: string;
}

export default function AdminRequestsPage() {
  const [applications, setApplications] = useState<Apply[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Fetch data from applies table and generate signed URLs
  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      // Obtener datos de la tabla applies
      const { data: appliesData, error: appliesError } = await supabase
        .from("applies")
        .select("*");

      if (appliesError) throw appliesError;

      // Generar URLs firmadas para cada archivo PDF
      const applicationsWithUrls = await Promise.all(
        (appliesData || []).map(async (apply) => {
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

      setApplications(applicationsWithUrls);
    } catch (err: any) {
      console.error("Error fetching applications:", err);
      setError("Failed to fetch applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin - Solicitudes de Trabajo</h1>

      {loading && <p className="text-gray-600">Cargando solicitudes...</p>}

      {error && (
        <p className="text-red-600">
          {error} <button onClick={fetchApplications}>Reintentar</button>
        </p>
      )}

      {!loading && !error && applications.length === 0 && (
        <p className="text-gray-600">No hay solicitudes de trabajo disponibles.</p>
      )}

      {!loading && !error && applications.length > 0 && (
        <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Nombre</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Teléfono</th>
              <th className="border border-gray-300 px-4 py-2">PDF</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((apply, index) => (
              <tr key={index} className="bg-white">
                <td className="border border-gray-300 px-4 py-2">{apply.name}</td>
                <td className="border border-gray-300 px-4 py-2">{apply.email}</td>
                <td className="border border-gray-300 px-4 py-2">{apply.phone}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <a
                    href={apply.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Ver PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

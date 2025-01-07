'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("../../../components/Map"), { ssr: false });

export default function TripDetailsPage() {
  const router = useRouter();
  const [tripDetails, setTripDetails] = useState<any>(null);
  const [end, setEnd] = useState<{ lat: number, lng: number }>({ lat: 37.7749, lng: -122.4194 }); // Coordenadas de destino predeterminadas

  // Obtener los detalles del viaje desde sessionStorage
  useEffect(() => {
    const storedTripDetails = sessionStorage.getItem('tripDetails');
    if (storedTripDetails) {
      const tripDetails = JSON.parse(storedTripDetails);
      setTripDetails(tripDetails);
      console.log('Detalles del viaje:', tripDetails);

      // Verificar que las coordenadas sean válidas
      const lat = tripDetails.latitude;
      const lng = tripDetails.longitude;

      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        setEnd({
          lat: lat,
          lng: lng
        });
      } else {
        console.error('Coordenadas de destino inválidas:', lat, lng);
      }
    } else {
      console.warn('No se encontraron detalles del viaje en sessionStorage');
      router.push('/dashboard');
    }
  }, [router]);

  const handleEndTrip = async () => {
    router.push('/dashboard/upload');
  };

  console.log("End coordinates:", end); // Verificar las coordenadas de destino

  if (!tripDetails) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Detalles del viaje */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Detalles del Viaje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p><strong>Destino:</strong> {tripDetails.destination}</p>
            <p><strong>Fecha:</strong> {tripDetails.date}</p>
            <p><strong>Número de Carga:</strong> {tripDetails.chargeNumber}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Mapa</CardTitle>
        </CardHeader>

        {/* Verificar si las coordenadas son válidas antes de mostrar el mapa */}
        {end.lat && end.lng && !isNaN(end.lat) && !isNaN(end.lng) ? (
          <Map end={end} />
        ) : (
          <p>Coordenadas de destino no válidas.</p>
        )}
      </Card>

      {/* Botón para finalizar el viaje */}
      <div className="flex justify-center">
        <Button onClick={handleEndTrip} size="lg">Finalizar Viaje</Button>
      </div>
    </div>
  );
}

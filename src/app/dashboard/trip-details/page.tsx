'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import dynamic from "next/dynamic";

// Cargar el componente Map dinámicamente
const Map = dynamic(() => import("../../../components/Map"), { ssr: false });

export default function TripDetailsPage() {
  const router = useRouter();
  const [tripDetails, setTripDetails] = useState<any>(null);
  const [end, setEnd] = useState<{ lat: number, lng: number }>({ lat: 37.7749, lng: -122.4194 });
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [distanceRemaining, setDistanceRemaining] = useState<number>(0);

  // Obtener los detalles del viaje desde sessionStorage
  useEffect(() => {
    const storedTripDetails = sessionStorage.getItem('tripDetails');
    if (storedTripDetails) {
      const tripDetails = JSON.parse(storedTripDetails);
      setTripDetails(tripDetails);

      const lat = tripDetails.latitude;
      const lng = tripDetails.longitude;

      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        setEnd({ lat, lng });
      } else {
        console.error('Coordenadas de destino inválidas:', lat, lng);
      }
    } else {
      console.warn('No se encontraron detalles del viaje en sessionStorage');
      router.push('/dashboard');
    }
  }, [router]);

  // Obtener la ubicación actual del usuario
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
          },
          (error) => console.error('Error obteniendo la ubicación:', error),
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
      } else {
        console.error('Geolocalización no soportada en este navegador');
      }
    };

    getCurrentLocation();
  }, []);

  // Calcular la distancia restante entre la ubicación del usuario y el destino
  useEffect(() => {
    if (userLocation && end.lat && end.lng) {
      const distance = calculateDistance(userLocation, end);
      setDistanceRemaining(distance);
    }
  }, [userLocation, end]);

  const calculateDistance = (start: { lat: number; lng: number }, end: { lat: number; lng: number }) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (end.lat - start.lat) * (Math.PI / 180);
    const dLng = (end.lng - start.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(start.lat * (Math.PI / 180)) * Math.cos(end.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en km
    return distance;
  };

  const handleEndTrip = async () => {
    router.push('/dashboard/upload');
  };

  console.log("End coordinates:", end); 
  console.log("User location:", userLocation);
  console.log("Distance remaining:", distanceRemaining); 

  if (!tripDetails || !userLocation) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Trip Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p><strong>Destination:</strong> {tripDetails.destination}</p>
            <p><strong>Date:</strong> {tripDetails.date}</p>
            <p><strong>charge #:</strong> {tripDetails.chargeNumber}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Map</CardTitle>
        </CardHeader>
        {end.lat && end.lng && !isNaN(end.lat) && !isNaN(end.lng) ? (          
          //@ts-ignore
          <Map end={end} userLocation={userLocation} />
        ) : (
          <p>invalid destination coordinates.</p>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Distancia Restante</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Remaining distance:</strong> {distanceRemaining.toFixed(2)} km</p>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={handleEndTrip} size="lg">End trip</Button>
      </div>
    </div>
  );
}

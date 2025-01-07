'use client';
import { useState, useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "../../../../utils/supabase/client";
import GeocoderComponent from "@/components/GeocoderComponent";
import { toast } from 'sonner';

interface User {
  id: number;
  email: string;
}

export default function StartTripPage() {
  const router = useRouter();
  const [tripData, setTripData] = useState({
    destination: '',
    truckplate: '',
    date: '',
    chargeNumber: '',
    latitude: '',
    longitude: ''
  });

  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);

  useEffect(() => {
    fetchUser();
    fetchUsers();
  }, []);

  const fetchUser = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      console.log('no user');
    } else {//@ts-ignore
      setUser(data.user);
    }
  };

  const fetchUsers = async () => {
    const supabase = createClient();
    const { data: users, error: usersError } = await supabase.from("users").select();
    if (usersError) {
      console.log('error fetching users', usersError);
    } else {
      setUsers(users);
    }
  };

  // Función para verificar si el usuario hizo mantenimiento en la última semana
  const checkMaintenance = async (userId: number) => {
    console.log('Checking maintenance for user:', userId);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const supabase = createClient();
    
    // Verificamos si hay mantenimiento para este usuario dentro de la última semana
    const { data, error } = await supabase
      .from('lubricationinspection')
      .select()
      .eq('userid', userId)
      .gt('inspectiondate', oneWeekAgo.toISOString()); // Compara la fecha de mantenimiento con hace una semana

    if (error) {
      console.error('Error checking maintenance:', error);
      return false;
    } else if (data.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const handleChange = (name: string, value: string) => {
    setTripData(prev => ({ ...prev, [name]: value }));
  };

  const handleDestinationSelect = (address: string, latitude: number, longitude: number) => {
    setTripData(prev => ({
      ...prev,
      destination: address,
      latitude: latitude ? latitude.toString() : '',
      longitude: longitude ? longitude.toString() : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !users) {
      console.error('User data is missing');
      return;
    }

    const userId = users.find(u => u.email === user?.email)?.id;
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    // Verificar si el usuario ha hecho mantenimiento recientemente
    const isMaintenanceValid = await checkMaintenance(userId);

    if (!isMaintenanceValid) {
      toast.error('You must complete a maintenance before starting a new trip.');
      redirect('/dashboard/maintenance');
      return; // Evita continuar con la entrega si no se ha realizado mantenimiento reciente
    }

    // Si se ha realizado mantenimiento recientemente, procedemos con la creación de la entrega
    const { data, error } = await createClient()
      .from('deliveries')
      .insert({
        destination: tripData.destination,
        truckplate: tripData.truckplate,
        deliverydate: tripData.date,
        chargenumber: tripData.chargeNumber,
        status: 'in progress',
        driverid: userId,
        evidence: null
      });

    if (error) {
      console.error('Error adding delivery:', error);
    } else {
      console.log('Delivery added successfully:', data);
      sessionStorage.setItem('tripDetails', JSON.stringify({
        destination: tripData.destination,
        truckplate: tripData.truckplate,
        date: tripData.date,
        chargeNumber: tripData.chargeNumber,
        latitude: tripData.latitude,
        longitude: tripData.longitude,
        driverid: userId
      }));
      router.push('/dashboard/trip-details');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Start New Trip</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
            <GeocoderComponent onSelect={handleDestinationSelect} placeholder={tripData.destination} />
          </div>
          <div>
            <label htmlFor="truckplate" className="block text-sm font-medium text-gray-700">Truck Plate</label>
            <Input
              type="text"
              id="truckplate"
              name="truckplate"
              value={tripData.truckplate}
              onChange={(e) => handleChange('truckplate', e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <Input
              type="date"
              id="date"
              name="date"
              value={tripData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="chargeNumber" className="block text-sm font-medium text-gray-700">Charge Number</label>
            <Input
              type="text"
              id="chargeNumber"
              name="chargeNumber"
              value={tripData.chargeNumber}
              onChange={(e) => handleChange('chargeNumber', e.target.value)}
              required
            />
          </div>
          <Button type="submit" size="lg">Start Trip</Button>
        </form>
      </CardContent>
    </Card>
  );
}

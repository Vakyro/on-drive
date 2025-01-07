import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Coordinates {
  lat: number;
  lng: number;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const Mapp: React.FC<{ end: Coordinates }> = ({ end }) => {
  const [start, setStart] = useState<Coordinates | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setStart({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error);
          setStart({ lat: 37.7749, lng: -122.4194 }); // Coordenadas predeterminadas (San Francisco)
        }
      );
    } else {
      console.error("Geolocalización no disponible en este navegador");
      setStart({ lat: 37.7749, lng: -122.4194 }); // Coordenadas predeterminadas (San Francisco)
    }
  }, []);

  useEffect(() => {
    console.log("Start coordinates:", start); // Verificar coordenadas de inicio
    console.log("End coordinates:", end); // Verificar coordenadas de destino

    // Validar que las coordenadas de inicio y destino son válidas
    if (!mapContainerRef.current || !start || isNaN(start.lat) || isNaN(start.lng) || isNaN(end.lat) || isNaN(end.lng)) {
      console.error("Coordenadas inválidas:", start, end);
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [start.lng, start.lat], // Coordenadas iniciales (ubicación del dispositivo)
      zoom: 12,
    });

    // Añadir marcador de inicio
    new mapboxgl.Marker().setLngLat([start.lng, start.lat]).addTo(map);

    // Añadir marcador de destino
    new mapboxgl.Marker().setLngLat([end.lng, end.lat]).addTo(map);

    // Obtener y dibujar la ruta
    const getRoute = async () => {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const data = await query.json();
      const route = data.routes[0].geometry;

      // Dibujar la ruta en el mapa
      map.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: route,
          },
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3887be",
          "line-width": 5,
        },
      });
    };

    getRoute();

    return () => map.remove();
  }, [start, end]); // Se actualiza cuando cambian las coordenadas de inicio o destino

  return <div className="mx-auto my-4" ref={mapContainerRef} style={{ width: "75%", height: "450px" }} />;
};

export default Mapp;

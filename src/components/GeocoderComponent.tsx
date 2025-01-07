"use client";

import React, { useEffect, useState } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "mapbox-gl"; // Asegúrate de que el acceso al token esté configurado

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "your-mapbox-access-token-here"; // Reemplaza con tu token

interface GeocoderComponentProps {
  onSelect: (address: string, latitude: number, longitude: number) => void;  // Callback para pasar el valor al componente padre
  placeholder: string;  // Recibe el valor del destino como placeholder
}

const GeocoderComponent: React.FC<GeocoderComponentProps> = ({ onSelect, placeholder }) => {
  useEffect(() => {
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      placeholder: placeholder,  // Usa el valor recibido como placeholder
      mapboxgl: mapboxgl,
    });

    geocoder.on("result", (event) => {
      const selectedAddress = event.result?.place_name || "";  // Obtén el nombre del lugar
      const latitude = event.result?.geometry.coordinates[1] || 0;  // Obtén la latitud
      const longitude = event.result?.geometry.coordinates[0] || 0; // Obtén la longitud
      onSelect(selectedAddress, latitude, longitude);  // Pasa el valor al componente padre con las coordenadas
    });

    const geocoderContainer = document.getElementById("geocoder-container");
    if (geocoderContainer) {
      geocoderContainer.appendChild(geocoder.onAdd());
    }

    // Estiliza el input del geocoder
    const inputElement = document.querySelector(".mapboxgl-ctrl-geocoder--input");
    if (inputElement) {
      inputElement.className = ""; // Elimina clases por defecto
      inputElement.classList.add(
        "flex",
        "h-9",
        "w-full",
        "rounded-md",
        "border",
        "border-input",
        "bg-transparent",
        "px-3",
        "py-1",
        "text-base",
        "shadow-sm",
        "transition-colors",
        "placeholder:text-muted-foreground",
        "focus:outline-none",
        "focus:ring-1",
        "focus:ring-ring",
        "disabled:cursor-not-allowed",
        "disabled:opacity-50"
      );
    }

    return () => {
      if (geocoderContainer) {
        geocoderContainer.innerHTML = "";
      }
    };
  }, [onSelect, placeholder]);

  return (
    <div>
      <div id="geocoder-container" className="mb-4" />
    </div>
  );
};

export default GeocoderComponent;

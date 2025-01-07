'use client'
import React, { useState } from "react";
import dynamic from "next/dynamic";

// Cargar el componente Map dinámicamente sin renderizado del lado del servidor (SSR)
const Map = dynamic(() => import("../../components/Map"), { ssr: false });

const HomePage: React.FC = () => {
  const [start, setStart] = useState({ lat: 37.7749, lng: -122.4194 }); // San Francisco
  const [end, setEnd] = useState({ lat: 34.0522, lng: -118.2437 }); // Los Ángeles

  return (
    <div>
      <h1>Mapa con Mapbox</h1>
      <p>Ruta desde San Francisco a Los Ángeles:</p>
      {/* @ts-ignore */}
      <Map start={start} end={end} />
    </div>
  );
};

export default HomePage;

'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, RefreshCw } from 'lucide-react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from 'sonner'

const supabase = createClientComponentClient()

export default function EndTripPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [deliveryId, setDeliveryId] = useState<string | null>(null) // Cambiado a string | null

  useEffect(() => {
    const fetchRecentDelivery = async () => {
      // Obtener los detalles del viaje desde sessionStorage
      const storedTripDetails = sessionStorage.getItem('tripDetails')
      if (!storedTripDetails) {
        console.warn('No se encontraron detalles del viaje en sessionStorage')
        router.push('/dashboard')
        return
      }

      const tripDetails = JSON.parse(storedTripDetails)

      // Obtener el delivery más reciente del conductor con estado 'in progress'
      const { data, error } = await supabase
        .from('deliveries')
        .select('id')
        .eq('driverid', tripDetails.driverid) // Filtrar por driverid
        .eq('status', 'in progress') // Filtrar por estado "in progress"
        .order('deliverydate', { ascending: false }) // Ordenar por deliverydate (más reciente primero)
        .limit(1)

      if (error) {
        console.error("Error fetching recent delivery:", error)
        return
      }

      if (data && data.length > 0) {
        const latestDeliveryId = data[0].id
        setDeliveryId(latestDeliveryId)
      } else {
        console.error("No 'in progress' deliveries found.")
        router.push('/dashboard') // Redirigir si no hay entregas "in progress"
      }
    }

    fetchRecentDelivery()

    if (cameraActive) {
      startCamera()
    } else {
      stopCamera()
    }
  }, [cameraActive, router])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing the camera", err)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        const imageDataUrl = canvasRef.current.toDataURL('image/jpeg')
        setImage(imageDataUrl)
        setCameraActive(false)
      }
    }
  }

  const uploadPhoto = async () => {
    if (!image || !deliveryId) { // Comprobamos que deliveryId no sea nulo o vacío
      console.error("No image or delivery ID provided")
      return
    }

    // Convertir la imagen a Blob
    const blob = await (await fetch(image)).blob()

    const fileName = `delivery_${deliveryId}_${Date.now()}.png`
    console.log("Uploading photo with fileName:", fileName)

    // Subir la foto a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("deliveries_evidences")
      .upload(fileName, blob, {
        contentType: "image/png",
      })

    if (uploadError) {
      console.error("Error uploading photo:", uploadError)
      return
    }

    console.log("Photo uploaded successfully:", uploadData)

    // Obtener URL pública del archivo subido
    const { data: publicUrlData } = supabase.storage
      .from("deliveries_evidences")
      .getPublicUrl(fileName)

    const publicUrl = publicUrlData?.publicUrl

    if (!publicUrl) {
      console.error("Error generating public URL")
      return
    }

    console.log("Public URL of the uploaded photo:", publicUrl)
    console.log("deliveryid:", deliveryId)

    // Actualizar la entrega en la base de datos
    const { data: updateData, error: updateError } = await supabase
      .from("deliveries")
      .update({ 
        evidence: publicUrl,
        status: 'completed',
      })
      .eq("id", deliveryId)

    if (updateError) {
      console.error("Error updating delivery record:", updateError)
    } else {
      console.log("Delivery record updated successfully:", updateData)
      toast.success('¡Viaje finalizado exitosamente!')
      router.push('/dashboard')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    uploadPhoto()
  }

  // Verifica si el botón de "End Trip and Upload Evidence" debe estar habilitado
  const isButtonDisabled = !image || !deliveryId 

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">End Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              {!cameraActive && !image && (
                <Button type="button" onClick={() => setCameraActive(true)} className="w-full">
                  <Camera className="mr-2 h-4 w-4" /> Start Camera
                </Button>
              )}
              {cameraActive && (
                <div className="relative">
                  <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                  <Button 
                    type="button" 
                    onClick={captureImage} 
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
                  >
                    Capture
                  </Button>
                </div>
              )}
              {image && (
                <div className="relative">
                  <img src={image} alt="Captured evidence" className="w-full rounded-lg" />
                  <Button 
                    type="button" 
                    onClick={() => {
                      setImage(null)
                      setCameraActive(true)
                    }} 
                    className="absolute top-2 right-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} width={640} height={480} />
            <Button 
              type="submit" 
              className="w-full mt-4" 
              disabled={isButtonDisabled} // El botón se habilita cuando image y deliveryId son válidos
            >
              End Trip and Upload Evidence
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

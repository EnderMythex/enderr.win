"use client"

import { useEffect, useState, memo, useRef } from "react"

export const Coordinates = memo(function Coordinates() {
  const [time, setTime] = useState("")
  const [coords, setCoords] = useState({ lat: "48.8566", lng: "02.3522" })
  const [isVisible, setIsVisible] = useState(false)
  const coordsRef = useRef({ lat: 48.8566, lng: 2.3522 })

  useEffect(() => {
    // Délai d'apparition
    const showTimer = setTimeout(() => setIsVisible(true), 200)

    // Mise à jour de l'heure
    const updateTime = () => {
      const now = new Date()
      setTime(now.toISOString().slice(11, 19))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)

    // Coordonnées qui changent subtilement avec interpolation
    const coordInterval = setInterval(() => {
      coordsRef.current = {
        lat: 48.8566 + (Math.random() - 0.5) * 0.0002,
        lng: 2.3522 + (Math.random() - 0.5) * 0.0002,
      }
      setCoords({
        lat: coordsRef.current.lat.toFixed(4),
        lng: coordsRef.current.lng.toFixed(4),
      })
    }, 4000) // Moins fréquent

    return () => {
      clearTimeout(showTimer)
      clearInterval(interval)
      clearInterval(coordInterval)
    }
  }, [])

  return (
    <div
      className="font-mono text-xs text-zinc-800 space-y-1"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(-10px)",
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
      }}
    >
      <div className="flex gap-4">
        <span style={{ transition: "opacity 0.3s" }}>LAT {coords.lat}°N</span>
        <span style={{ transition: "opacity 0.3s" }}>LNG {coords.lng}°E</span>
      </div>
      <div className="flex gap-4">
        <span>UTC {time}</span>
        <span className="text-zinc-700">FREQ 108.0 MHz</span>
      </div>
    </div>
  )
})

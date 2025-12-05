"use client"

import { useEffect, useRef } from "react"

export function NoiseOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    // Utiliser une résolution plus basse pour de meilleures performances
    const scale = 0.25

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * scale)
      canvas.height = Math.floor(window.innerHeight * scale)
      canvas.style.width = window.innerWidth + "px"
      canvas.style.height = window.innerHeight + "px"
      ctx.imageSmoothingEnabled = false
    }
    resize()
    window.addEventListener("resize", resize)

    let animationId: number
    let lastTime = 0
    const fps = 15 // Limiter à 15 FPS pour le bruit
    const interval = 1000 / fps

    const noise = (currentTime: number) => {
      animationId = requestAnimationFrame(noise)

      const delta = currentTime - lastTime
      if (delta < interval) return
      lastTime = currentTime - (delta % interval)

      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data
      const length = data.length

      // Optimisation: incrémenter par 16 pour moins de calculs
      for (let i = 0; i < length; i += 16) {
        const value = Math.random() * 255
        for (let j = 0; j < 16 && i + j < length; j += 4) {
          data[i + j] = value
          data[i + j + 1] = value
          data[i + j + 2] = value
          data[i + j + 3] = 10
        }
      }

      ctx.putImageData(imageData, 0, 0)
    }

    animationId = requestAnimationFrame(noise)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-30"
      style={{ imageRendering: "pixelated" }}
    />
  )
}

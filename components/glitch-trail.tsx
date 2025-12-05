"use client"

import { useEffect, useRef, memo } from "react"

interface GlitchPoint {
  id: number
  x: number
  y: number
  char: string
  opacity: number
  element?: HTMLSpanElement
}

const glitchChars = "█▓▒░╔╗╚╝║═◢◣◤◥▲▼◀▶●○■□"

export const GlitchTrail = memo(function GlitchTrail() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pointsRef = useRef<GlitchPoint[]>([])
  const counterRef = useRef(0)
  const poolRef = useRef<HTMLSpanElement[]>([])
  const maxPoints = 12

  // Créer un pool d'éléments réutilisables
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Pré-créer les éléments du pool
    for (let i = 0; i < maxPoints; i++) {
      const span = document.createElement("span")
      span.className = "absolute font-mono text-xs text-zinc-700 select-none"
      span.style.cssText = "will-change: transform, opacity; pointer-events: none;"
      span.style.opacity = "0"
      container.appendChild(span)
      poolRef.current.push(span)
    }

    return () => {
      poolRef.current.forEach(el => el.remove())
      poolRef.current = []
    }
  }, [])

  useEffect(() => {
    let lastTime = 0
    const throttleMs = 80 // Augmenté pour moins de points
    let animationId: number

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastTime > throttleMs) {
        lastTime = now

        const newPoint: GlitchPoint = {
          id: counterRef.current++,
          x: e.clientX + (Math.random() - 0.5) * 30,
          y: e.clientY + (Math.random() - 0.5) * 30,
          char: glitchChars[Math.floor(Math.random() * glitchChars.length)],
          opacity: 1,
        }

        // Réutiliser un élément du pool
        const poolIndex = counterRef.current % maxPoints
        const element = poolRef.current[poolIndex]
        if (element) {
          element.textContent = newPoint.char
          element.style.transform = `translate3d(${newPoint.x}px, ${newPoint.y}px, 0) translate(-50%, -50%)`
          element.style.opacity = "0.5"
          newPoint.element = element
        }

        pointsRef.current = [...pointsRef.current.slice(-(maxPoints - 1)), newPoint]
      }
    }

    const fadeOut = () => {
      pointsRef.current = pointsRef.current
        .map((p) => {
          const newOpacity = p.opacity - 0.04
          if (p.element) {
            p.element.style.opacity = String(Math.max(0, newOpacity * 0.5))
            p.element.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${0.5 + newOpacity * 0.5})`
          }
          return { ...p, opacity: newOpacity }
        })
        .filter((p) => p.opacity > 0)

      animationId = requestAnimationFrame(fadeOut)
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    animationId = requestAnimationFrame(fadeOut)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[25]" />
})

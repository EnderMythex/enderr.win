"use client"

import { useEffect, useRef, useCallback } from "react"

export function CursorDistortion() {
  const containerRef = useRef<HTMLDivElement>(null)
  const hLineRef = useRef<HTMLDivElement>(null)
  const vLineRef = useRef<HTMLDivElement>(null)
  const isMovingRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const rafRef = useRef<number>()
  const targetPos = useRef({ x: -100, y: -100 })
  const currentPos = useRef({ x: -100, y: -100 })

  const animate = useCallback(() => {
    // Interpolation fluide (lerp)
    const ease = 0.15
    currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease
    currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease

    if (containerRef.current) {
      containerRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%)`
    }
    if (hLineRef.current) {
      hLineRef.current.style.transform = `translate3d(0, ${currentPos.current.y}px, 0)`
    }
    if (vLineRef.current) {
      vLineRef.current.style.transform = `translate3d(${currentPos.current.x}px, 0, 0)`
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY }

      if (!isMovingRef.current && containerRef.current) {
        isMovingRef.current = true
        containerRef.current.style.opacity = "1"
      }

      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        isMovingRef.current = false
        if (containerRef.current) {
          containerRef.current.style.opacity = "0.6"
        }
      }, 150)
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timeoutRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [animate])

  return (
    <>
      {/* Halo lumineux principal */}
      <div
        ref={containerRef}
        className="fixed top-0 left-0 pointer-events-none z-30"
        style={{
          willChange: "transform",
          opacity: 0.6,
          transition: "opacity 0.3s ease-out",
        }}
      >
        {/* Cercle de distorsion externe */}
        <div
          className="absolute w-64 h-64 rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
          }}
        />

        {/* Anneau de glitch */}
        <div
          className="absolute w-32 h-32 rounded-full border border-zinc-800/30 -translate-x-1/2 -translate-y-1/2 animate-pulse"
        />

        {/* Point central */}
        <div
          className="absolute w-1.5 h-1.5 rounded-full bg-zinc-500 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Lignes de scan qui suivent la souris */}
      <div
        ref={hLineRef}
        className="fixed top-0 left-0 pointer-events-none z-20 w-screen h-px bg-gradient-to-r from-transparent via-zinc-800/20 to-transparent"
        style={{ willChange: "transform" }}
      />
      <div
        ref={vLineRef}
        className="fixed top-0 left-0 pointer-events-none z-20 h-screen w-px bg-gradient-to-b from-transparent via-zinc-800/20 to-transparent"
        style={{ willChange: "transform" }}
      />
    </>
  )
}

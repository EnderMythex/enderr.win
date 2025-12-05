"use client"

import { useEffect, useState, useRef, memo } from "react"
import { cn } from "@/lib/utils"

interface SignalTextProps {
  text: string
  className?: string
  delay?: number
  typewriter?: boolean
}

export const SignalText = memo(function SignalText({ text, className, delay = 0, typewriter = false }: SignalTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [isGlitching, setIsGlitching] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const glitchTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)

      if (typewriter) {
        let index = 0
        const typeInterval = setInterval(() => {
          if (index <= text.length) {
            setDisplayText(text.slice(0, index))
            index++
          } else {
            clearInterval(typeInterval)
          }
        }, 60) // Légèrement plus rapide
        return () => clearInterval(typeInterval)
      } else {
        // Effet de décodage optimisé
        const chars = "▓▒░█▄▀■□●○"
        let iterations = 0
        const maxIterations = 8 // Réduit pour plus de fluidité
        const charsPerIteration = Math.ceil(text.length / maxIterations)

        const decodeInterval = setInterval(() => {
          if (iterations >= maxIterations) {
            setDisplayText(text)
            clearInterval(decodeInterval)
            return
          }

          const revealedCount = iterations * charsPerIteration
          setDisplayText(
            text
              .split("")
              .map((char, i) => {
                if (i < revealedCount) return char
                if (char === " ") return " "
                return chars[Math.floor(Math.random() * chars.length)]
              })
              .join(""),
          )
          iterations++
        }, 40) // Plus rapide

        return () => clearInterval(decodeInterval)
      }
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [text, delay, typewriter])

  // Glitch aléatoire optimisé
  useEffect(() => {
    if (!isVisible) return

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.97) {
        setIsGlitching(true)
        glitchTimeoutRef.current = setTimeout(() => setIsGlitching(false), 80)
      }
    }, 3000) // Moins fréquent

    return () => {
      clearInterval(glitchInterval)
      if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current)
    }
  }, [isVisible])

  return (
    <span
      className={cn(
        "inline-block",
        isGlitching && "translate-x-[2px] text-red-900/50",
        !isVisible && "opacity-0",
        className,
      )}
      style={{
        transition: isGlitching ? "none" : "opacity 0.3s ease-out",
        willChange: isVisible ? "auto" : "opacity",
      }}
    >
      {displayText}
      {typewriter && isVisible && displayText.length < text.length && <span className="animate-pulse">_</span>}
    </span>
  )
})

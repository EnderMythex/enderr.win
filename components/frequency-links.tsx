"use client"

import { useState, useEffect, memo, useCallback } from "react"
import { cn } from "@/lib/utils"

const links = [
  { label: "about", freq: "87.5", href: "/about" },
  { label: "projects", freq: "91.2", href: "/projects" },
  // { label: "skills", freq: "92.7", href: "/skills" },
  { label: "axiom.trade ref", freq: "94.8", href: "https://axiom.trade/@ender0x" },
  { label: "get grass ref", freq: "98.6", href: "https://grass.enderr.win" },
  { label: "discord", freq: "101.7", href: "https://discord.enderr.win" },
  { label: "status", freq: "105.3", href: "https://status.enderr.win" },
]

const LinkItem = memo(function LinkItem({
  link,
  index,
  isVisible,
  isHovered,
  onHover
}: {
  link: typeof links[0]
  index: number
  isVisible: boolean
  isHovered: boolean
  onHover: (index: number | null) => void
}) {
  return (
    <a
      href={link.href}
      target={link.href.startsWith("http") ? "_blank" : undefined}
      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-4 py-2"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
        transitionDelay: `${index * 0.1}s`,
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Indicateur de fréquence */}
      <span
        className="font-mono text-xs w-12"
        style={{
          color: isHovered ? "rgb(161 161 170)" : "rgb(39 39 42)",
          transition: "color 0.2s ease-out",
        }}
      >
        {link.freq}
      </span>

      {/* Barre de signal */}
      <div className="relative h-px w-8 bg-zinc-900 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-zinc-600"
          style={{
            width: isHovered ? "100%" : "0%",
            transition: "width 0.25s ease-out",
          }}
        />
      </div>

      {/* Label */}
      <span
        className="font-mono text-sm tracking-wide"
        style={{
          color: isHovered ? "rgb(212 212 216)" : "rgb(82 82 91)",
          transform: isHovered ? "translateX(4px)" : "translateX(0)",
          transition: "color 0.2s ease-out, transform 0.2s ease-out",
        }}
      >
        {link.label}
      </span>

      {/* Indicateur actif */}
      <span
        className="text-zinc-500 text-xs font-mono"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.2s ease-out",
        }}
      >
        ◉
      </span>
    </a>
  )
})

export const FrequencyLinks = memo(function FrequencyLinks() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1800)
    return () => clearTimeout(timer)
  }, [])

  const handleHover = useCallback((index: number | null) => {
    setHoveredIndex(index)
  }, [])

  return (
    <nav className="space-y-1">
      {links.map((link, index) => (
        <LinkItem
          key={link.label}
          link={link}
          index={index}
          isVisible={isVisible}
          isHovered={hoveredIndex === index}
          onHover={handleHover}
        />
      ))}
    </nav>
  )
})

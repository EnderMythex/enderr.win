"use client"

import { NoiseOverlay } from "@/components/noise-overlay"
import { CursorDistortion } from "@/components/cursor-distortion"
import { GlitchTrail } from "@/components/glitch-trail"
import Link from "next/link"
import { useState, useRef, useEffect, memo, useCallback } from "react"

// Images de la galerie
const galleryImages = [
    { src: "/cybercookie/screenshot1.png", alt: "CyberCookie - Main Interface" },
    { src: "/cybercookie/screenshot2.png", alt: "CyberCookie - Upgrades Menu" },
    { src: "/cybercookie/screenshot3.png", alt: "CyberCookie - Stats" },
    { src: "/cybercookie/screenshot4.png", alt: "CyberCookie - Achievements" },
    { src: "/cybercookie/screenshot5.png", alt: "CyberCookie - Settings" },
]

// Cookies flottants pour le background
const FloatingCookies = memo(function FloatingCookies() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
                <div
                    key={i}
                    className="absolute text-4xl md:text-6xl opacity-10 animate-float"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${15 + Math.random() * 10}s`,
                    }}
                >
                    🍪
                </div>
            ))}
        </div>
    )
})

// Galerie d'images swipeable
const ImageGallery = memo(function ImageGallery() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [translateX, setTranslateX] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))
    }, [])

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))
    }, [])

    const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true)
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
        setStartX(clientX)
    }, [])

    const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging) return
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
        setTranslateX(clientX - startX)
    }, [isDragging, startX])

    const handleDragEnd = useCallback(() => {
        if (!isDragging) return
        setIsDragging(false)
        if (translateX > 80) handlePrev()
        else if (translateX < -80) handleNext()
        setTranslateX(0)
    }, [isDragging, translateX, handlePrev, handleNext])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") handlePrev()
            if (e.key === "ArrowRight") handleNext()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [handlePrev, handleNext])

    return (
        <div className="relative">
            {/* Main Carousel */}
            <div
                ref={containerRef}
                className="relative overflow-hidden rounded-2xl cursor-grab active:cursor-grabbing"
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
            >
                <div
                    className="flex transition-transform duration-300 ease-out"
                    style={{
                        transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
                        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                    }}
                >
                    {galleryImages.map((image, index) => (
                        <div
                            key={index}
                            className="min-w-full aspect-video flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800/50"
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="max-w-full max-h-full object-contain select-none rounded-xl"
                                draggable={false}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = `data:image/svg+xml,${encodeURIComponent(`
                                        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="340" viewBox="0 0 600 340">
                                            <rect fill="#18181b" width="600" height="340" rx="12"/>
                                            <text fill="#52525b" font-family="monospace" font-size="16" x="50%" y="50%" text-anchor="middle" dy=".3em">
                                                [SCREENSHOT ${index + 1}]
                                            </text>
                                        </svg>
                                    `)}`
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={(e) => { e.stopPropagation(); handlePrev() }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/70 backdrop-blur-sm border border-amber-500/30 text-amber-400 hover:text-amber-300 hover:border-amber-400/50 hover:bg-black/80 transition-all duration-200 rounded-full text-xl"
                >
                    ‹
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); handleNext() }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/70 backdrop-blur-sm border border-amber-500/30 text-amber-400 hover:text-amber-300 hover:border-amber-400/50 hover:bg-black/80 transition-all duration-200 rounded-full text-xl"
                >
                    ›
                </button>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-6">
                {galleryImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index
                            ? "bg-amber-400 w-8"
                            : "bg-zinc-700 hover:bg-zinc-600"
                            }`}
                    />
                ))}
            </div>
        </div>
    )
})

export default function CyberCookiePage() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    return (
        <main className="relative min-h-screen overflow-hidden cursor-none">
            <NoiseOverlay />
            <CursorDistortion />
            <GlitchTrail />

            <style jsx global>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(10deg); }
                }
                
                @keyframes pulse-glow {
                    0%, 100% { filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.4)); }
                    50% { filter: drop-shadow(0 0 40px rgba(251, 191, 36, 0.7)); }
                }
                
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                
                .animate-float {
                    animation: float 15s ease-in-out infinite;
                }
                
                .text-gradient {
                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .bg-hero-gradient {
                    background: radial-gradient(ellipse at top, rgba(251, 191, 36, 0.15) 0%, transparent 50%),
                                radial-gradient(ellipse at bottom right, rgba(217, 119, 6, 0.1) 0%, transparent 40%),
                                linear-gradient(to bottom, #0a0a0a 0%, #000000 100%);
                }
            `}</style>

            {/* ===== HERO SECTION - Style Discord ===== */}
            <section className="relative min-h-screen flex flex-col justify-center bg-hero-gradient overflow-hidden">
                {/* Floating Cookies Background */}
                <FloatingCookies />

                {/* Background Glow Effects */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px]" />

                {/* Back Button - Fixed Position */}
                <Link
                    href="/projects"
                    className="fixed top-8 left-8 z-50 inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-amber-400 transition-colors duration-200 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-800/50"
                >
                    <span>←</span>
                    <span>BACK</span>
                </Link>

                {/* Main Hero Content */}
                <div className="relative z-10 container mx-auto px-8 md:px-16 lg:px-24 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left Side - Text Content */}
                        <div
                            className="space-y-8"
                            style={{
                                opacity: isLoaded ? 1 : 0,
                                transform: isLoaded ? "translateY(0)" : "translateY(30px)",
                                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                            }}
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">Online • Version 2.0</span>
                            </div>

                            {/* Title */}
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">
                                <span className="text-gradient">CYBER</span>
                                <br />
                                <span className="text-white">COOKIE</span>
                            </h1>

                            {/* Description */}
                            <p className="text-lg md:text-xl text-zinc-400 max-w-lg leading-relaxed">
                                A modern, <span className="text-amber-400">cyberpunk reinvention</span> of Cookie Clicker.
                                Click, upgrade, and dominate with a sleek neon aesthetic.
                            </p>

                            {/* Stats */}
                            <div className="flex gap-8 py-4">
                                <div>
                                    <div className="text-2xl font-bold text-white">⭐ 4.5</div>
                                    <div className="text-xs text-zinc-600 uppercase tracking-wider">Rating</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">1K+</div>
                                    <div className="text-xs text-zinc-600 uppercase tracking-wider">Players</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">∞</div>
                                    <div className="text-xs text-zinc-600 uppercase tracking-wider">Cookies</div>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="https://cybercookie.party/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(251,191,36,0.4)]"
                                >
                                    <span className="text-xl">🎮</span>
                                    <span>Play Now</span>
                                </a>
                                <a
                                    href="https://github.com/EnderMythex/Cyber-Cookie"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-white font-medium rounded-full transition-all duration-300"
                                >
                                    <span>◈</span>
                                    <span>View Source</span>
                                </a>
                            </div>
                        </div>

                        {/* Right Side - Hero Image/Preview */}
                        <div
                            className="relative"
                            style={{
                                opacity: isLoaded ? 1 : 0,
                                transform: isLoaded ? "translateY(0) rotate(0)" : "translateY(50px) rotate(3deg)",
                                transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
                            }}
                        >
                            {/* Floating Cookie Icon */}
                            <div
                                className="absolute -top-10 -right-10 text-8xl z-20"
                                style={{ animation: "pulse-glow 2s ease-in-out infinite, float 6s ease-in-out infinite" }}
                            >
                                🍪
                            </div>

                            {/* Main Preview Container */}
                            <div className="relative">
                                {/* Glow behind */}
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-3xl rounded-3xl" />

                                {/* Device Frame */}
                                <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-4 shadow-2xl">
                                    {/* Browser Chrome */}
                                    <div className="flex items-center gap-2 mb-4 px-2">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                        </div>
                                        <div className="flex-1 bg-zinc-800 rounded-lg px-4 py-1.5 text-xs font-mono text-zinc-500 text-center">
                                            cybercookie.party
                                        </div>
                                    </div>

                                    {/* Screenshot */}
                                    <div className="aspect-video rounded-xl overflow-hidden bg-zinc-950">
                                        <img
                                            src="/cybercookie/screenshot1.png"
                                            alt="CyberCookie Game"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).parentElement!.innerHTML = `
                                                    <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-900/20 to-orange-900/20">
                                                        <div class="text-center">
                                                            <div class="text-6xl mb-4">🍪</div>
                                                            <div class="text-zinc-500 font-mono text-sm">[GAME PREVIEW]</div>
                                                        </div>
                                                    </div>
                                                `
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute -bottom-8 -left-8 text-5xl animate-float" style={{ animationDelay: "0.5s" }}>
                                    ⚡
                                </div>
                                <div className="absolute top-1/2 -left-12 text-4xl animate-float" style={{ animationDelay: "1s" }}>
                                    🎮
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                    <span className="text-xs font-mono text-zinc-600">SCROLL</span>
                    <span className="text-zinc-600">↓</span>
                </div>
            </section>

            {/* ===== GALLERY SECTION ===== */}
            <section className="relative py-24 px-8 md:px-16 lg:px-24">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <div
                        className="text-center mb-16"
                        style={{
                            opacity: 0,
                            animation: "fadeInUp 0.6s ease-out 0.2s forwards",
                        }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Screenshots
                        </h2>
                        <p className="text-zinc-500 max-w-md mx-auto">
                            Explore the cyberpunk world of CyberCookie
                        </p>
                    </div>

                    {/* Gallery */}
                    <div
                        style={{
                            opacity: 0,
                            animation: "fadeInUp 0.6s ease-out 0.4s forwards",
                        }}
                    >
                        <ImageGallery />
                    </div>
                </div>
            </section>

            {/* ===== FEATURES SECTION ===== */}
            <section className="relative py-24 px-8 md:px-16 lg:px-24 bg-gradient-to-b from-transparent via-zinc-950/50 to-transparent">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: "🎨", title: "Cyberpunk Design", desc: "Neon-lit aesthetic with futuristic vibes" },
                            { icon: "🧩", title: "Browser Extension", desc: "Quick access from your Chrome toolbar" },
                            { icon: "🎮", title: "Web Game", desc: "Play instantly at cybercookie.party" },
                            { icon: "📊", title: "Achievements", desc: "Track stats and unlock rewards" },
                        ].map((feature, index) => (
                            <div
                                key={feature.title}
                                className="group p-6 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl hover:border-amber-500/30 hover:bg-zinc-900/50 transition-all duration-300"
                                style={{
                                    opacity: 0,
                                    animation: `fadeInUp 0.5s ease-out ${0.2 + index * 0.1}s forwards`,
                                }}
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-zinc-500">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="relative py-24 px-8 md:px-16 lg:px-24">
                <div className="max-w-4xl mx-auto text-center">
                    <div
                        className="relative p-12 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20 rounded-3xl overflow-hidden"
                        style={{
                            opacity: 0,
                            animation: "fadeInUp 0.6s ease-out 0.2s forwards",
                        }}
                    >
                        {/* Background Cookies */}
                        <div className="absolute inset-0 opacity-5">
                            {[...Array(6)].map((_, i) => (
                                <span
                                    key={i}
                                    className="absolute text-6xl"
                                    style={{
                                        left: `${20 + i * 15}%`,
                                        top: `${30 + (i % 2) * 40}%`,
                                    }}
                                >
                                    🍪
                                </span>
                            ))}
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Ready to click some cookies?
                            </h2>
                            <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
                                Join thousands of players in the ultimate cyberpunk cookie clicking experience.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <a
                                    href="https://cybercookie.party/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold rounded-full transition-all duration-300 hover:scale-105"
                                >
                                    <span>🍪</span>
                                    <span>Start Playing</span>
                                </a>
                                <a
                                    href="https://github.com/EnderMythex/Cyber-Cookie"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-zinc-600 hover:border-zinc-500 text-white rounded-full transition-all duration-300"
                                >
                                    <span>GitHub</span>
                                    <span>→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="relative py-12 px-8 md:px-16 lg:px-24 border-t border-zinc-900">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🍪</span>
                        <span className="font-mono text-zinc-500">CyberCookie by EnderMythex</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="https://cybercookie.party/" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-600 hover:text-amber-400 transition-colors">
                            Play
                        </a>
                        <a href="https://github.com/EnderMythex/Cyber-Cookie" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-600 hover:text-amber-400 transition-colors">
                            GitHub
                        </a>
                        <Link href="/about" className="text-sm text-zinc-600 hover:text-amber-400 transition-colors">
                            About Me
                        </Link>
                    </div>
                </div>
            </footer>

            {/* Live Indicator */}
            <div className="fixed top-8 right-8 z-50">
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-800/50">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono text-zinc-500">LIVE</span>
                </div>
            </div>
        </main>
    )
}

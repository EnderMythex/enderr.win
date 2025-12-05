"use client"

import { NoiseOverlay } from "@/components/noise-overlay"
import { SignalText } from "@/components/signal-text"
import { CursorDistortion } from "@/components/cursor-distortion"
import { GlitchTrail } from "@/components/glitch-trail"
import Link from "next/link"
import { useState, memo } from "react"

interface Project {
    id: string
    name: string
    description: string
    tech: string[]
    status: "online" | "offline" | "dev"
    freq: string
    website?: string
    github?: string
    internalPage?: string
}

const projects: Project[] = [
    {
        id: "001",
        name: "CyberCookie Game",
        description: "A modern, cyberpunk reinvention of Cookie Clicker available as a browser extension and web game.",
        tech: ["HTML5", "CSS3", "JS"],
        status: "online",
        freq: "108.0",
        website: "https://cybercookie.party/",
        github: "https://github.com/EnderMythex/Cyber-Cookie",
        internalPage: "/cybercookie",
    },
    {
        id: "002",
        name: "HTML & CSS Code Viewer",
        description: "An interactive HTML and CSS code editor with real-time preview and a sidebar.",
        tech: ["HTML5", "CSS3", "JS"],
        status: "online",
        freq: "92.4",
        website: "https://chromewebstore.google.com/detail/html-css-code-viewer/dgildcjamghbgngmnmegikihfcopnmlg",
        github: "https://github.com/EnderMythex/HTML-CSS-Code-Viewer",
    },
    {
        id: "003",
        name: "EnderToolsBox",
        description: "An android app with a lot of tools",
        tech: ["Kotlin"],
        status: "dev",
        freq: "76.2",
        github: "https://github.com/EnderMythex/EnderToolsBox",
    },
]

const StatusIndicator = memo(function StatusIndicator({ status }: { status: Project["status"] }) {
    const config = {
        online: { color: "bg-emerald-500", label: "ONLINE", textColor: "text-emerald-500" },
        offline: { color: "bg-zinc-600", label: "OFFLINE", textColor: "text-zinc-500" },
        dev: { color: "bg-amber-500", label: "IN DEV", textColor: "text-amber-500" },
    }

    const { color, label, textColor } = config[status]

    return (
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${color} ${status === "online" ? "animate-pulse" : ""}`} />
            <span className={`text-xs font-mono ${textColor}`}>{label}</span>
        </div>
    )
})

const ProjectCard = memo(function ProjectCard({
    project,
    index
}: {
    project: Project
    index: number
}) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="group relative border border-zinc-900 p-6 transition-all duration-300"
            style={{
                background: isHovered ? "rgba(39, 39, 42, 0.3)" : "transparent",
                opacity: 0,
                animation: `fadeInUp 0.5s ease-out ${index * 0.15}s forwards`,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-zinc-700">#{project.id}</span>
                    <span className="text-xs font-mono text-zinc-700">{project.freq} MHz</span>
                </div>
                <StatusIndicator status={project.status} />
            </div>

            {/* Title */}
            <h3
                className="text-lg font-mono text-zinc-300 mb-2 transition-colors duration-200"
                style={{ color: isHovered ? "rgb(244 244 245)" : "rgb(212 212 216)" }}
            >
                {project.name}
            </h3>

            {/* Description */}
            <p className="text-sm font-mono text-zinc-600 mb-4 leading-relaxed">
                {project.description}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech) => (
                    <span
                        key={tech}
                        className="text-xs font-mono px-2 py-1 border border-zinc-800 text-zinc-500"
                    >
                        {tech}
                    </span>
                ))}
            </div>

            {/* Links */}
            <div className="flex gap-4 mt-auto pt-4 border-t border-zinc-800/50">
                {project.internalPage && (
                    <Link
                        href={project.internalPage}
                        className="text-xs font-mono text-zinc-500 hover:text-emerald-400 transition-all duration-200 hover:translate-x-0.5"
                    >
                        [DETAILS]
                    </Link>
                )}
                {project.github && (
                    <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-zinc-500 hover:text-emerald-400 transition-all duration-200 hover:translate-x-0.5"
                    >
                        [GITHUB]
                    </a>
                )}
                {project.website && (
                    <a
                        href={project.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-zinc-500 hover:text-emerald-400 transition-all duration-200 hover:translate-x-0.5"
                    >
                        [WEBSITE]
                    </a>
                )}
            </div>

            {/* Scan line effect on hover */}
            <div
                className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent transition-all duration-300"
                style={{
                    width: isHovered ? "100%" : "0%",
                }}
            />
        </div>
    )
})

export default function ProjectsPage() {
    return (
        <main className="relative min-h-screen bg-black overflow-hidden cursor-none">
            <NoiseOverlay />
            <CursorDistortion />
            <GlitchTrail />

            <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

            <div className="relative z-10 min-h-screen px-8 md:px-16 lg:px-24 py-16">
                {/* Header */}
                <div className="mb-16">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-700 hover:text-zinc-400 transition-colors duration-200 mb-8"
                    >
                        <span>←</span>
                        <span>BACK</span>
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-xs font-mono text-zinc-700">FREQ 91.2 MHz</span>
                        <div className="h-px flex-1 bg-zinc-900" />
                    </div>

                    <SignalText
                        text="PROJECTS_"
                        className="text-3xl font-mono tracking-widest text-zinc-300"
                        delay={0.2}
                    />

                    <SignalText
                        text="[DATA TRANSMISSION IN PROGRESS...]"
                        className="text-sm font-mono text-zinc-700 mt-4"
                        delay={0.8}
                        typewriter
                    />
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-zinc-700">
                            {projects.length} PROJECTS DETECTED
                        </span>
                        <span className="text-xs font-mono text-zinc-700">
                            SIGNAL STABLE
                        </span>
                    </div>
                </div>
            </div>

            {/* Indicateur de signal */}
            <div className="fixed top-8 right-8 z-20">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-zinc-700 animate-pulse" />
                    <span className="text-xs font-mono text-zinc-700">LIVE</span>
                </div>
            </div>
        </main>
    )
}

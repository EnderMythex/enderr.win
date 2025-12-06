"use client"

import { NoiseOverlay } from "@/components/noise-overlay"
import { SignalText } from "@/components/signal-text"
import { CursorDistortion } from "@/components/cursor-distortion"
import { GlitchTrail } from "@/components/glitch-trail"
import Link from "next/link"
import { useState, memo } from "react"

interface Skill {
    name: string
    level: number // 0-100
    category: "security" | "dev" | "tools"
}

interface Platform {
    name: string
    description: string
    username?: string
    link: string
    icon: string
    stats?: string
}

const skills: Skill[] = [
    // Security
    { name: "Penetration Testing", level: 4, category: "security" },
    { name: "Web Security", level: 8, category: "security" },
    { name: "Network Analysis", level: 6, category: "security" },
    { name: "Reverse Engineering", level: 0, category: "security" },
    { name: "CTF Challenges", level: 0, category: "security" },
    // Dev
    { name: "JavaScript/TypeScript", level: 7, category: "dev" },
    { name: "Python", level: 4, category: "dev" },
    { name: "React/Next.js", level: 4, category: "dev" },
    { name: "Kotlin", level: 5, category: "dev" },
    { name: "HTML/CSS", level: 40, category: "dev" },
    // Tools
    { name: "Burp Suite", level: 12, category: "tools" },
    { name: "Nmap", level: 9, category: "tools" },
    { name: "Wireshark", level: 11, category: "tools" },
    { name: "Metasploit", level: 4, category: "tools" },
    { name: "Git", level: 46, category: "tools" },
]

const platforms: Platform[] = [
    {
        name: "Root Me",
        description: "Hacking & Security challenges platform",
        username: "EnderMythex",
        link: "https://www.root-me.org/EnderMyhtex",
        icon: "🏴",
        stats: "",
    },
    {
        name: "HackTheBox",
        description: "Penetration testing labs & challenges",
        username: "EnderMythex",
        link: "https://app.hackthebox.com/",
        icon: "📦",
        stats: "Active",
    },
    {
        name: "TryHackMe",
        description: "Learn cyber security through hands-on exercises",
        username: "EnderMythex",
        link: "https://tryhackme.com/",
        icon: "🎯",
        stats: "Learning",
    },
    {
        name: "PortSwigger Academy",
        description: "Web Security Academy - Burp Suite training",
        link: "https://portswigger.net/web-security",
        icon: "🔓",
        stats: "Web Security",
    },
]

const categoryLabels = {
    security: { label: "SECURITY", color: "text-red-500", bgColor: "bg-red-500" },
    dev: { label: "DEVELOPMENT", color: "text-emerald-500", bgColor: "bg-emerald-500" },
    tools: { label: "TOOLS", color: "text-amber-500", bgColor: "bg-amber-500" },
}

const SkillBar = memo(function SkillBar({ skill, index }: { skill: Skill; index: number }) {
    const [isHovered, setIsHovered] = useState(false)
    const { bgColor } = categoryLabels[skill.category]

    return (
        <div
            className="group"
            style={{
                opacity: 0,
                animation: `fadeInUp 0.4s ease-out ${index * 0.05}s forwards`,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center justify-between mb-1">
                <span
                    className="text-xs font-mono transition-colors duration-200"
                    style={{ color: isHovered ? "rgb(212 212 216)" : "rgb(113 113 122)" }}
                >
                    {skill.name}
                </span>
                <span className="text-xs font-mono text-zinc-600">{skill.level}%</span>
            </div>
            <div className="h-1 bg-zinc-900 overflow-hidden">
                <div
                    className={`h-full ${bgColor} transition-all duration-700 ease-out`}
                    style={{
                        width: `${skill.level}%`,
                        opacity: isHovered ? 1 : 0.6,
                    }}
                />
            </div>
        </div>
    )
})

const PlatformCard = memo(function PlatformCard({
    platform,
    index
}: {
    platform: Platform
    index: number
}) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <a
            href={platform.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative border border-zinc-900 p-5 transition-all duration-300 block"
            style={{
                background: isHovered ? "rgba(39, 39, 42, 0.3)" : "transparent",
                opacity: 0,
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-start gap-4">
                <span className="text-2xl">{platform.icon}</span>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3
                            className="text-sm font-mono transition-colors duration-200"
                            style={{ color: isHovered ? "rgb(244 244 245)" : "rgb(212 212 216)" }}
                        >
                            {platform.name}
                        </h3>
                        {platform.stats && (
                            <span className="text-xs font-mono text-zinc-600 px-2 py-0.5 border border-zinc-800">
                                {platform.stats}
                            </span>
                        )}
                    </div>
                    <p className="text-xs font-mono text-zinc-600 mb-2">
                        {platform.description}
                    </p>
                    {platform.username && (
                        <span className="text-xs font-mono text-zinc-500">
                            @{platform.username}
                        </span>
                    )}
                </div>
                <span
                    className="text-xs font-mono text-zinc-600 transition-all duration-200"
                    style={{
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? "translateX(0)" : "translateX(-4px)",
                    }}
                >
                    →
                </span>
            </div>

            {/* Scan line effect */}
            <div
                className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent transition-all duration-300"
                style={{ width: isHovered ? "100%" : "0%" }}
            />
        </a>
    )
})

export default function SkillsPage() {
    const securitySkills = skills.filter(s => s.category === "security")
    const devSkills = skills.filter(s => s.category === "dev")
    const toolsSkills = skills.filter(s => s.category === "tools")

    return (
        <main className="relative min-h-screen overflow-hidden cursor-none">
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
                        <span className="text-xs font-mono text-zinc-700">FREQ 92.7 MHz</span>
                        <div className="h-px flex-1 bg-zinc-900" />
                    </div>

                    <SignalText
                        text="SKILLS_"
                        className="text-3xl font-mono tracking-widest text-zinc-300"
                        delay={0.2}
                    />

                    <SignalText
                        text="[SCANNING CAPABILITIES...]"
                        className="text-sm font-mono text-zinc-700 mt-4"
                        delay={0.8}
                        typewriter
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Skills Section */}
                    <div className="space-y-8">
                        {/* Security Skills */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`text-xs font-mono ${categoryLabels.security.color}`}>
                                    ● {categoryLabels.security.label}
                                </span>
                                <div className="h-px flex-1 bg-zinc-900" />
                            </div>
                            <div className="space-y-3">
                                {securitySkills.map((skill, index) => (
                                    <SkillBar key={skill.name} skill={skill} index={index} />
                                ))}
                            </div>
                        </div>

                        {/* Dev Skills */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`text-xs font-mono ${categoryLabels.dev.color}`}>
                                    ● {categoryLabels.dev.label}
                                </span>
                                <div className="h-px flex-1 bg-zinc-900" />
                            </div>
                            <div className="space-y-3">
                                {devSkills.map((skill, index) => (
                                    <SkillBar key={skill.name} skill={skill} index={index + securitySkills.length} />
                                ))}
                            </div>
                        </div>

                        {/* Tools Skills */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`text-xs font-mono ${categoryLabels.tools.color}`}>
                                    ● {categoryLabels.tools.label}
                                </span>
                                <div className="h-px flex-1 bg-zinc-900" />
                            </div>
                            <div className="space-y-3">
                                {toolsSkills.map((skill, index) => (
                                    <SkillBar key={skill.name} skill={skill} index={index + securitySkills.length + devSkills.length} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Platforms Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-mono text-zinc-500">● PLATFORMS</span>
                            <div className="h-px flex-1 bg-zinc-900" />
                        </div>
                        <div className="space-y-4">
                            {platforms.map((platform, index) => (
                                <PlatformCard key={platform.name} platform={platform} index={index} />
                            ))}
                        </div>

                        {/* CTF Stats */}
                        <div className="mt-8 p-4 border border-zinc-900">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-mono text-zinc-500">◉ CTF ACTIVITY</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-2xl font-mono text-zinc-300">10</span>
                                    <p className="text-xs font-mono text-zinc-600">Challenges Solved</p>
                                </div>
                                <div>
                                    <span className="text-2xl font-mono text-zinc-300">90</span>
                                    <p className="text-xs font-mono text-zinc-600">Points Earned</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-zinc-700">
                            {skills.length} SKILLS INDEXED
                        </span>
                        <span className="text-xs font-mono text-zinc-700">
                            SIGNAL STABLE
                        </span>
                    </div>
                </div>
            </div>

            {/* Live Indicator */}
            <div className="fixed top-8 right-8 z-20">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-zinc-700 animate-pulse" />
                    <span className="text-xs font-mono text-zinc-700">LIVE</span>
                </div>
            </div>
        </main>
    )
}

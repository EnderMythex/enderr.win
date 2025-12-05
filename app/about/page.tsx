"use client"

import { NoiseOverlay } from "@/components/noise-overlay"
import { SignalText } from "@/components/signal-text"
import { CursorDistortion } from "@/components/cursor-distortion"
import { GlitchTrail } from "@/components/glitch-trail"
import Link from "next/link"
import { useState, useEffect, memo } from "react"

// Ton Discord User ID (à remplacer par ton vrai ID)
const DISCORD_USER_ID = "1006197798577909880"

interface LanyardData {
    discord_user: {
        id: string
        username: string
        avatar: string
        discriminator: string
        global_name: string
        display_name?: string
        clan?: {
            tag: string
            identity_guild_id: string
            identity_enabled: boolean
            badge: string
        }
    }
    discord_status: "online" | "idle" | "dnd" | "offline"
    activities: Array<{
        name: string
        type: number
        state?: string
        details?: string
        emoji?: {
            name: string
            id?: string
            animated?: boolean
        }
        timestamps?: {
            start?: number
            end?: number
        }
        assets?: {
            large_image?: string
            large_text?: string
            small_image?: string
            small_text?: string
        }
        application_id?: string
    }>
    listening_to_spotify: boolean
    spotify?: {
        track_id: string
        song: string
        artist: string
        album: string
        album_art_url: string
        timestamps: {
            start: number
            end: number
        }
    }
}

interface SocialLink {
    name: string
    username: string
    url: string
    icon: string
    color: string
}

const socialLinks: SocialLink[] = [
    {
        name: "GitHub",
        username: "EnderMythex",
        url: "https://github.com/EnderMythex",
        icon: "◈",
        color: "hover:text-zinc-300",
    },
    {
        name: "Twitter / X",
        username: "@Endermythex7",
        url: "https://x.com/Endermythex7",
        icon: "✕",
        color: "hover:text-zinc-300",
    },
    {
        name: "Discord",
        username: "EnderMythex",
        url: "https://discord.enderr.win",
        icon: "◉",
        color: "hover:text-indigo-400",
    },
]

const statusConfig = {
    online: { color: "bg-emerald-500", label: "ONLINE", textColor: "text-emerald-500" },
    idle: { color: "bg-amber-500", label: "IDLE", textColor: "text-amber-500" },
    dnd: { color: "bg-red-500", label: "DO NOT DISTURB", textColor: "text-red-500" },
    offline: { color: "bg-zinc-600", label: "OFFLINE", textColor: "text-zinc-500" },
}

interface DiscordProfile {
    banner: string | null
    banner_color: string | null
    clan?: {
        tag: string
        badge: string
    }
}

const DiscordPresence = memo(function DiscordPresence() {
    const [data, setData] = useState<LanyardData | null>(null)
    const [profile, setProfile] = useState<DiscordProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)

    // Fetch profile data (banner, clan) via dcdn proxy
    useEffect(() => {
        fetch(`https://dcdn.dstn.to/profile/${DISCORD_USER_ID}`)
            .then(res => res.json())
            .then(data => {
                setProfile({
                    banner: data.user?.banner || null,
                    banner_color: data.user?.banner_color || null,
                    clan: data.user?.clan || null,
                })
            })
            .catch(() => {
                // Fallback - pas de bannière
            })
    }, [])

    useEffect(() => {
        // WebSocket connection to Lanyard for real-time updates
        const ws = new WebSocket("wss://api.lanyard.rest/socket")

        ws.onopen = () => {
            ws.send(JSON.stringify({
                op: 2,
                d: {
                    subscribe_to_id: DISCORD_USER_ID
                }
            }))
        }

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data)

            if (message.op === 1) {
                // Heartbeat interval
                setInterval(() => {
                    ws.send(JSON.stringify({ op: 3 }))
                }, message.d.heartbeat_interval)
            }

            if (message.op === 0 && message.d) {
                setData(message.d)
                setIsLoading(false)
            }
        }

        ws.onerror = () => {
            setError(true)
            setIsLoading(false)
        }

        return () => ws.close()
    }, [])

    const status = data?.discord_status || "offline"
    const { color, label, textColor } = statusConfig[status]
    const activity = data?.activities?.find(a => a.type === 0) // Playing
    const customStatus = data?.activities?.find(a => a.type === 4) // Custom Status
    const spotify = data?.spotify

    if (error) {
        return (
            <div className="border border-zinc-900 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-mono text-zinc-700">◉ DISCORD STATUS</span>
                    <div className="h-px flex-1 bg-zinc-900" />
                </div>
                <p className="text-xs font-mono text-zinc-600">
                    [CONNECTION FAILED - RETRY LATER]
                </p>
            </div>
        )
    }

    return (
        <div className="border border-zinc-900 overflow-hidden">
            {/* Banner */}
            <div className="relative h-24 bg-zinc-900">
                {profile?.banner ? (
                    <img
                        src={`https://cdn.discordapp.com/banners/${DISCORD_USER_ID}/${profile.banner}.${profile.banner.startsWith('a_') ? 'gif' : 'png'}?size=480`}
                        alt="Discord Banner"
                        className="w-full h-full object-cover"
                    />
                ) : profile?.banner_color ? (
                    <div className="w-full h-full" style={{ backgroundColor: profile.banner_color }} />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900" />
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            <div className="p-6 -mt-8 relative">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-xs font-mono text-zinc-700">◉ DISCORD PRESENCE</span>
                    <div className="h-px flex-1 bg-zinc-900" />
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${color} ${status === "online" ? "animate-pulse" : ""}`} />
                        <span className={`text-xs font-mono ${textColor}`}>{label}</span>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-zinc-900 animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-zinc-900 animate-pulse rounded" />
                            <div className="h-3 w-24 bg-zinc-900 animate-pulse rounded" />
                        </div>
                    </div>
                ) : data ? (
                    <div className="space-y-6">
                        {/* Profile */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img
                                    src={`https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=128`}
                                    alt="Discord Avatar"
                                    className="w-16 h-16 rounded-full border border-zinc-800"
                                />
                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${color} border-2 border-black`} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-lg font-mono text-zinc-300">
                                        {data.discord_user.global_name || data.discord_user.display_name || data.discord_user.username}
                                    </h3>
                                    {(profile?.clan || data.discord_user.clan) && (
                                        <span className="text-xs font-mono px-2 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded flex items-center gap-1">
                                            <span>⚔</span>
                                            <span>{profile?.clan?.tag || data.discord_user.clan?.tag}</span>
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs font-mono text-zinc-600">
                                    @{data.discord_user.username}
                                </p>
                            </div>
                        </div>

                        {/* Custom Status */}
                        {customStatus && (customStatus.state || customStatus.emoji) && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded">
                                {customStatus.emoji && (
                                    <span className="text-base">
                                        {customStatus.emoji.id ? (
                                            <img
                                                src={`https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? 'gif' : 'png'}?size=20`}
                                                alt={customStatus.emoji.name}
                                                className="w-5 h-5 inline"
                                            />
                                        ) : (
                                            customStatus.emoji.name
                                        )}
                                    </span>
                                )}
                                {customStatus.state && (
                                    <span className="text-xs font-mono text-zinc-400">
                                        {customStatus.state}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Activity */}
                        {activity && (
                            <div className="p-4 bg-zinc-900/30 border border-zinc-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-mono text-zinc-500">▶ PLAYING</span>
                                </div>
                                <p className="text-sm font-mono text-zinc-300">{activity.name}</p>
                                {activity.details && (
                                    <p className="text-xs font-mono text-zinc-500 mt-1">{activity.details}</p>
                                )}
                                {activity.state && (
                                    <p className="text-xs font-mono text-zinc-600 mt-1">{activity.state}</p>
                                )}
                            </div>
                        )}

                        {/* Spotify */}
                        {spotify && (
                            <div className="p-4 bg-zinc-900/30 border border-zinc-800">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs font-mono text-emerald-500">♫ LISTENING TO SPOTIFY</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={spotify.album_art_url}
                                        alt={spotify.album}
                                        className="w-12 h-12 border border-zinc-800"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-mono text-zinc-300 truncate">{spotify.song}</p>
                                        <p className="text-xs font-mono text-zinc-500 truncate">by {spotify.artist}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!activity && !spotify && status !== "offline" && (
                            <p className="text-xs font-mono text-zinc-600">
                                [NO CURRENT ACTIVITY]
                            </p>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    )
})

const SocialCard = memo(function SocialCard({
    social,
    index
}: {
    social: SocialLink
    index: number
}) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative border border-zinc-900 p-4 transition-all duration-300 block"
            style={{
                background: isHovered ? "rgba(39, 39, 42, 0.3)" : "transparent",
                opacity: 0,
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center gap-4">
                <span className="text-xl font-mono text-zinc-600">{social.icon}</span>
                <div className="flex-1">
                    <h3
                        className={`text-sm font-mono transition-colors duration-200 ${social.color}`}
                        style={{ color: isHovered ? undefined : "rgb(161 161 170)" }}
                    >
                        {social.name}
                    </h3>
                    <p className="text-xs font-mono text-zinc-600">{social.username}</p>
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

            {/* Scan line */}
            <div
                className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent transition-all duration-300"
                style={{ width: isHovered ? "100%" : "0%" }}
            />
        </a>
    )
})

export default function AboutPage() {
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
                        <span className="text-xs font-mono text-zinc-700">FREQ 87.5 MHz</span>
                        <div className="h-px flex-1 bg-zinc-900" />
                    </div>

                    <SignalText
                        text="ABOUT_"
                        className="text-3xl font-mono tracking-widest text-zinc-300"
                        delay={0.2}
                    />

                    <SignalText
                        text="[IDENTITY VERIFICATION IN PROGRESS...]"
                        className="text-sm font-mono text-zinc-700 mt-4"
                        delay={0.8}
                        typewriter
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column - Bio */}
                    <div className="space-y-8">
                        {/* Bio Section */}
                        <div
                            className="border border-zinc-900 p-6"
                            style={{
                                opacity: 0,
                                animation: "fadeInUp 0.5s ease-out 0.2s forwards",
                            }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-xs font-mono text-zinc-700">◉ IDENTITY</span>
                                <div className="h-px flex-1 bg-zinc-900" />
                            </div>

                            <h2 className="text-2xl font-mono text-zinc-300 mb-4">EnderMythex</h2>

                            <div className="space-y-4 text-sm font-mono text-zinc-500 leading-relaxed">
                                <p>
                                    Hi, I just make random projects
                                </p>

                            </div>

                            <div className="mt-6 pt-6 border-t border-zinc-900">
                                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                                    <div>
                                        <span className="text-zinc-700">LOCATION</span>
                                        <p className="text-zinc-500 mt-1">France 🇫🇷</p>
                                    </div>
                                    <div>
                                        <span className="text-zinc-700">FOCUS</span>
                                        <p className="text-zinc-500 mt-1">Trading & Dev</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-xs font-mono text-zinc-700">◉ CONNECTIONS</span>
                                <div className="h-px flex-1 bg-zinc-900" />
                            </div>
                            <div className="space-y-3">
                                {socialLinks.map((social, index) => (
                                    <SocialCard key={social.name} social={social} index={index} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Discord */}
                    <div
                        style={{
                            opacity: 0,
                            animation: "fadeInUp 0.5s ease-out 0.3s forwards",
                        }}
                    >
                        <DiscordPresence />
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-zinc-700">
                            IDENTITY VERIFIED
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

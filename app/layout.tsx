import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { Space_Mono, Plus_Jakarta_Sans as V0_Font_Plus_Jakarta_Sans, IBM_Plex_Mono as V0_Font_IBM_Plex_Mono, Lora as V0_Font_Lora } from 'next/font/google'

// Initialize fonts
const _plusJakartaSans = V0_Font_Plus_Jakarta_Sans({ subsets: ['latin'], weight: ["200", "300", "400", "500", "600", "700", "800"] })
const _ibmPlexMono = V0_Font_IBM_Plex_Mono({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700"] })
const _lora = V0_Font_Lora({ subsets: ['latin'], weight: ["400", "500", "600", "700"] })

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Enderr | Home",
  description: "enderr.win",
  openGraph: {
    images: [{
      url: 'https://enderr.win/bg.png',
      width: 1200,
      height: 630,
      alt: 'enderr.win',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enderr | Home',
    description: 'enderr.win',
    images: ['https://enderr.win/bg.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${spaceMono.variable} font-mono antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

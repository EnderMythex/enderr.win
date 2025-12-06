import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Enderr | CyberCookie",
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
        title: 'Enderr | CyberCookie',
        description: 'enderr.win',
        images: ['https://enderr.win/bg.png'],
    },
}

export default function CyberCookieLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}

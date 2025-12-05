import { NoiseOverlay } from "@/components/noise-overlay"
import { SignalText } from "@/components/signal-text"
import { FrequencyLinks } from "@/components/frequency-links"
import { Coordinates } from "@/components/coordinates"
import { CursorDistortion } from "@/components/cursor-distortion"
import { GlitchTrail } from "@/components/glitch-trail"

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden cursor-none">
      <NoiseOverlay />
      <CursorDistortion />
      <GlitchTrail />

      <div className="relative z-10 min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-md">
          {/* Coordonnées de transmission */}
          <Coordinates />

          {/* Identité */}
          <div className="mt-12 mb-8">
            <SignalText text="EnderMythex." className="text-2xl font-mono tracking-widest text-zinc-300" delay={0.5} />
          </div>

          {/* Phrase signature - effet machine à écrire */}
          <div className="mb-12">
            <SignalText
              text="[DATA RECEIVED SUCCESSFULLY FROM 10.0.5.45]"
              className="text-sm font-mono text-zinc-600 tracking-wide"
              delay={1.2}
              typewriter
            />
          </div>

          {/* Navigation par fréquences */}
          <FrequencyLinks />

          {/* Footer minimal */}
          <div className="mt-16 pt-8 border-t border-zinc-900">
            <SignalText text="© enderr.win 2025" className="text-xs font-mono text-zinc-700" delay={3} />
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

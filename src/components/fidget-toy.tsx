"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Maximize2, Minimize2 } from "lucide-react"

interface FidgetToyProps {
  soundEnabled: boolean
}

export function FidgetToy({ soundEnabled }: FidgetToyProps) {
  const [expanded, setExpanded] = useState(false)
  const [activeToy, setActiveToy] = useState<"bubbles" | "spinner" | "dots">("bubbles")
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string }>>([])
  const [spinnerSpeed, setSpinnerSpeed] = useState(1)
  const [dots, setDots] = useState<Array<{ id: number; x: number; y: number; color: string }>>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle bubbles animation
  useEffect(() => {
    if (activeToy !== "bubbles") return

    const interval = setInterval(() => {
      setBubbles((prev) =>
        prev
          .map((bubble) => ({
            ...bubble,
            y: bubble.y - 1,
            size: bubble.size * 0.98,
          }))
          .filter((bubble) => bubble.size > 0.5),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [activeToy])

  // Handle dots fading
  useEffect(() => {
    if (activeToy !== "dots") return

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length > 50) {
          return prev.slice(1)
        }
        return prev
      })
    }, 100)

    return () => clearInterval(interval)
  }, [activeToy])

  const addBubble = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || activeToy !== "bubbles") return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const colors = [
      "rgba(239, 68, 68, 0.7)", // red
      "rgba(249, 115, 22, 0.7)", // orange
      "rgba(234, 179, 8, 0.7)", // yellow
      "rgba(34, 197, 94, 0.7)", // green
      "rgba(59, 130, 246, 0.7)", // blue
      "rgba(168, 85, 247, 0.7)", // purple
      "rgba(236, 72, 153, 0.7)", // pink
    ]

    const newBubble = {
      id: Date.now(),
      x,
      y,
      size: Math.random() * 20 + 10,
      color: colors[Math.floor(Math.random() * colors.length)],
    }

    setBubbles((prev) => [...prev, newBubble])

    if (soundEnabled) {
      const popSound = new Audio("/sounds/pop.mp3")
      popSound.volume = 0.2
      popSound.play()
    }
  }

  const handleSpinnerClick = () => {
    setSpinnerSpeed((prev) => Math.min(prev + 0.5, 5))

    if (soundEnabled) {
      const clickSound = new Audio("/sounds/click.mp3")
      clickSound.volume = 0.2
      clickSound.play()
    }
  }

  const addDot = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || activeToy !== "dots") return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const colors = [
      "#ef4444", // red
      "#f97316", // orange
      "#eab308", // yellow
      "#22c55e", // green
      "#3b82f6", // blue
      "#a855f7", // purple
      "#ec4899", // pink
    ]

    const newDot = {
      id: Date.now(),
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
    }

    setDots((prev) => [...prev, newDot])

    if (soundEnabled) {
      const tapSound = new Audio("/sounds/tap.mp3")
      tapSound.volume = 0.1
      tapSound.play()
    }
  }

  const resetToy = () => {
    setBubbles([])
    setSpinnerSpeed(1)
    setDots([])

    if (soundEnabled) {
      const resetSound = new Audio("/sounds/switch.mp3")
      resetSound.volume = 0.3
      resetSound.play()
    }
  }

  return (
    <div className="p-4 rounded-lg border border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-pink-500" />
          Fidget Zone
        </h3>

        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpanded(!expanded)}>
          {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      {!expanded ? (
        <p className="text-sm text-muted-foreground mb-2">
          Need a quick fidget break? Expand to play with interactive toys.
        </p>
      ) : (
        <>
          <div className="flex gap-2 mb-3">
            <Button
              variant={activeToy === "bubbles" ? "default" : "outline"}
              size="sm"
              className={activeToy === "bubbles" ? "bg-pink-600 hover:bg-pink-700" : ""}
              onClick={() => setActiveToy("bubbles")}
            >
              Bubbles
            </Button>

            <Button
              variant={activeToy === "spinner" ? "default" : "outline"}
              size="sm"
              className={activeToy === "spinner" ? "bg-pink-600 hover:bg-pink-700" : ""}
              onClick={() => setActiveToy("spinner")}
            >
              Spinner
            </Button>

            <Button
              variant={activeToy === "dots" ? "default" : "outline"}
              size="sm"
              className={activeToy === "dots" ? "bg-pink-600 hover:bg-pink-700" : ""}
              onClick={() => setActiveToy("dots")}
            >
              Dots
            </Button>
          </div>

          <div
            ref={containerRef}
            className="relative h-[200px] bg-white dark:bg-gray-800 rounded-lg border border-pink-200 dark:border-pink-800 overflow-hidden mb-2"
            onClick={activeToy === "bubbles" ? addBubble : activeToy === "dots" ? addDot : handleSpinnerClick}
          >
            {activeToy === "bubbles" && (
              <>
                {bubbles.map((bubble) => (
                  <div
                    key={bubble.id}
                    className="absolute rounded-full"
                    style={{
                      left: `${bubble.x}%`,
                      top: `${bubble.y}%`,
                      width: `${bubble.size}px`,
                      height: `${bubble.size}px`,
                      backgroundColor: bubble.color,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                  {bubbles.length === 0 && "Click to create bubbles"}
                </div>
              </>
            )}

            {activeToy === "spinner" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 cursor-pointer"
                  style={{
                    animation: `spin ${6 / spinnerSpeed}s linear infinite`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800"></div>
                  </div>
                </div>
                <style jsx>{`
                  @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            )}

            {activeToy === "dots" && (
              <>
                {dots.map((dot) => (
                  <div
                    key={dot.id}
                    className="absolute w-4 h-4 rounded-full"
                    style={{
                      left: `${dot.x}%`,
                      top: `${dot.y}%`,
                      backgroundColor: dot.color,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                  {dots.length === 0 && "Click to create dots"}
                </div>
              </>
            )}
          </div>

          <Button variant="outline" size="sm" className="w-full" onClick={resetToy}>
            Reset
          </Button>
        </>
      )}
    </div>
  )
}


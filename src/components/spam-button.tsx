"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpamButtonProps {
  enabled: boolean
}

export function SpamButton({ enabled }: SpamButtonProps) {
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [buttonText, setButtonText] = useState("Click me repeatedly!")
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; color: string; angle: number; speed: number }>
  >([])

  // Update button text based on count
  useEffect(() => {
    if (count >= 100) {
      setButtonText("YOU'RE UNSTOPPABLE!!! 🤯")
    } else if (count >= 50) {
      setButtonText("KEEP GOING!!! 🔥🔥🔥")
    } else if (count >= 25) {
      setButtonText("THAT'S IT!!! 🔥🔥")
    } else if (count >= 10) {
      setButtonText("MORE!!! 🔥")
    } else if (count >= 5) {
      setButtonText("FASTER!!!")
    } else if (count >= 1) {
      setButtonText("AGAIN!!!")
    }
  }, [count])

  // Handle particles animation
  useEffect(() => {
    if (particles.length === 0) return

    const interval = setInterval(() => {
      setParticles((prevParticles) =>
        prevParticles
          .map((p) => ({
            ...p,
            x: p.x + Math.cos(p.angle) * p.speed,
            y: p.y + Math.sin(p.angle) * p.speed,
            size: p.size * 0.95,
          }))
          .filter((p) => p.size > 0.5),
      )
    }, 16)

    return () => clearInterval(interval)
  }, [particles])

  const handleClick = () => {
    // Increment counter
    setCount((prev) => prev + 1)

    // Play sound if enabled
    if (enabled) {
      const sounds = ["/sounds/pop.mp3", "/sounds/click.mp3", "/sounds/boing.mp3"]
      const randomSound = new Audio(sounds[Math.floor(Math.random() * sounds.length)])
      randomSound.volume = 0.3
      randomSound.play()
    }

    // Animate button
    setIsAnimating(true)
    setScale(0.9)
    setRotation(Math.random() * 10 - 5)

    setTimeout(() => {
      setScale(1.1)
      setTimeout(() => {
        setScale(1)
        setRotation(0)
        setIsAnimating(false)
      }, 100)
    }, 100)

    // Create particles
    const newParticles = []
    const colors = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"]

    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: 50,
        y: 50,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 3 + 1,
      })
    }

    setParticles((prev) => [...prev, ...newParticles])

    // Special effects for milestones
    if (count + 1 === 10 || count + 1 === 25 || count + 1 === 50 || count + 1 === 100) {
      if (enabled) {
        const celebrationSound = new Audio("/sounds/celebration.mp3")
        celebrationSound.volume = 0.5
        celebrationSound.play()
      }
    }
  }

  return (
    <div className="relative w-full h-24 flex items-center justify-center">
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      <Button
        onClick={handleClick}
        className={cn(
          "relative px-6 py-3 font-bold text-white transition-all duration-200 overflow-hidden",
          "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700",
          "border-2 border-white/20 shadow-lg",
        )}
        style={{
          transform: `scale(${scale}) rotate(${rotation}deg)`,
        }}
      >
        <Sparkles className={cn("absolute inset-0 w-full h-full opacity-30", isAnimating ? "animate-ping" : "")} />
        <span className="relative z-10">{buttonText}</span>
        {count > 0 && (
          <span className="absolute top-0 right-0 bg-white text-purple-600 rounded-full text-xs font-bold h-6 w-6 flex items-center justify-center transform translate-x-1/4 -translate-y-1/4">
            {count}
          </span>
        )}
      </Button>
    </div>
  )
}


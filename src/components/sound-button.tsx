"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SoundButtonProps {
  icon: React.ReactNode
  label: string
  soundPath: string
  enabled: boolean
  className?: string
}

export function SoundButton({ icon, label, soundPath, enabled, className }: SoundButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    if (enabled) {
      const sound = new Audio(soundPath)
      sound.volume = 0.5
      sound.play()
    }

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 700)
  }

  return (
    <Button
      onClick={handleClick}
      className={cn("text-white font-medium relative overflow-hidden", isAnimating ? "animate-pulse" : "", className)}
    >
      <span
        className={cn(
          "absolute inset-0 bg-white/20 transform scale-0 rounded-full",
          isAnimating ? "animate-ripple" : "",
        )}
      />
      <span className="mr-2">{icon}</span>
      {label}
    </Button>
  )
}


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, UserPlus, UserMinus, MessageSquare, Video, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface BodyDoublingProps {
  soundEnabled: boolean
}

export function BodyDoubling({ soundEnabled }: BodyDoublingProps) {
  const [isActive, setIsActive] = useState(false)
  const [companions, setCompanions] = useState<string[]>([])

  const toggleActive = () => {
    if (!isActive) {
      // Generate random companions when activating
      const possibleCompanions = [
        "Alex",
        "Jordan",
        "Taylor",
        "Morgan",
        "Casey",
        "Riley",
        "Quinn",
        "Avery",
        "Sam",
        "Jamie",
      ]

      // Randomly select 1-3 companions
      const numCompanions = Math.floor(Math.random() * 3) + 1
      const selectedCompanions = []

      for (let i = 0; i < numCompanions; i++) {
        const randomIndex = Math.floor(Math.random() * possibleCompanions.length)
        selectedCompanions.push(possibleCompanions[randomIndex])
        possibleCompanions.splice(randomIndex, 1)
      }

      setCompanions(selectedCompanions)

      if (soundEnabled) {
        const joinSound = new Audio("/sounds/join.mp3")
        joinSound.volume = 0.5
        joinSound.play()
      }
    } else {
      if (soundEnabled) {
        const leaveSound = new Audio("/sounds/leave.mp3")
        leaveSound.volume = 0.5
        leaveSound.play()
      }

      setCompanions([])
    }

    setIsActive(!isActive)
  }

  const getRandomActivity = () => {
    const activities = ["studying", "working", "cleaning", "writing", "coding", "reading", "organizing"]
    return activities[Math.floor(Math.random() * activities.length)]
  }

  const getRandomTime = () => {
    const hours = Math.floor(Math.random() * 2) + 1
    const minutes = Math.floor(Math.random() * 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-colors",
        isActive
          ? "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800"
          : "bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700",
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className={cn("h-5 w-5", isActive ? "text-purple-500" : "text-gray-500")} />
          Body Doubling
        </h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Work alongside virtual companions to stay focused and motivated.
      </p>

      {isActive && companions.length > 0 && (
        <div className="mb-4 space-y-3">
          {companions.map((companion, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900"
            >
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={`/avatars/avatar${index + 1}.jpg`} />
                  <AvatarFallback>{companion.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{companion}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    {getRandomActivity()}
                  </div>
                </div>
              </div>
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <Clock className="h-3 w-3" />
                {getRandomTime()}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant={isActive ? "destructive" : "default"}
          className={cn(
            "flex-1 flex items-center justify-center gap-2",
            !isActive && "bg-purple-600 hover:bg-purple-700",
          )}
          onClick={toggleActive}
        >
          {isActive ? (
            <>
              <UserMinus className="h-4 w-4" />
              Leave Session
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Join Session
            </>
          )}
        </Button>

        {isActive && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
              disabled
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
              disabled
            >
              <Video className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {isActive && (
        <div className="mt-3 text-center text-xs text-purple-600 dark:text-purple-400">
          You're not alone! Keep working on your tasks.
        </div>
      )}
    </div>
  )
}


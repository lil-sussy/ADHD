"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Clock, Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"

interface CleaningTimerProps {
  defaultMinutes?: number
  soundEnabled: boolean
}

export function CleaningTimer({ defaultMinutes = 15, soundEnabled }: CleaningTimerProps) {
  const [timeLeft, setTimeLeft] = useState(defaultMinutes * 60)
  const [totalTime, setTotalTime] = useState(defaultMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [timerSound, setTimerSound] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const alarmSound = useRef<HTMLAudioElement | null>(null)
  const tickSound = useRef<HTMLAudioElement | null>(null)

  // Initialize audio elements
  useEffect(() => {
    alarmSound.current = new Audio("/sounds/timer-complete.mp3")
    alarmSound.current.volume = 0.5

    tickSound.current = new Audio("/sounds/tick.mp3")
    tickSound.current.volume = 0.2

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            setIsRunning(false)
            setIsCompleted(true)

            // Play alarm sound when timer completes
            if (soundEnabled && timerSound && alarmSound.current) {
              alarmSound.current.play()
            }

            return 0
          }

          // Play tick sound every 15 seconds
          if (prev % 15 === 0 && soundEnabled && timerSound && tickSound.current) {
            tickSound.current.play()
          }

          return prev - 1
        })
      }, 1000)
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, soundEnabled, timerSound])

  const startTimer = () => {
    if (timeLeft === 0) {
      resetTimer()
    }
    setIsRunning(true)
    setIsCompleted(false)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(totalTime)
    setIsCompleted(false)
  }

  const adjustTime = (minutes: number) => {
    const newTotalSeconds = minutes * 60
    setTotalTime(newTotalSeconds)
    setTimeLeft(newTotalSeconds)
    setIsCompleted(false)
  }

  const toggleSound = () => {
    setTimerSound(!timerSound)
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const progressPercentage = ((totalTime - timeLeft) / totalTime) * 100

  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-colors",
        isCompleted
          ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 animate-pulse"
          : isRunning
            ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
            : "bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700",
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Clock
            className={cn("h-5 w-5", isCompleted ? "text-green-500" : isRunning ? "text-blue-500" : "text-gray-500")}
          />
          Cleaning Room Timer
        </h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleSound}>
          {timerSound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </div>

      <div className="text-center mb-2">
        <span
          className={cn(
            "text-3xl font-bold",
            isCompleted
              ? "text-green-600 dark:text-green-400"
              : isRunning
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300",
          )}
        >
          {formatTime(timeLeft)}
        </span>
      </div>

      <Progress
        value={progressPercentage}
        className="h-2 mb-4"
        indicatorClassName={cn(isCompleted ? "bg-green-500" : isRunning ? "bg-blue-500" : "bg-gray-500")}
      />

      <div className="flex justify-between gap-2 mb-4">
        {isRunning ? (
          <Button variant="outline" className="flex-1 flex items-center justify-center gap-2" onClick={pauseTimer}>
            <Pause className="h-4 w-4" />
            Pause
          </Button>
        ) : (
          <Button variant="outline" className="flex-1 flex items-center justify-center gap-2" onClick={startTimer}>
            <Play className="h-4 w-4" />
            {timeLeft === 0 ? "Restart" : "Start"}
          </Button>
        )}

        <Button variant="outline" className="flex items-center justify-center gap-2" onClick={resetTimer}>
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>5m</span>
          <span>15m</span>
          <span>30m</span>
        </div>
        <Slider
          defaultValue={[defaultMinutes]}
          min={5}
          max={30}
          step={5}
          onValueChange={(value) => adjustTime(value[0])}
          disabled={isRunning}
        />
      </div>

      {isCompleted && (
        <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded text-center text-green-800 dark:text-green-300 font-medium">
          Time's up! Your room should be cleaner now! 🎉
        </div>
      )}
    </div>
  )
}


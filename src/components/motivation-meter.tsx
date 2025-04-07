"use client"

import { Trophy } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface MotivationMeterProps {
  value: number
}

export function MotivationMeter({ value }: MotivationMeterProps) {
  // Cap the value at 10 for display purposes
  const displayValue = Math.min(value, 10)
  const percentage = (displayValue / 10) * 100

  const getColor = () => {
    if (percentage < 30) return "bg-red-500"
    if (percentage < 70) return "bg-amber-500"
    return "bg-emerald-500"
  }

  return (
    <div className="flex flex-col items-center gap-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 rounded-lg shadow-md border border-violet-100 dark:border-violet-900 min-w-[180px]">
      <div className="flex items-center gap-2 mb-1">
        <Trophy className="h-5 w-5 text-amber-500" />
        <span className="font-medium">Today's Progress</span>
      </div>
      <div className="w-full flex items-center gap-2">
        <Progress value={percentage} className="h-3" indicatorClassName={cn(getColor())} />
        <span className="text-sm font-bold min-w-[24px]">{value}</span>
      </div>
    </div>
  )
}


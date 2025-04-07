"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Task } from "@/types/todo"
import { formatDistanceToNow, format } from "date-fns"
import { Clock, GripVertical, Calendar, Tag, Flag, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface TaskCardProps {
  task: Task
  onClick: () => void
  onAdjustTime: (taskId: string, minutes: number) => void
  isDragging?: boolean
  isCollapsed?: boolean
  onToggleCollapse: () => void
}

export function TaskCard({
  task,
  onClick,
  onAdjustTime,
  isDragging = false,
  isCollapsed = false,
  onToggleCollapse,
}: TaskCardProps) {
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
    }
  }

  const timeAdjustments = [
    {
      label: "-6h",
      minutes: -360,
      class: "bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-800/50 dark:text-red-300",
    },
    {
      label: "-1h30",
      minutes: -90,
      class:
        "bg-orange-100 hover:bg-orange-200 text-orange-700 dark:bg-orange-900/30 dark:hover:bg-orange-800/50 dark:text-orange-300",
    },
    {
      label: "-15m",
      minutes: -15,
      class:
        "bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-900/30 dark:hover:bg-amber-800/50 dark:text-amber-300",
    },
    {
      label: "+15m",
      minutes: 15,
      class:
        "bg-lime-100 hover:bg-lime-200 text-lime-700 dark:bg-lime-900/30 dark:hover:bg-lime-800/50 dark:text-lime-300",
    },
    {
      label: "+1h30",
      minutes: 90,
      class:
        "bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:hover:bg-emerald-800/50 dark:text-emerald-300",
    },
    {
      label: "+6h",
      minutes: 360,
      class:
        "bg-cyan-100 hover:bg-cyan-200 text-cyan-700 dark:bg-cyan-900/30 dark:hover:bg-cyan-800/50 dark:text-cyan-300",
    },
  ]

  const dayAdjustments = [
    {
      label: "-1d",
      minutes: -1440,
      class:
        "bg-violet-100 hover:bg-violet-200 text-violet-700 dark:bg-violet-900/30 dark:hover:bg-violet-800/50 dark:text-violet-300",
    },
    {
      label: "+1d",
      minutes: 1440,
      class:
        "bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/50 dark:text-purple-300",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 dark:text-red-400"
      case "medium":
        return "text-amber-600 dark:text-amber-400"
      case "low":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  return (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-0",
        "bg-white dark:bg-gray-800",
        "hover:translate-y-[-2px]",
        isDragging ? "shadow-xl rotate-1 relative" : "",
      )}
    >
      <div className={cn("h-2", task.color || "bg-gradient-to-r from-violet-500 to-fuchsia-500")} />
      <CardContent className="p-4">
        <div className="flex items-start mb-2">
          <div className="flex-grow" onClick={onClick}>
            <h3 className="font-semibold text-lg mb-1 break-words">{task.title}</h3>
            {!isCollapsed && task.description && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation()
                onToggleCollapse()
              }}
            >
              {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            <div className="text-muted-foreground flex items-center">
              <GripVertical className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-full">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{formatTime(task.estimatedTime)}</span>
          </div>

          {task.priority && (
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-full">
              <Flag className={`h-4 w-4 ${getPriorityColor(task.priority)}`} />
              <span className="text-sm font-medium capitalize">{task.priority}</span>
            </div>
          )}
        </div>

        {/* Optional details - only show if not collapsed */}
        {!isCollapsed && (task.estimatedCompletionTime || task.scheduledFor || task.tags?.length > 0) && (
          <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
            {task.estimatedCompletionTime && (
              <div className="flex items-center gap-1 mb-1 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Est. completion: {formatTime(task.estimatedCompletionTime)}</span>
              </div>
            )}

            {task.scheduledFor && (
              <div className="flex items-center gap-1 mb-1 text-xs">
                <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>Scheduled: {format(new Date(task.scheduledFor), "MMM d, yyyy 'at' h:mm a")}</span>
              </div>
            )}

            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {task.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs py-0 h-5">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {!isCollapsed && (
          <>
            <div className="text-xs text-muted-foreground mb-3 italic">
              Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
            </div>

            <div className="grid grid-cols-3 gap-1 mb-2">
              {timeAdjustments.map((adjustment) => (
                <Button
                  key={adjustment.label}
                  variant="outline"
                  size="sm"
                  className={cn("h-8 text-xs border-0 font-medium", adjustment.class)}
                  onClick={(e) => {
                    e.stopPropagation()
                    onAdjustTime(task.id, adjustment.minutes)
                  }}
                >
                  {adjustment.label}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-1">
              {dayAdjustments.map((adjustment) => (
                <Button
                  key={adjustment.label}
                  variant="outline"
                  size="sm"
                  className={cn("h-8 text-xs border-0 font-medium", adjustment.class)}
                  onClick={(e) => {
                    e.stopPropagation()
                    onAdjustTime(task.id, adjustment.minutes)
                  }}
                >
                  {adjustment.label}
                </Button>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}


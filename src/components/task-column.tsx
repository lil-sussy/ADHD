"use client"

import { Draggable } from "react-beautiful-dnd"
import { TaskCard } from "@/components/task-card"
import type { Column, Task } from "@/types/todo"
import { BrainCircuit, CalendarClock, Trash2 } from "lucide-react"

interface TaskColumnProps {
  column: Column
  provided: any
  onTaskClick: (task: Task) => void
  onAdjustTime: (taskId: string, minutes: number) => void
  collapsedCards: Record<string, boolean>
  onToggleCollapse: (taskId: string) => void
}

export function TaskColumn({
  column,
  provided,
  onTaskClick,
  onAdjustTime,
  collapsedCards,
  onToggleCollapse,
}: TaskColumnProps) {
  const getColumnStyle = (columnId: string) => {
    switch (columnId) {
      case "todo":
        return {
          bg: "bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/40 dark:to-fuchsia-900/40",
          border: "border-violet-300 dark:border-violet-700",
          icon: <BrainCircuit className="h-5 w-5 text-violet-600 dark:text-violet-400" />,
          shadow: "shadow-lg shadow-violet-200/50 dark:shadow-violet-900/30",
        }
      case "not-today":
        return {
          bg: "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40",
          border: "border-amber-300 dark:border-amber-700",
          icon: <CalendarClock className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
          shadow: "shadow-lg shadow-amber-200/50 dark:shadow-amber-900/30",
        }
      case "never":
        return {
          bg: "bg-gradient-to-br from-rose-100 to-red-100 dark:from-rose-900/40 dark:to-red-900/40",
          border: "border-rose-300 dark:border-rose-700",
          icon: <Trash2 className="h-5 w-5 text-rose-600 dark:text-rose-400" />,
          shadow: "shadow-lg shadow-rose-200/50 dark:shadow-rose-900/30",
        }
      default:
        return {
          bg: "bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800",
          border: "border-gray-300 dark:border-gray-700",
          icon: null,
          shadow: "shadow-lg shadow-gray-200/50 dark:shadow-gray-900/30",
        }
    }
  }

  const style = getColumnStyle(column.id)

  return (
    <div
      className={`rounded-xl border-2 ${style.bg} ${style.border} p-4 min-h-[500px] flex flex-col ${style.shadow} backdrop-blur-sm`}
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        {style.icon}
        <h2 className="text-xl font-bold text-center">{column.title}</h2>
      </div>

      <div className="flex-grow">
        {column.tasks.length === 0 && (
          <div className="h-24 flex items-center justify-center border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400">
            <p className="text-center">Drag tasks here</p>
          </div>
        )}

        {column.tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`mb-3 ${snapshot.isDragging ? "z-[100]" : ""}`}
                style={{
                  ...provided.draggableProps.style,
                  zIndex: snapshot.isDragging ? 100 : "auto",
                }}
              >
                <TaskCard
                  task={task}
                  onClick={() => onTaskClick(task)}
                  onAdjustTime={onAdjustTime}
                  isDragging={snapshot.isDragging}
                  isCollapsed={collapsedCards[task.id]}
                  onToggleCollapse={() => onToggleCollapse(task.id)}
                />
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    </div>
  )
}


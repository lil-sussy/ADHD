"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { SplitSquareVertical, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function TaskChunker() {
  const [bigTask, setBigTask] = useState("")
  const [smallSteps, setSmallSteps] = useState<{ id: string; text: string; completed: boolean }[]>([])
  const [showForm, setShowForm] = useState(false)

  const handleAddStep = () => {
    if (bigTask.trim() === "") return

    // Generate some suggested steps based on the task
    const suggestedSteps = generateSuggestedSteps(bigTask)

    setSmallSteps(suggestedSteps)
    setShowForm(true)
  }

  const generateSuggestedSteps = (task: string) => {
    // This is a simple implementation - in a real app, you might use AI
    // to generate more personalized steps

    const commonSteps = [
      { id: crypto.randomUUID(), text: "Gather all necessary materials", completed: false },
      { id: crypto.randomUUID(), text: "Set a timer for 5 minutes", completed: false },
      { id: crypto.randomUUID(), text: "Take a quick break if needed", completed: false },
    ]

    // Add task-specific steps based on keywords
    const taskLower = task.toLowerCase()
    const specificSteps = []

    if (taskLower.includes("clean") || taskLower.includes("room") || taskLower.includes("tidy")) {
      specificSteps.push(
        { id: crypto.randomUUID(), text: "Clear visible trash", completed: false },
        { id: crypto.randomUUID(), text: "Put away clothes", completed: false },
        { id: crypto.randomUUID(), text: "Make the bed", completed: false },
        { id: crypto.randomUUID(), text: "Organize desk/surfaces", completed: false },
      )
    } else if (taskLower.includes("email") || taskLower.includes("write") || taskLower.includes("message")) {
      specificSteps.push(
        { id: crypto.randomUUID(), text: "Outline main points", completed: false },
        { id: crypto.randomUUID(), text: "Draft first version", completed: false },
        { id: crypto.randomUUID(), text: "Review and edit", completed: false },
        { id: crypto.randomUUID(), text: "Send/submit", completed: false },
      )
    } else if (taskLower.includes("homework") || taskLower.includes("study") || taskLower.includes("assignment")) {
      specificSteps.push(
        { id: crypto.randomUUID(), text: "Review instructions/requirements", completed: false },
        { id: crypto.randomUUID(), text: "Gather reference materials", completed: false },
        { id: crypto.randomUUID(), text: "Complete first section", completed: false },
        { id: crypto.randomUUID(), text: "Review work", completed: false },
      )
    } else {
      // Generic steps for any task
      specificSteps.push(
        { id: crypto.randomUUID(), text: "Start with the easiest part", completed: false },
        { id: crypto.randomUUID(), text: "Work for 10 minutes without stopping", completed: false },
        { id: crypto.randomUUID(), text: "Check progress", completed: false },
        { id: crypto.randomUUID(), text: "Complete final steps", completed: false },
      )
    }

    return [...specificSteps, ...commonSteps]
  }

  const addCustomStep = () => {
    setSmallSteps([...smallSteps, { id: crypto.randomUUID(), text: "", completed: false }])
  }

  const updateStep = (id: string, text: string) => {
    setSmallSteps(smallSteps.map((step) => (step.id === id ? { ...step, text } : step)))
  }

  const toggleStep = (id: string) => {
    setSmallSteps(smallSteps.map((step) => (step.id === id ? { ...step, completed: !step.completed } : step)))
  }

  const removeStep = (id: string) => {
    setSmallSteps(smallSteps.filter((step) => step.id !== id))
  }

  const resetForm = () => {
    setBigTask("")
    setSmallSteps([])
    setShowForm(false)
  }

  const completedSteps = smallSteps.filter((step) => step.completed).length
  const totalSteps = smallSteps.length
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  return (
    <div className="p-4 rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <SplitSquareVertical className="h-5 w-5 text-teal-500" />
          Task Chunker
        </h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">Break down overwhelming tasks into manageable steps.</p>

      {!showForm ? (
        <div className="space-y-3">
          <Input
            placeholder="Enter a big, overwhelming task..."
            value={bigTask}
            onChange={(e) => setBigTask(e.target.value)}
            className="border-teal-200 dark:border-teal-800"
          />

          <Button
            onClick={handleAddStep}
            disabled={bigTask.trim() === ""}
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            Break It Down
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-3 bg-teal-100 dark:bg-teal-800/30 rounded-lg">
            <h4 className="font-medium mb-1">Big Task:</h4>
            <p>{bigTask}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Small Steps:</h4>
              <span className="text-sm text-muted-foreground">
                {completedSteps}/{totalSteps} completed
              </span>
            </div>

            <div className="w-full h-2 bg-teal-100 dark:bg-teal-800/30 rounded-full mb-3">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {smallSteps.map((step) => (
                <div key={step.id} className="flex items-start gap-2">
                  <Checkbox
                    id={step.id}
                    checked={step.completed}
                    onCheckedChange={() => toggleStep(step.id)}
                    className="mt-1 border-teal-500 data-[state=checked]:bg-teal-500 data-[state=checked]:text-white"
                  />

                  <div className="flex-1">
                    <Input
                      value={step.text}
                      onChange={(e) => updateStep(step.id, e.target.value)}
                      className={cn(
                        "border-teal-200 dark:border-teal-800",
                        step.completed && "line-through text-muted-foreground",
                      )}
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => removeStep(step.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-3">
              <Button variant="outline" className="flex-1 border-teal-200 dark:border-teal-800" onClick={resetForm}>
                Start Over
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-1 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300"
                onClick={addCustomStep}
              >
                <Plus className="h-4 w-4" />
                Add Step
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


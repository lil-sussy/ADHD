"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function NameSelector() {
  const [open, setOpen] = useState(false)
  const [selectedName, setSelectedName] = useState("")

  const appNames = [
    {
      name: "BrainWave",
      description: "Ride the wave of productivity with this ADHD-friendly task manager",
    },
    {
      name: "FocusFlex",
      description: "Flexible task management for flexible brains",
    },
    {
      name: "TaskTamer",
      description: "Tame the chaos of your to-do list, one task at a time",
    },
    {
      name: "MindMosaic",
      description: "Piece together your scattered thoughts into a beautiful productivity system",
    },
    {
      name: "AttentionAnchor",
      description: "Stay anchored to your tasks, even when your mind wants to drift away",
    },
    {
      name: "DopamineDesk",
      description: "Get that sweet dopamine hit with every completed task",
    },
  ]

  useEffect(() => {
    // Check if app name exists in localStorage
    const savedAppName = localStorage.getItem("adhd-app-name")
    if (!savedAppName) {
      setOpen(true)
    }
  }, [])

  const handleSelect = (name: string) => {
    setSelectedName(name)
  }

  const handleSave = () => {
    if (selectedName) {
      localStorage.setItem("adhd-app-name", JSON.stringify(selectedName))
      // Force a page reload to update the app name in the UI
      window.location.reload()
    }
    setOpen(false)
  }

  const handleReset = () => {
    localStorage.removeItem("adhd-app-name")
    setOpen(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Choose Your App Name</DialogTitle>
            <DialogDescription>Pick a name that resonates with your ADHD brain!</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {appNames.map((app) => (
              <div
                key={app.name}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedName === app.name
                    ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                    : "border-gray-200 hover:border-violet-200 dark:border-gray-700 dark:hover:border-violet-700"
                }`}
                onClick={() => handleSelect(app.name)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{app.name}</h3>
                  {selectedName === app.name && <Check className="h-5 w-5 text-violet-500" />}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{app.description}</p>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              onClick={handleSave}
              disabled={!selectedName}
              className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700"
            >
              Save & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-end mb-4">
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Change App Name
        </Button>
      </div>
    </>
  )
}


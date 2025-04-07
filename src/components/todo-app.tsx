"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, DropResult, DroppableLocation } from "react-beautiful-dnd"
import { TaskColumn } from "@/components/task-column"
import { TaskDetail } from "@/components/task-detail"
import { Button } from "@/components/ui/button"
import {
  PlusCircle,
  Sparkles,
  Volume2,
  VolumeX,
  Rocket,
  Zap,
  Moon,
  Sun,
  Laugh,
  EyeOff,
  Eye,
  Cat,
  LogIn,
} from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import type { Task, Column } from "@/types/todo"
import { useToast } from "@/components/ui/use-toast"
import { MotivationMeter } from "@/components/motivation-meter"
import { Confetti } from "@/components/confetti"
import { SpamButton } from "@/components/spam-button"
import { SoundButton } from "@/components/sound-button"
import { useTheme } from "next-themes"
import { MemeGallery } from "@/components/meme-gallery"
import { DiscordLogin } from "@/components/discord-login"
import { CleaningTimer } from "@/components/cleaning-timer"
import { BodyDoubling } from "@/components/body-doubling"
import { TaskChunker } from "@/components/task-chunker"
import { FidgetToy } from "@/components/fidget-toy"

export function TodoApp() {
  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", title: "Todo", tasks: [] },
    { id: "not-today", title: "Fuck that for today", tasks: [] },
    { id: "never", title: "Fuck that", tasks: [] },
  ])

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [completedToday, setCompletedToday] = useState(0)
  const [appName, setAppName] = useState("")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [allCollapsed, setAllCollapsed] = useState(false)
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({})
  const [showMemes, setShowMemes] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  // Load tasks and app name from localStorage on component mount
  useEffect(() => {
    const savedColumns = localStorage.getItem("adhd-todo-columns")
    if (savedColumns) {
      try {
        const parsedColumns = JSON.parse(savedColumns) as Column[]
        setColumns(parsedColumns)
      } catch (error) {
        console.error("Failed to parse columns from localStorage", error)
      }
    }

    const savedCompleted = localStorage.getItem("adhd-todo-completed")
    if (savedCompleted) {
      setCompletedToday(Number.parseInt(savedCompleted))
    }

    const savedAppName = localStorage.getItem("adhd-app-name")
    if (savedAppName) {
      try {
        setAppName(JSON.parse(savedAppName) as string)
      } catch (error) {
        console.error("Failed to parse app name from localStorage", error)
      }
    }

    const savedSoundSetting = localStorage.getItem("adhd-sound-enabled")
    if (savedSoundSetting !== null) {
      try {
        setSoundEnabled(JSON.parse(savedSoundSetting) as boolean)
      } catch (error) {
        console.error("Failed to parse sound setting from localStorage", error)
      }
    }

    const savedCollapsedState = localStorage.getItem("adhd-collapsed-cards")
    if (savedCollapsedState) {
      try {
        setCollapsedCards(JSON.parse(savedCollapsedState) as Record<string, boolean>)
      } catch (error) {
        console.error("Failed to parse collapsed state from localStorage", error)
      }
    }

    const savedLoginState = localStorage.getItem("adhd-login-state")
    if (savedLoginState) {
      try {
        const loginData = JSON.parse(savedLoginState) as { isLoggedIn: boolean; username: string }
        setIsLoggedIn(loginData.isLoggedIn)
        setUsername(loginData.username)
      } catch (error) {
        console.error("Failed to parse login state from localStorage", error)
      }
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("adhd-todo-columns", JSON.stringify(columns))
  }, [columns])

  // Save completed count
  useEffect(() => {
    localStorage.setItem("adhd-todo-completed", completedToday.toString())
  }, [completedToday])

  // Save sound setting
  useEffect(() => {
    localStorage.setItem("adhd-sound-enabled", JSON.stringify(soundEnabled))
  }, [soundEnabled])

  // Save collapsed cards state
  useEffect(() => {
    localStorage.setItem("adhd-collapsed-cards", JSON.stringify(collapsedCards))
  }, [collapsedCards])

  // Save login state
  useEffect(() => {
    localStorage.setItem("adhd-login-state", JSON.stringify({ isLoggedIn, username }))
  }, [isLoggedIn, username])

  // Reset completed count at midnight
  useEffect(() => {
    const checkDate = () => {
      const lastReset = localStorage.getItem("adhd-todo-last-reset")
      const today = new Date().toDateString()

      if (lastReset !== today) {
        setCompletedToday(0)
        localStorage.setItem("adhd-todo-last-reset", today)
      }
    }

    checkDate()
    const interval = setInterval(checkDate, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result

    // Dropped outside a droppable area
    if (!destination) return

    // Same position
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    // Find source and destination columns
    const sourceColumn = columns.find((col) => col.id === source.droppableId)
    const destColumn = columns.find((col) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    // Create new columns array
    const newColumns = [...columns]

    // Find the indices of the source and destination columns
    const sourceColumnIndex = columns.findIndex((col) => col.id === source.droppableId)
    const destColumnIndex = columns.findIndex((col) => col.id === destination.droppableId)

    // Same column
    if (source.droppableId === destination.droppableId) {
      const newTasks = Array.from(sourceColumn.tasks)
      const [movedTask] = newTasks.splice(source.index, 1)
      newTasks.splice(destination.index, 0, movedTask)

      newColumns[sourceColumnIndex] = {
        ...sourceColumn,
        tasks: newTasks,
      }
    } else {
      // Different columns
      const sourceTasks = Array.from(sourceColumn.tasks)
      const destTasks = Array.from(destColumn.tasks)
      const [movedTask] = sourceTasks.splice(source.index, 1)
      destTasks.splice(destination.index, 0, movedTask)

      newColumns[sourceColumnIndex] = {
        ...sourceColumn,
        tasks: sourceTasks,
      }

      newColumns[destColumnIndex] = {
        ...destColumn,
        tasks: destTasks,
      }
    }

    setColumns(newColumns)

    // Show celebration when moving from todo to completed
    if (source.droppableId === "todo" && destination.droppableId !== "todo") {
      setShowConfetti(true)
      setCompletedToday((prev) => prev + 1)

      const messages = [
        "You're crushing it! 🚀",
        "One less thing to worry about! 🎉",
        "Brain: 1, Chaos: 0 ✨",
        "Look at you being all productive! 🌟",
        "That's how it's done! 💪",
        "Your future self thanks you! 🙏",
        "Dopamine boost unlocked! 🧠",
      ]

      toast({
        title: "Task moved!",
        description: messages[Math.floor(Math.random() * messages.length)],
        variant: "default",
      })

      if (soundEnabled) {
        const successSound = new Audio("/sounds/success.mp3")
        successSound.volume = 0.5
        successSound.play()
      }

      setTimeout(() => setShowConfetti(false), 3000)
    }
  }

  const addNewTask = () => {
    const newTask: Task = {
      id: uuidv4(),
      title: "New Task",
      description: "",
      estimatedTime: 30, // Default 30 minutes
      createdAt: new Date().toISOString(),
      color: getRandomColor(),
      scheduledFor: null,
      estimatedCompletionTime: null,
      priority: "medium",
      tags: [],
    }

    const todoColumnIndex = columns.findIndex((col) => col.id === "todo")
    const newColumns = [...columns]
    newColumns[todoColumnIndex].tasks = [newTask, ...newColumns[todoColumnIndex].tasks]

    setColumns(newColumns)
    setSelectedTask(newTask)

    if (soundEnabled) {
      const popSound = new Audio("/sounds/pop.mp3")
      popSound.volume = 0.5
      popSound.play()
    }
  }

  const updateTask = (updatedTask: Task) => {
    const newColumns = columns.map((column) => {
      const taskIndex = column.tasks.findIndex((task) => task.id === updatedTask.id)
      if (taskIndex !== -1) {
        const newTasks = [...column.tasks]
        newTasks[taskIndex] = updatedTask
        return { ...column, tasks: newTasks }
      }
      return column
    })

    setColumns(newColumns)
    setSelectedTask(null)

    if (soundEnabled) {
      const saveSound = new Audio("/sounds/save.mp3")
      saveSound.volume = 0.5
      saveSound.play()
    }
  }

  const deleteTask = (taskId: string) => {
    const newColumns = columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter((task) => task.id !== taskId),
    }))

    setColumns(newColumns)
    setSelectedTask(null)

    if (soundEnabled) {
      const deleteSound = new Audio("/sounds/delete.mp3")
      deleteSound.volume = 0.5
      deleteSound.play()
    }
  }

  const adjustTaskTime = (taskId: string, minutes: number) => {
    const newColumns = columns.map((column) => {
      const taskIndex = column.tasks.findIndex((task) => task.id === taskId)
      if (taskIndex !== -1) {
        const newTasks = [...column.tasks]
        const task = newTasks[taskIndex]
        const newEstimatedTime = Math.max(0, task.estimatedTime + minutes)
        newTasks[taskIndex] = { ...task, estimatedTime: newEstimatedTime }
        return { ...column, tasks: newTasks }
      }
      return column
    })

    setColumns(newColumns)

    if (soundEnabled) {
      const clickSound = new Audio("/sounds/click.mp3")
      clickSound.volume = 0.3
      clickSound.play()
    }
  }

  const getRandomColor = () => {
    const colors = [
      "bg-gradient-to-r from-pink-500 to-rose-500",
      "bg-gradient-to-r from-violet-500 to-purple-500",
      "bg-gradient-to-r from-blue-500 to-cyan-500",
      "bg-gradient-to-r from-emerald-500 to-green-500",
      "bg-gradient-to-r from-amber-500 to-yellow-500",
      "bg-gradient-to-r from-orange-500 to-red-500",
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const getRandomEmoji = () => {
    const emojis = ["✨", "🚀", "🎯", "💫", "⚡", "🔥", "🌈", "💪", "🧠", "🦄"]
    return emojis[Math.floor(Math.random() * emojis.length)]
  }

  const getMotivationalMessage = () => {
    const messages = [
      "You've got this!",
      "One task at a time...",
      "Progress, not perfection",
      "Your brain is awesome!",
      "Small steps, big wins",
      "Focus on what matters",
      "Embrace the chaos",
      "You're doing great!",
    ]
    return `${getRandomEmoji()} ${messages[Math.floor(Math.random() * messages.length)]}`
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)

    if (soundEnabled) {
      const offSound = new Audio("/sounds/switch-off.mp3")
      offSound.volume = 0.5
      offSound.play()
    } else {
      const onSound = new Audio("/sounds/switch-on.mp3")
      onSound.volume = 0.5
      onSound.play()
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")

    if (soundEnabled) {
      const switchSound = new Audio("/sounds/switch.mp3")
      switchSound.volume = 0.5
      switchSound.play()
    }
  }

  const toggleAllCollapsed = () => {
    setAllCollapsed(!allCollapsed)

    // Create a new collapsed state object
    const newCollapsedState: Record<string, boolean> = {}

    // Set all tasks to the new collapsed state
    columns.forEach((column) => {
      column.tasks.forEach((task) => {
        newCollapsedState[task.id] = !allCollapsed
      })
    })

    setCollapsedCards(newCollapsedState)

    if (soundEnabled) {
      const collapseSound = new Audio("/sounds/collapse.mp3")
      collapseSound.volume = 0.5
      collapseSound.play()
    }

    toast({
      title: !allCollapsed ? "Collapsed all cards" : "Expanded all cards",
      description: !allCollapsed ? "Now you can see shit clearly!" : "Back to full details mode!",
      variant: "default",
    })
  }

  const toggleCardCollapse = (taskId: string) => {
    setCollapsedCards((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }))

    if (soundEnabled) {
      const clickSound = new Audio("/sounds/click.mp3")
      clickSound.volume = 0.3
      clickSound.play()
    }
  }

  const handleDiscordLogin = () => {
    // Simulate login
    setIsLoggedIn(true)

    // Generate a random Discord-like username
    const names = ["CoolCat", "ADHDBrain", "TaskMaster", "FocusNinja", "ChaoticGood", "DistractedGenius"]
    const numbers = ["420", "69", "1337", "42", "007", "404"]
    const randomName = names[Math.floor(Math.random() * names.length)]
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)]
    setUsername(`${randomName}#${randomNumber}`)

    if (soundEnabled) {
      const loginSound = new Audio("/sounds/success.mp3")
      loginSound.volume = 0.5
      loginSound.play()
    }

    toast({
      title: "Logged in with Discord!",
      description: "Your tasks are now synced to the cloud. Not really, but imagine they are!",
      variant: "default",
    })
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername("")

    if (soundEnabled) {
      const logoutSound = new Audio("/sounds/switch-off.mp3")
      logoutSound.volume = 0.5
      logoutSound.play()
    }

    toast({
      title: "Logged out",
      description: "Your tasks are still saved locally. Login to sync them!",
      variant: "default",
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      {showConfetti && <Confetti />}

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-violet-100 dark:border-violet-900 p-4 mb-6">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-2">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-pink-600 dark:from-violet-400 dark:to-pink-400">
            {appName || "Your ADHD-Friendly Todo App"}
          </h1>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAllCollapsed}
              className="flex items-center gap-1 font-medium"
            >
              {allCollapsed ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {allCollapsed ? "See All" : "See Shit"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMemes(!showMemes)}
              className="flex items-center gap-1 font-medium"
            >
              <Cat className="h-4 w-4" />
              {showMemes ? "Hide Memes" : "Cat Memes"}
            </Button>

            {!isLoggedIn ? (
              <DiscordLogin onLogin={handleDiscordLogin} />
            ) : (
              <div className="flex items-center gap-2">
                <div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {username}
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8">
                  <LogIn className="h-4 w-4 rotate-180" />
                </Button>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSound}
                className="rounded-full h-8 w-8"
                title={soundEnabled ? "Mute sounds" : "Enable sounds"}
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full h-8 w-8"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 flex-grow">
        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-violet-100 dark:border-violet-900 p-4 shadow-md">
              <MotivationMeter value={completedToday} />

              <div className="mt-4 p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                <p className="text-lg font-medium text-center">{getMotivationalMessage()}</p>
              </div>

              <Button
                onClick={addNewTask}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                <PlusCircle className="h-5 w-5" />
                Add New Task
              </Button>
            </div>

            {/* Cleaning Timer */}
            <CleaningTimer soundEnabled={soundEnabled} />

            {/* Body Doubling */}
            <BodyDoubling soundEnabled={soundEnabled} />

            {/* Task Chunker */}
            <TaskChunker />

            {/* Fidget Toy */}
            <FidgetToy soundEnabled={soundEnabled} />

            {/* Fun Interaction Area */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-violet-100 dark:border-violet-900 p-4 shadow-md">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Fun Zone
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <SoundButton
                  icon={<Rocket className="h-5 w-5" />}
                  label="Rocket"
                  soundPath="/sounds/rocket.mp3"
                  enabled={soundEnabled}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                />

                <SoundButton
                  icon={<Zap className="h-5 w-5" />}
                  label="Zap"
                  soundPath="/sounds/zap.mp3"
                  enabled={soundEnabled}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                />
              </div>

              <div className="flex justify-center">
                <SpamButton enabled={soundEnabled} />
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-violet-100 dark:border-violet-900 p-4 shadow-md">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Laugh className="h-5 w-5 text-pink-500" />
                Need a break?
              </h3>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")}
              >
                Click for a dopamine boost
              </Button>
            </div>
          </div>

          {/* Main Task Columns */}
          <div className="lg:col-span-3">
            {showMemes && <MemeGallery />}

            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                {columns.map((column) => (
                  <Droppable 
                    key={column.id} 
                    droppableId={column.id}
                    isDropDisabled={false}
                    isCombineEnabled={false}
                  >
                    {(provided) => (
                      <TaskColumn
                        column={column}
                        provided={provided}
                        onTaskClick={setSelectedTask}
                        onAdjustTime={adjustTaskTime}
                        collapsedCards={collapsedCards}
                        onToggleCollapse={toggleCardCollapse}
                      />
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          </div>
        </div>
      </div>

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      )}
    </div>
  )
}


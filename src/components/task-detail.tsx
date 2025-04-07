"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Task } from "@/types/todo"
import { Trash, Save, X, Clock, Palette, Calendar, Tag, Flag, Plus, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface TaskDetailProps {
  task: Task
  onClose: () => void
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
}

export function TaskDetail({ task, onClose, onUpdate, onDelete }: TaskDetailProps) {
  const [editedTask, setEditedTask] = useState<Task>({ ...task })
  const [newTag, setNewTag] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    onUpdate(editedTask)
  }

  const handleDelete = () => {
    onDelete(task.id)
  }

  const colorOptions = [
    "bg-gradient-to-r from-pink-500 to-rose-500",
    "bg-gradient-to-r from-violet-500 to-purple-500",
    "bg-gradient-to-r from-blue-500 to-cyan-500",
    "bg-gradient-to-r from-emerald-500 to-green-500",
    "bg-gradient-to-r from-amber-500 to-yellow-500",
    "bg-gradient-to-r from-orange-500 to-red-500",
  ]

  const addTag = () => {
    if (newTag.trim() && !editedTask.tags?.includes(newTag.trim())) {
      setEditedTask((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEditedTask((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }))
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-xl overflow-hidden p-0">
        <div className={cn("h-3", editedTask.color || "bg-gradient-to-r from-violet-500 to-fuchsia-500")} />

        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">Task Details</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-base">
                Title
              </Label>
              <Input id="title" name="title" value={editedTask.title} onChange={handleChange} className="text-lg" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-base">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                value={editedTask.description}
                onChange={handleChange}
                placeholder="Add details about this task..."
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Estimated Duration (minutes)
                </Label>
                <Input
                  id="estimatedTime"
                  name="estimatedTime"
                  type="number"
                  min="0"
                  value={editedTask.estimatedTime}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value) || 0
                    setEditedTask((prev) => ({ ...prev, estimatedTime: value }))
                  }}
                />
              </div>

              <div className="grid gap-2">
                <Label className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Est. Completion Time (minutes)
                </Label>
                <Input
                  id="estimatedCompletionTime"
                  name="estimatedCompletionTime"
                  type="number"
                  min="0"
                  value={editedTask.estimatedCompletionTime || ""}
                  placeholder="Optional"
                  onChange={(e) => {
                    const value = e.target.value ? Number.parseInt(e.target.value) : null
                    setEditedTask((prev) => ({ ...prev, estimatedCompletionTime: value }))
                  }}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule For (Optional)
              </Label>
              <Input
                id="scheduledFor"
                name="scheduledFor"
                type="datetime-local"
                value={editedTask.scheduledFor ? new Date(editedTask.scheduledFor).toISOString().slice(0, 16) : ""}
                onChange={(e) => {
                  const value = e.target.value ? new Date(e.target.value).toISOString() : null
                  setEditedTask((prev) => ({ ...prev, scheduledFor: value }))
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-base flex items-center gap-2">
                <Flag className="h-4 w-4" />
                Priority
              </Label>
              <Select
                value={editedTask.priority || "medium"}
                onValueChange={(value) => setEditedTask((prev) => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-base flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button type="button" onClick={addTag} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {editedTask.tags && editedTask.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {editedTask.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1">
                      {tag}
                      <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0" onClick={() => removeTag(tag)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label className="text-base flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Task Color
              </Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color, index) => (
                  <button
                    key={index}
                    type="button"
                    className={cn(
                      "w-8 h-8 rounded-full transition-all",
                      color,
                      editedTask.color === color ? "ring-2 ring-offset-2 ring-black dark:ring-white" : "",
                    )}
                    onClick={() => setEditedTask((prev) => ({ ...prev, color }))}
                    aria-label={`Color option ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between pt-4 border-t">
            <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
              <Trash className="h-4 w-4" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}


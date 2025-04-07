"use client"

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import DragDropContext and Droppable with SSR disabled
const DragDropContext = dynamic(
  () => import('react-beautiful-dnd').then(mod => mod.DragDropContext),
  { ssr: false }
)

const Droppable = dynamic(
  () => import('react-beautiful-dnd').then(mod => mod.Droppable),
  { ssr: false }
)

interface DndProviderProps {
  onDragEnd: (result: any) => void
  children: (droppableProps: {
    droppableId: string
    isDropDisabled?: boolean
    isCombineEnabled?: boolean
  }) => React.ReactNode
}

export function DndProvider({ onDragEnd, children }: DndProviderProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Add specific fix for useLayoutEffect warning in react-beautiful-dnd
    // This silences the warning by updating the error handler
    if (typeof window !== 'undefined') {
      const originalError = console.error
      console.error = (...args) => {
        if (
          typeof args[0] === 'string' && 
          args[0].includes('useLayoutEffect does nothing on the server')
        ) {
          return
        }
        originalError(...args)
      }
      
      return () => {
        console.error = originalError
      }
    }
  }, [])

  if (!isMounted) {
    // Return an empty placeholder during SSR
    return null
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {children}
    </DragDropContext>
  )
}

export { Droppable } // Re-export the dynamic component 
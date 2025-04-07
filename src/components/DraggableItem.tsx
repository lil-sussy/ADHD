"use client"

import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Draggable with SSR disabled
const Draggable = dynamic(
  () => import('react-beautiful-dnd').then(mod => mod.Draggable),
  { ssr: false }
)

interface DraggableItemProps {
  id: string
  index: number
  children: (provided: any, snapshot: any) => React.ReactNode
}

export function DraggableItem({ id, index, children }: DraggableItemProps) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => children(provided, snapshot)}
    </Draggable>
  )
} 
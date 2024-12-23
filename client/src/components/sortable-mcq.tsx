'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

interface SortableMCQProps {
  id: string
  children: React.ReactNode
}

export function SortableMCQ({ id, children }: SortableMCQProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative mb-4">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-8 cursor-move flex items-center justify-center touch-none"
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>
      <div className="pl-8">{children}</div>
    </div>
  )
}

    
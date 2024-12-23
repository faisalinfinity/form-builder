'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'

interface DraggableOptionProps {
  id: string
  text: string
  isUsed?: boolean
}

export function DraggableOption({ id, text, isUsed }: DraggableOptionProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: {
      text,
    },
    disabled: isUsed,
  })

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
  } : undefined

  if (isUsed) {
    return null
  }

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "px-4 py-2 rounded-lg bg-indigo-500 text-white font-medium",
        "transition-colors hover:bg-indigo-600 active:scale-95",
        "touch-none cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50",
      )}
    >
      {text}
    </button>
  )
}


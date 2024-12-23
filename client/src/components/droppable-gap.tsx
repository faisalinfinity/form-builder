'use client'

import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'

interface DroppableGapProps {
  id: string
  answer?: string
  onRemove?: () => void
}

export function DroppableGap({ id, answer, onRemove }: DroppableGapProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <span
      ref={setNodeRef}
      className={cn(
        "inline-flex items-center justify-center min-w-[100px] h-8",
        "border rounded mx-1 px-2 transition-all duration-200",
        !answer && "bg-gray-100 border-gray-200",
        isOver && "ring-2 ring-indigo-500 border-indigo-500",
        answer && "bg-indigo-500 text-white cursor-pointer hover:bg-indigo-600"
      )}
      onClick={() => {
        if (answer && onRemove) {
          onRemove()
        }
      }}
    >
      {answer || '\u00A0'}
    </span>
  )
}




import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'

interface DraggableItemProps {
  id: string
  content: string
  categoryId?: string
}

export function DraggableItem({ id, content, categoryId }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  })

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "px-4 py-2 rounded-lg border bg-white shadow-sm cursor-move touch-none",
        isDragging && "opacity-50",
        categoryId && "border-primary"
      )}
    >
      {content}
    </div>
  )
}




import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { FormInput } from "./form-input"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"

interface CategoryInputProps {
  id: string
  name: string
  onRemove: (id: string) => void
  onChange: (id: string, value: string) => void
}

export function CategoryInput({ id, name, onRemove, onChange }: CategoryInputProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 touch-none",
        isDragging && "opacity-50"
      )}
      {...attributes}
    >
      <div className="cursor-move" {...listeners}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="grid-dots"
        >
          <circle cx="4" cy="4" r="1" />
          <circle cx="4" cy="12" r="1" />
          <circle cx="4" cy="20" r="1" />
          <circle cx="12" cy="4" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="20" r="1" />
        </svg>
      </div>
      <FormInput
        value={name}
        onChange={(e) => onChange(id, e.target.value)}
        className="flex-1"
        placeholder="Category name"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove(id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}


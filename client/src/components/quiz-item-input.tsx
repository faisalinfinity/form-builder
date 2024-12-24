'use client'

import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { FormInput } from "./form-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/quiz"

interface QuizItemInputProps {
  id: string
  content: string
  categoryId?: string
  categories: Category[]
  onRemove: (id: string) => void
  onChange: (id: string, content: string) => void
  onCategoryChange: (id: string, categoryId: string) => void
}

export function QuizItemInput({
  id,
  content,
  categoryId,
  categories,
  onRemove,
  onChange,
  onCategoryChange,
}: QuizItemInputProps) {
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
        value={content}
        onChange={(e) => onChange(id, e.target.value)}
        className="flex-1"
        placeholder="Item content"
      />
      <Select
        value={categoryId}
        onValueChange={(value) => onCategoryChange(id, value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Choose Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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


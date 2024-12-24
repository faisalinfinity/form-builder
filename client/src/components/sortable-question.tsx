'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import type { Question } from '@/types/quiz'

interface SortableQuestionProps {
  id: string
  question: Question
  onEdit: () => void
  onDelete: () => void
}

export function SortableQuestion({ id, question, onEdit, onDelete }: SortableQuestionProps) {
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
    <Card ref={setNodeRef} style={style} className="mb-4">
      <CardHeader className="flex flex-row items-center">
        <div
          {...attributes}
          {...listeners}
          className="cursor-move mr-2 touch-none"
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        <CardTitle className="flex-grow">{question.title}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p>Type: {question.type}</p>
        <p>Points: {question.points}</p>
      </CardContent>
    </Card>
  )
}


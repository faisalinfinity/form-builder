'use client'

import { X } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ClozeAnswer } from '@/types/cloze'

interface AnswerOptionProps {
  answer: ClozeAnswer
  onRemove: (id: string) => void
  onChange: (id: string, text: string) => void
  onCorrectChange: (id: string, isCorrect: boolean) => void
}

export function AnswerOption({ 
  answer, 
  onRemove, 
  onChange,
  onCorrectChange 
}: AnswerOptionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: answer.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 p-2 bg-white rounded-lg border",
        isDragging && "opacity-50"
      )}
    >
      <div className="cursor-move touch-none" {...attributes} {...listeners}>
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
          className="h-4 w-4 text-gray-400"
        >
          <circle cx="9" cy="5" r="1" />
          <circle cx="9" cy="12" r="1" />
          <circle cx="9" cy="19" r="1" />
          <circle cx="15" cy="5" r="1" />
          <circle cx="15" cy="12" r="1" />
          <circle cx="15" cy="19" r="1" />
        </svg>
      </div>
      <Checkbox
      title="Check if it is the correct answer"
      disabled
        checked={answer.isCorrect}
        onCheckedChange={(checked) => 
          onCorrectChange(answer.id, checked === true)
        }
        
      />
      <Input
        value={answer.text}
        onChange={(e) => onChange(answer.id, e.target.value)}
        className="flex-1"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove(answer.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}


'use client'

import { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MCQBuilder } from './mcq-builder'
import { SortableMCQ } from './sortable-mcq'
import type { Comprehension, MCQ } from '@/types/comprehension'

const initialComprehension: Comprehension = {
  id: '1',
  title: '',
  passage: '',
  mcqs: [],
  points: 10,
}

export function ComprehensionBuilder() {
  const [comprehension, setComprehension] = useState<Comprehension>(initialComprehension)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setComprehension((prev) => {
        const oldIndex = prev.mcqs.findIndex((mcq) => mcq.id === active.id)
        const newIndex = prev.mcqs.findIndex((mcq) => mcq.id === over.id)

        return {
          ...prev,
          mcqs: arrayMove(prev.mcqs, oldIndex, newIndex),
        }
      })
    }
  }

  const addMCQ = () => {
    const newMCQ: MCQ = {
      id: `mcq-${comprehension.mcqs.length + 1}`,
      question: '',
      options: [
        { id: 'option-1', text: '' },
        { id: 'option-2', text: '' },
      ],
      correctOptionId: '',
    }
    setComprehension((prev) => ({
      ...prev,
      mcqs: [...prev.mcqs, newMCQ],
    }))
  }

  const updateMCQ = (updatedMCQ: MCQ) => {
    setComprehension((prev) => ({
      ...prev,
      mcqs: prev.mcqs.map((mcq) => (mcq.id === updatedMCQ.id ? updatedMCQ : mcq)),
    }))
  }

  const deleteMCQ = (mcqId: string) => {
    setComprehension((prev) => ({
      ...prev,
      mcqs: prev.mcqs.filter((mcq) => mcq.id !== mcqId),
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <Input
          value={comprehension.title}
          onChange={(e) => setComprehension((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Comprehension Title"
          className="text-2xl font-semibold w-auto"
        />
        <div className="flex items-center gap-4">
          <Input
            type="number"
            value={comprehension.points}
            onChange={(e) => setComprehension((prev) => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
            className="w-24"
            placeholder="Points"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="passage">Passage</Label>
        <Textarea
          id="passage"
          value={comprehension.passage}
          onChange={(e) => setComprehension((prev) => ({ ...prev, passage: e.target.value }))}
          placeholder="Enter the comprehension passage here"
          className="min-h-[200px]"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Multiple Choice Questions</h2>
          <Button onClick={addMCQ}>Add MCQ</Button>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={comprehension.mcqs.map((mcq) => mcq.id)}
            strategy={verticalListSortingStrategy}
          >
            {comprehension.mcqs.map((mcq) => (
              <SortableMCQ key={mcq.id} id={mcq.id}>
                <MCQBuilder
                  mcq={mcq}
                  onUpdate={updateMCQ}
                  onDelete={() => deleteMCQ(mcq.id)}
                />
              </SortableMCQ>
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <Button type="submit" className="w-full">
        Save Comprehension
      </Button>
    </div>
  )
}


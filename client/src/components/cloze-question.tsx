'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { DraggableOption } from './draggable-option'
import { DroppableGap } from './droppable-gap'
import type { ClozeQuestion as ClozeQuestionType } from '@/types/cloze-answer'

interface ClozeQuestionProps {
  question: ClozeQuestionType
}

export function ClozeQuestion({ question }: ClozeQuestionProps) {
  const [gaps, setGaps] = useState(question.gaps)
  const [options, setOptions] = useState(question.options)

  // Configure sensors for both mouse and touch interactions
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 8,
      },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || !active.data.current) return

    const optionText = active.data.current.text as string
    const optionId = active.id as string
    const gapId = over.id as string

    // If there's already an answer in this gap, make its option available again
    const currentGap = gaps.find(g => g.id === gapId)
    if (currentGap?.answer) {
      setOptions(prev => prev.map(option => 
        option.text === currentGap.answer ? { ...option, isUsed: false } : option
      ))
    }

    // Update the gaps with the new answer
    setGaps(prev => prev.map(gap => 
      gap.id === gapId ? { ...gap, answer: optionText } : gap
    ))

    // Mark the option as used
    setOptions(prev => prev.map(option => 
      option.id === optionId ? { ...option, isUsed: true } : option
    ))
  }

  const removeAnswer = (gapId: string) => {
    const gap = gaps.find(g => g.id === gapId)
    if (!gap?.answer) return

    setGaps(prev => prev.map(g => 
      g.id === gapId ? { ...g, answer: undefined } : g
    ))

    setOptions(prev => prev.map(option => 
      option.text === gap.answer ? { ...option, isUsed: false } : option
    ))
  }

  // Split content into text and gaps
  const contentParts = question.content.split(/\{\{gap\}\}/g)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold">{question.title}</h2>
        <div className="flex items-center gap-4">
          {/* <button className="p-2 rounded-full hover:bg-gray-100">
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
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button> */}
          <div className="px-3 py-1 rounded-full border font-medium">
            {question.points} Points
          </div>
        
        </div>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex flex-wrap gap-2 mb-8">
          {options.map((option) => (
            <DraggableOption
              key={option.id}
              id={option.id}
              text={option.text}
              isUsed={option.isUsed}
            />
          ))}
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm text-lg">
          {contentParts.map((part, index) => (
            <span key={index}>
              {part}
              {index < gaps.length && (
                <DroppableGap
                  key={gaps[index].id}
                  id={gaps[index].id}
                  answer={gaps[index].answer}
                  onRemove={() => removeAnswer(gaps[index].id)}
                />
              )}
            </span>
          ))}
        </div>
      </DndContext>
    </div>
  )
}


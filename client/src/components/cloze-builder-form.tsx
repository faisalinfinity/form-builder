'use client'

import { useState } from 'react'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ClozeEditor } from './cloze-editor'
import { ClozePreview } from './cloze-preview'
import { AnswerOption } from './answer-option'
import type { ClozeQuestion, ClozeAnswer } from '@/types/cloze'

const initialQuestion: ClozeQuestion = {
  id: '1',
  title: 'Question 1',
  content: 'World War II was fought between the Allies and the <mark data-type="cloze-gap">Axis</mark> powers.',
  answers: [
    { id: '1', text: 'Axis', isCorrect: true },
    { id: '2', text: 'Central', isCorrect: false },
  ],
  points: 10,
}

export function ClozeBuilderForm() {
  const [question, setQuestion] = useState<ClozeQuestion>(initialQuestion)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setQuestion((prev) => ({
        ...prev,
        answers: arrayMove(
          prev.answers,
          prev.answers.findIndex((answer) => answer.id === active.id),
          prev.answers.findIndex((answer) => answer.id === over.id)
        ),
      }))
    }
  }

  const addAnswer = () => {
    const newAnswer: ClozeAnswer = {
      id: `answer-${question.answers.length + 1}`,
      text: '',
      isCorrect: false,
    }
    setQuestion((prev) => ({
      ...prev,
      answers: [...prev.answers, newAnswer],
    }))
  }

  const removeAnswer = (id: string) => {
    setQuestion((prev) => ({
      ...prev,
      answers: prev.answers.filter((answer) => answer.id !== id),
    }))
  }

  const updateAnswer = (id: string, text: string) => {
    setQuestion((prev) => ({
      ...prev,
      answers: prev.answers.map((answer) =>
        answer.id === id ? { ...answer, text } : answer
      ),
    }))
  }

  const updateAnswerCorrect = (id: string, isCorrect: boolean) => {
    setQuestion((prev) => ({
      ...prev,
      answers: prev.answers.map((answer) =>
        answer.id === id ? { ...answer, isCorrect } : answer
      ),
    }))
  }

  return (
    <form className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <Input
          value={question.title}
          onChange={(e) =>
            setQuestion((prev) => ({ ...prev, title: e.target.value }))
          }
          className="text-2xl font-semibold w-auto"
        />
        <div className="flex items-center gap-4">
          <Select
            value="cloze"
            onValueChange={() => {}}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Question Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cloze">Cloze</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={question.points}
            onChange={(e) =>
              setQuestion((prev) => ({
                ...prev,
                points: parseInt(e.target.value) || 0,
              }))
            }
            className="w-24"
            placeholder="Points"
          />
        </div>
      </div>

      <ClozePreview question={question} />

      <div className="space-y-4">
        <Label>Sentence</Label>
        <ClozeEditor
          content={question.content}
          onChange={(content) =>
            setQuestion((prev) => ({ ...prev, content }))
          }
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Media</Label>
          <Select value={question.media} onValueChange={(value) =>
            setQuestion((prev) => ({ ...prev, media: value }))
          }>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select media type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Answer Options</Label>
          <Button type="button" variant="outline" onClick={addAnswer}>
            Add Option
          </Button>
        </div>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={question.answers.map((answer) => answer.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {question.answers.map((answer) => (
                <AnswerOption
                  key={answer.id}
                  answer={answer}
                  onRemove={removeAnswer}
                  onChange={updateAnswer}
                  onCorrectChange={updateAnswerCorrect}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="space-y-2">
        <Label>Feedback (Optional)</Label>
        <Textarea
          value={question.feedback}
          onChange={(e) =>
            setQuestion((prev) => ({ ...prev, feedback: e.target.value }))
          }
          placeholder="Add feedback for this question..."
        />
      </div>

      <Button type="submit" className="w-full">
        Save Question
      </Button>
    </form>
  )
}


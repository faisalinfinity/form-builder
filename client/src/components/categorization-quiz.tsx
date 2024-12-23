
import { useState } from 'react'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { DraggableItem } from './draggable-item'
import { CategoryDropZone } from './category-drop-zone'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import type { QuizData } from '@/types/quiz'

const initialQuizData: QuizData = {
  title: "Categorize the following",
  categories: [
    { id: 'country', name: 'Country', color: 'pink' },
    { id: 'city', name: 'City', color: 'yellow' },
  ],
  items: [
    { id: 'paris', content: 'Paris' },
    { id: 'usa', content: 'USA' },
    { id: 'madrid', content: 'Madrid' },
    { id: 'japan', content: 'Japan', categoryId: 'country' },
    { id: 'brazil', content: 'Brazil', categoryId: 'country' },
  ],
  points: 10
}

export function CategorizationQuiz() {
  const [quizData, setQuizData] = useState<QuizData>(initialQuizData)
  const uncategorizedItems = quizData.items.filter(item => !item.categoryId)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setQuizData(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.id === active.id ? { ...item, categoryId: over.id as string } : item
        )
      }))
    }
  }

  const handleReset = () => {
    setQuizData(prev => ({
      ...prev,
      items: prev.items.map(item => ({ ...item, categoryId: undefined }))
    }))
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{quizData.title}</h2>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              className="h-8 w-8"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <div className="bg-white px-3 py-1 rounded-full text-sm">
              {quizData.points} Points
            </div>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          {uncategorizedItems.map((item) => (
            <DraggableItem key={item.id} {...item} />
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {quizData.categories.map((category) => (
            <CategoryDropZone
              key={category.id}
              category={category}
              items={quizData.items}
            />
          ))}
        </div>
      </div>
    </DndContext>
  )
}


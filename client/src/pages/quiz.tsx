'use client'

import { useState } from 'react'
import { QuizBuilder } from "@/components/quiz-builder"
import { QuizRenderer } from "@/components/quiz-renderer"
import { Button } from "@/components/ui/button"
import type { Quiz } from '@/types/quiz'

export default function QuizPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [isBuilding, setIsBuilding] = useState(true)

  const handleSaveQuiz = (savedQuiz: Quiz) => {
    setQuiz(savedQuiz)
    setIsBuilding(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      {isBuilding ? (
        <QuizBuilder  />
      ) : quiz ? (
        <>
          <QuizRenderer quiz={quiz} />
          <Button onClick={() => setIsBuilding(true)} className="mt-8 mx-auto block">
            Back to Quiz Builder
          </Button>
        </>
      ) : (
        <p>No quiz available. Please create one.</p>
      )}
    </main>
  )
}


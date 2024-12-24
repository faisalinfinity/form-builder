'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClozeQuestion } from './cloze-question'
import { ComprehensionBuilder } from './comprehension-builder' 
import { CategorizationQuiz } from './categorization-quiz'
import type { Quiz, Question } from '@/types/quiz'

interface QuizRendererProps {
  quiz: Quiz
}

export function QuizRenderer({ quiz }: QuizRendererProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [score, setScore] = useState<number | null>(null)

  const currentQuestion = quiz.questions[currentQuestionIndex]

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      calculateScore()
    }
  }

  const calculateScore = () => {
    let totalScore = 0
    quiz.questions.forEach((question) => {
      const answer = answers[question.id]
      if (answer) {
        switch (question.type) {
          case 'cloze':
            totalScore += calculateClozeScore(question, answer)
            break
          case 'comprehension':
            totalScore += calculateComprehensionScore(question, answer)
            break
          case 'categorize':
            totalScore += calculateCategorizeScore(question, answer)
            break
        }
      }
    })
    setScore(totalScore)
  }

  const calculateClozeScore = (question: Question, answer: any) => {
    if (question.type !== 'cloze') return 0
    const correctAnswers = question.gaps.filter((gap, index) => gap.answer === answer[index])
    return (correctAnswers.length / question.gaps.length) * question.points
  }

  const calculateComprehensionScore = (question: Question, answer: any) => {
    if (question.type !== 'comprehension') return 0
    const correctAnswers = question.mcqs.filter((mcq) => mcq.correctOptionId === answer[mcq.id])
    return (correctAnswers.length / question.mcqs.length) * question.points
  }

  const calculateCategorizeScore = (question: Question, answer: any) => {
    if (question.type !== 'categorize') return 0
    const correctAnswers = question.items.filter((item) => item.categoryId === answer[item.id])
    return (correctAnswers.length / question.items.length) * question.points
  }

  if (score !== null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Quiz Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your score: {score} out of {quiz.questions.reduce((total, q) => total + q.points, 0)}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{quiz.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Question {currentQuestionIndex + 1} of {quiz.questions.length}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentQuestion.type === 'cloze' && (
            <ClozeQuestion
              question={currentQuestion}
              onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
            />
          )}
          {/* {currentQuestion.type === 'comprehension' && (
            <ComprehensionQuestion
              question={currentQuestion}
              onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
            />
          )} */}
          {currentQuestion.type === 'categorize' && (
            <CategorizationQuiz
              question={currentQuestion}
              onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
            />
          )}
        </CardContent>
      </Card>

      <Button onClick={handleNext} className="w-full">
        {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </Button>
    </div>
  )
}


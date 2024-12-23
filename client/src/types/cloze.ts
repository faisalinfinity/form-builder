export interface ClozeAnswer {
    id: string
    text: string
    isCorrect?: boolean
  }
  
  export interface ClozeQuestion {
    id: string
    title: string
    content: string
    answers: ClozeAnswer[]
    media?: string
    points: number
    feedback?: string
  }
  
  
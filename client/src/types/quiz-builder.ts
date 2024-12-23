export interface QuizFormData {
  title: string
  media: string
  points: number
  categories: Category[]
  items: QuizItem[]
}

export interface Category {
  id: string
  name: string
}

export interface QuizItem {
  id: string
  content: string
  categoryId?: string
}


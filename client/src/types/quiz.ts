export interface Category {
  id: string
  name: string
  color: string
}

export interface Item {
  id: string
  content: string
  categoryId?: string
}

export interface QuizData {
  title: string
  categories: Category[]
  items: Item[]
  points: number
}


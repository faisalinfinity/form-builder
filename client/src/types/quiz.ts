export interface Category {
  id: string;
  name: string;
  color?: string
}

export interface Item {
  id: string
  content: string
  categoryId?: string
}

export interface CategorizeQuiz {
  title: string
  categories?: Category[]
  items?: Item[]
  points?: number
}

export type QuestionType = 'cloze' | 'comprehension' | 'categorize';

export interface BaseQuestion {
  id?: string;
  type?: QuestionType;
  title?: string;
  points?: number;
}

export interface ClozeGap {
  id: string;
  answer?: string;
}

export interface ClozeOption {
  id: string;
  text: string;
}

export interface ClozeQuestion extends BaseQuestion {
  type?: 'cloze';
  content?: string;
  gaps?: ClozeGap[];
  options?: ClozeOption[];
}

export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQ {
  id: string;
  question: string;
  options: MCQOption[];
  correctOptionId: string;
}

export interface ComprehensionQuestion extends BaseQuestion {
  type?: 'comprehension';
  passage?: string;
  mcqs?: MCQ[];
}

export interface Category {
  id: string;
  name: string;
}

export interface CategorizeItem {
  id: string;
  content: string;
  categoryId?: string;
}

export interface CategorizeQuestion extends BaseQuestion {
  type?: 'categorize';
  categories?: Category[];
  items?: CategorizeItem[];
}

export type Question = ClozeQuestion | ComprehensionQuestion | CategorizeQuestion;

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}


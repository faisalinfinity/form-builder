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
  
  export interface Comprehension {
    id: string;
    title: string;
    passage: string;
    mcqs: MCQ[];
    points: number;
  }
  
  